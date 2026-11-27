import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface EnhanceModel {
  id: string;
  label: string;
  about?: string;
  scale: number;
  avgMsPerMp: number;
  available?: boolean;
}

export interface EngineStatus {
  available: boolean;
  mode: 'engine' | 'browser';
  detail: string;
  hint: string;
  python: string | null;
  packages: Record<string, string | null>;
  models: Record<string, { available: boolean; missing?: string[] }>;
}

export interface EngineLimits {
  maxUploadBytes: number;
  maxInputPixels: number;
  scales: number[];
  formats: string[];
}

export interface HealthResponse {
  ok: boolean;
  engine: EngineStatus;
  queue: { queued: number; active: number; capacity: number };
  limits: EngineLimits;
  models: EnhanceModel[];
}

export interface JobView {
  id: string;
  status: 'queued' | 'processing' | 'done' | 'error' | 'canceled';
  stage: string;
  progress: number;
  tiles?: { done: number; total: number } | null;
  queuePosition: number;
  queueLength: number;
  model: string;
  outscale: number;
  format: 'png' | 'jpg';
  error: string | null;
  errorCode: string | null;
  input: { name: string; bytes: number; ext: string; mime: string; width: number; height: number };
  output: { file: string; bytes: number; width: number; height: number; ms: number | null; tiles: number } | null;
  files: { result: string; preview: string; original: string } | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  elapsedMs: number | null;
}

export interface CreateJobResponse {
  id: string;
  status: string;
  queuePosition: number;
  estimatedMs: number;
}

export interface JobRequest {
  model: string;
  outscale: number;
  format: 'png' | 'jpg';
}

export const DEFAULT_MODELS: EnhanceModel[] = [
  { id: 'balanced', label: 'Catalog Balanced', about: 'The everyday workhorse for product photography.', scale: 4, avgMsPerMp: 15000 },
  { id: 'sketch', label: 'Fast Sketch', about: 'Smallest and fastest, best for flat art and line work.', scale: 4, avgMsPerMp: 8500 },
  { id: 'max-detail', label: 'Photo Max Detail', about: 'Deepest detail restoration; slow on CPU.', scale: 4, avgMsPerMp: 320000 },
];

/**
 * Thin typed client for the enhancement API. All calls are same-origin, so the
 * same code works behind `ng serve` (proxy), the Express host and any static
 * deployment that has the API next to it.
 */
@Injectable({ providedIn: 'root' })
export class EnhanceApiService {
  private readonly http = inject(HttpClient);

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>('/api/health');
  }

  models(): Observable<EnhanceModel[]> {
    return this.http.get<EnhanceModel[]>('/api/models');
  }

  create(file: File, request: JobRequest): Observable<CreateJobResponse> {
    const body = new FormData();
    body.append('image', file, file.name || 'supplier-image');
    body.append('model', request.model);
    body.append('outscale', String(request.outscale));
    body.append('format', request.format);
    return this.http.post<CreateJobResponse>('/api/jobs', body);
  }

  job(id: string): Observable<JobView> {
    return this.http.get<JobView>(`/api/jobs/${id}`);
  }

  cancel(id: string): Observable<{ id: string; status: string }> {
    return this.http.delete<{ id: string; status: string }>(`/api/jobs/${id}`);
  }

  /**
   * True when the API itself is missing rather than rejecting the image —
   * i.e. the host has no enhancement worker and the page should fall back to
   * in-browser upscaling.
   */
  isEngineUnavailable(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) return false;
    if (error.status === 0) return true;
    if ([404, 405, 501, 502, 503, 504].includes(error.status)) {
      const code = (error.error as { code?: string } | null)?.code;
      return !code || code === 'engine_unavailable';
    }
    return false;
  }

  messageFor(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { error?: string; hint?: string } | null;
      return body?.error || body?.hint || error.message || 'The request failed.';
    }
    return error instanceof Error ? error.message : 'The request failed.';
  }
}
