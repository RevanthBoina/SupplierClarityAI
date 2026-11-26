/**
 * Copy for the ComplyCheck product page (/products/complycheck), from the "FieldZapp V1" design.
 * Hero animation follows the FieldZapp recording. Images marked PLACEHOLDER are cut from the design and screenshots.
 */
import { CapabilitiesContent, CtaBandContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const IMG = 'assets/img/fieldzapp/';
const DEMO = '/enhance';
const ENHANCE = '/enhance';

export const FZ_HERO: ProductHeroContent = {
  title: [
    { text: 'Every image checked,', breakAfter: true },
    { text: 'before it goes live.', accent: true },
  ],
  lead: 'ComplyCheck runs every product image against your marketplaces’ rules: resolution, background, crop, margins and file weight, and flags only what genuinely needs a human, before listings ever fail.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch ComplyCheck in action', href: '/products/complycheck#complycheck-video' },
  logo: 'assets/img/logo-complycheck.svg',
  logoAlt: 'ComplyCheck logo',
  accent: '#f5a623',
  // Motion measured from the FieldZapp recording: dots swing together (≈2.15s each way); logo and chips float with them
  orbit: {
    innerR: 136,
    logoSize: 45.5,
    backdrop: 'plain',
    bob: { logo: -0.45, chips: -0.9 },
    dots: [
      { ring: 'inner', from: 0, to: 30, solid: true, dur: 2.15 },
      { ring: 'outer', from: -38, to: -71, solid: true, dur: 2.15 },
      { ring: 'inner', from: 190, to: 220, solid: false, dur: 2.15 },
      { ring: 'outer', from: 141, to: 110, solid: false, dur: 2.15 },
      { ring: 'outer', from: 235, to: 200, solid: false, dur: 2.15 },
    ],
  },
  chips: [
    { label: 'Works offline', tone: 'accent' },
    { label: 'Live location', tone: 'blue' },
    { label: 'Smart scheduling', tone: 'accent' },
    { label: 'Instant doc upload', tone: 'blue' },
  ],
};

export const FZ_VIDEO: ProductVideoContent = {
  id: 'fieldzapp-video',
  title: [
    { text: 'From upload to verdict,', breakAfter: true },
    { text: 'in seconds.', accent: true },
  ],
  lead: 'ComplyCheck uses AI to review every enhanced image against channel rule packs, cutting manual QA, rejection loops and back-and-forth with suppliers, so more listings go live right the first time.',
  poster: IMG + 'video-poster.webp',
  posterAlt: 'A QA lead reviewing ComplyCheck verdicts on a monitor',
  caption: 'Watch ComplyCheck video',
  duration: '1:30 min',
  videoUrl: '',
};

export const FZ_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Key features',
  eyebrowIcon: 'industries',
  titleLead: 'Built for catalog QA.',
  titleAccent: 'Ready before publish.',
  lead: 'Keep category managers, QA and suppliers in sync, so listings go live on time and acceptance rates stay high.',
  pills: ['Cut rejection loops', 'Automate channel rules', 'Real-time pass rates', 'Explain every verdict'],
  intervalMs: 3500,
  items: [
    { name: 'Rules at a glance', image: IMG + 'cap-1.webp',
      text: 'Every channel rule pack on one screen, with real-time updates when marketplaces change requirements, so QA plans the day in seconds.' },
    { name: 'Per-image verdicts', image: IMG + 'cap-2.webp',
      text: 'Full check details at a glance, so reviewers see exactly which rule failed and why, and approve or fix in one pass.' },
    { name: 'Supplier feedback loops', image: IMG + 'cap-3.webp',
      text: 'Rejections become plain-language instructions suppliers can act on, cutting the back-and-forth that slows onboarding.' },
    { name: 'Pass-rate dashboards', image: IMG + 'cap-4.webp',
      text: 'Acceptance rates per supplier, category and channel, so teams spot chronic offenders and fix the root cause.' },
    { name: 'Agentic review', image: IMG + 'cap-5.webp',
      text: 'AI agents pre-review every batch, so humans see only the borderline cases. ComplyCheck explains every verdict with the rule that triggered it.' },
  ],
};

export const FZ_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Service that',
  titleAccent: 'never skips a beat.',
  lead: 'AI-powered rule packs, agentic review and supplier feedback, so every listing passes QA the first time.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Rejection loops that never end.',
      text: 'Listings bounced for resolution or background, suppliers re-shooting images that AI could fix and QA teams buried in spot checks.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'Catalogs that pass the first time.',
      text: 'Higher first-pass acceptance and fewer reshoot requests from the suppliers you already have.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'QA that reviews only the exceptions.',
      text: 'Agents clear the routine checks, verdicts arrive in seconds and more gets published every shift.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'The data behind the verdicts',
    title: 'Catalog data by SupplierClarity',
    text: 'Turn every verdict into catalog insight on one governed data foundation.',
    cta: 'Explore catalog data',
    href: '/services/catalog-data',
  },
};

export const FZ_CTA: CtaBandContent = {
  titleLead: 'See how much more',
  titleAccent: 'your catalog can pass.',
  lead: 'Book a demo and see ComplyCheck run your channel rules against a live batch of supplier images.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Try the upscaler', href: ENHANCE },
};
