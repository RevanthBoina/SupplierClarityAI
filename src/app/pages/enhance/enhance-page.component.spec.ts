import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnhancePageComponent } from './enhance-page.component';

/** Health payload with a working engine. */
const HEALTH_READY = {
  ok: true,
  engine: {
    available: true,
    mode: 'engine',
    detail: 'The enhancement worker is ready.',
    hint: '',
    python: '3.11.2',
    packages: { ncnn: '1.0', numpy: '2.0', pillow: '13.0' },
    models: {
      balanced: { available: true },
      sketch: { available: true },
      'max-detail': { available: true },
    },
  },
  queue: { queued: 0, active: 0, capacity: 24 },
  limits: { maxUploadBytes: 12582912, maxInputPixels: 1600000, scales: [1, 2, 3, 4], formats: ['png', 'jpg'] },
  models: [
    { id: 'balanced', label: 'Catalog Balanced', scale: 4, avgMsPerMp: 12000, available: true },
    { id: 'sketch', label: 'Fast Sketch', scale: 4, avgMsPerMp: 8000, available: true },
    { id: 'max-detail', label: 'Photo Max Detail', scale: 4, avgMsPerMp: 190000, available: true },
  ],
};

const HEALTH_BROWSER = {
  ...HEALTH_READY,
  engine: { ...HEALTH_READY.engine, available: false, mode: 'browser', detail: 'No worker.' },
  models: HEALTH_READY.models.map((model) => ({ ...model, available: false })),
};

const JOB_ID = '11111111-2222-4333-8444-555555555555';

const JOB_DONE = {
  id: JOB_ID,
  status: 'done',
  stage: 'done',
  progress: 100,
  tiles: { done: 4, total: 4 },
  queuePosition: 0,
  queueLength: 0,
  model: 'balanced',
  outscale: 4,
  format: 'png',
  error: null,
  errorCode: null,
  input: { name: 'photo.jpg', bytes: 3000, ext: '.jpg', mime: 'image/jpeg', width: 440, height: 440 },
  output: { file: 'result.png', bytes: 240000, width: 880, height: 880, ms: 4200, tiles: 4 },
  files: {
    result: `/files/${JOB_ID}/result.png`,
    preview: `/files/${JOB_ID}/preview.jpg`,
    original: `/files/${JOB_ID}/input.jpg`,
  },
  createdAt: new Date().toISOString(),
  startedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  elapsedMs: 4200,
};

function shim(name: string, value: unknown): void {
  (window as unknown as Record<string, unknown>)[name] = value;
  (globalThis as unknown as Record<string, unknown>)[name] = value;
}

function installBrowserShims(): void {
  const createObjectURL = () => 'blob:supplier-image';
  const revokeObjectURL = () => undefined;
  Object.assign(URL, { createObjectURL, revokeObjectURL });

  const matchMedia = () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  });
  shim('matchMedia', matchMedia);

  class FakeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): unknown[] {
      return [];
    }
  }
  shim('IntersectionObserver', FakeObserver);
  shim('ResizeObserver', FakeObserver);
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('EnhancePageComponent', () => {
  let fixture: ComponentFixture<EnhancePageComponent>;
  let http: HttpTestingController;

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent?.replace(/\s+/g, ' ') ?? '';
  }

  function setup(health: unknown = HEALTH_READY): void {
    TestBed.configureTestingModule({
      imports: [EnhancePageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EnhancePageComponent);
    fixture.detectChanges();
    http.expectOne('/api/health').flush(health);
    fixture.detectChanges();
  }

  /** Drop a file without depending on the browser's image decoding. */
  async function chooseFile(file: File): Promise<void> {
    const comp = fixture.componentInstance as unknown as {
      accept: (f: File) => Promise<void>;
    };
    const spy = jest.spyOn(comp as unknown as Record<'readDimensions', () => Promise<unknown>>, 'readDimensions');
    spy.mockResolvedValue({ width: 440, height: 440 });
    void comp.accept(file);
    await flush();
  }

  function file(name = 'photo.jpg'): File {
    return new File([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], name, { type: 'image/jpeg' });
  }

  beforeAll(() => installBrowserShims());

  afterEach(() => {
    fixture?.destroy();
    http.verify();
  });

  it('renders the dropzone and the engine status', () => {
    setup();
    expect(text()).toContain('Drop a supplier photo here');
    expect(text()).toContain('Enhancement engine ready');
    expect(text()).toContain('Catalog Balanced');
  });

  it('starts enhancement as soon as a file is chosen and renders the result', async () => {
    setup();
    await chooseFile(file());

    // The upload happens without a second click.
    const create = http.expectOne('/api/jobs');
    expect(create.request.body).toBeInstanceOf(FormData);
    expect((create.request.body as FormData).get('model')).toBe('balanced');
    expect((create.request.body as FormData).get('outscale')).toBe('4');
    create.flush({ id: JOB_ID, status: 'queued', queuePosition: 0, estimatedMs: 5000 });
    await flush();
    fixture.detectChanges();
    expect(text()).toContain('Queued');

    await wait(520);
    http.expectOne(`/api/jobs/${JOB_ID}`).flush({
      ...JOB_DONE,
      status: 'processing',
      stage: 'enhancing',
      progress: 55,
      output: null,
      files: null,
    });
    await flush();
    fixture.detectChanges();
    expect(text()).toContain('Enhancing detail');

    await wait(520);
    http.expectOne(`/api/jobs/${JOB_ID}`).flush(JOB_DONE);
    await flush();
    fixture.detectChanges();

    expect(text()).toContain('Catalog-ready result');
    expect(text()).toContain('AI engine');
    expect(text()).toContain('880×880');

    const host = fixture.nativeElement as HTMLElement;
    const download = host.querySelector('.result__actions a[download]');
    expect(download?.getAttribute('href')).toBe(JOB_DONE.files.result);
    expect(download?.getAttribute('download')).toBe('clarity-photo-4x.png');
    expect(host.querySelector('.compare > img')?.getAttribute('src')).toBe('blob:supplier-image');
    expect(host.querySelector('.compare__after')?.getAttribute('src')).toBe(JOB_DONE.files.preview);
  });

  it('shows the API error when the upload is rejected', async () => {
    setup();
    await chooseFile(file('huge.jpg'));

    http.expectOne('/api/jobs').flush(
      { error: 'That image is 3000×3000px. The CPU engine accepts up to 1.6 MP.', code: 'image_too_large' },
      { status: 400, statusText: 'Bad Request' },
    );
    await flush();
    fixture.detectChanges();

    expect(text()).toContain('That image is 3000×3000px');
    expect(text()).toContain('Try again');
  });

  it('keeps the engines selectable in browser mode', () => {
    setup(HEALTH_BROWSER);
    expect(text()).toContain('Browser preview mode');
    const engineButtons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.opt .seg__item');
    expect(engineButtons.length).toBeGreaterThanOrEqual(3);
    expect(engineButtons[0].disabled).toBe(false);
  });

  it('cancels a running job', async () => {
    setup();
    await chooseFile(file());
    http.expectOne('/api/jobs').flush({ id: JOB_ID, status: 'queued', queuePosition: 0, estimatedMs: 5000 });
    await flush();
    fixture.detectChanges();

    (fixture.componentInstance as unknown as { cancel: () => void }).cancel();
    http.expectOne(`/api/jobs/${JOB_ID}`).flush({ id: JOB_ID, status: 'canceled' });
    await flush();
    fixture.detectChanges();

    expect(text()).toContain('Enhancement canceled.');
  });
});
