/**
 * Copy for the Image APIs page (/services/image-apis).
 * Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", commas instead of dashes, full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/api/';
const ENHANCE = '/enhance';

export const API_HERO: HeroContent = {
  titleLead: 'Enhancement that turns suppliers',
  titleAccent: 'into catalog-ready.',
  titleSegments: [
    { text: 'APIs that turn ' },
    { text: 'supplier uploads', accent: true, breakAfter: true },
    { text: 'into ' },
    { text: 'catalog gold.', accent: true },
  ],
  lead: 'With SupplierClarity’s Image APIs, any system can enhance images on demand: your PIM, your seller portal, your mobile app. One call returns a catalog-ready file.',
  image: IMG + 'hero-network.webp',
  imageAlt: 'Illustration of the enhancement hub connecting stores, PIMs and marketplaces',
  chips: [
    { label: 'REST + webhooks', sub: 'enhance in one call', tone: 'blue', pos: 'top-right' },
    { label: 'Batch endpoints', sub: 'for whole catalogs at once', tone: 'yellow', pos: 'bottom-left' },
  ],
};

/** "Industries": same tabbed card + photo section as "How we help" on other service pages. */
export const API_INDUSTRIES: HelpContent = {
  eyebrowIcon: 'industries',
  eyebrow: 'Industries',
  titleLead: 'Every catalog',
  titleAccent: 'enhances differently.',
  lead: 'Whatever your scale, the right enhancement APIs help you onboard faster, publish sooner and keep converting.',
  resultLabel: 'How SupplierClarity helped',
  tabs: [
    {
      label: 'Established retailers',
      tone: 'blue',
      icon: 'legacy',
      kicker: 'Established retailers',
      title: 'Legacy imagery holds back new listings.',
      points: [
        { text: 'Years of supplier photos below today’s standards.' },
        { text: 'Channels expect consistent, compliant imagery.' },
        { text: 'QA teams need traceable, auditable enhancement.' },
      ],
      image: IMG + 'ind-enterprise.webp',
      imageAlt: 'A national retailer’s catalog imagery being enhanced at scale',
      resultText: 'A national retailer’s PIM now enhances every incoming supplier image through one governed API, with quality scores attached to each asset.',
    },
    {
      label: 'Digital-native marketplaces',
      tone: 'yellow',
      icon: 'orbit',
      kicker: 'Digital-native marketplaces',
      title: 'Seller growth that needs automation to keep up.',
      points: [
        { text: 'Seller uploads arrive around the clock.' },
        { text: 'Listing quality gates must run instantly.' },
        { text: 'Rejection feedback needs to reach sellers fast.' },
      ],
      image: IMG + 'ind-digital.webp',
      imageAlt: 'A marketplace operations lead watching the enhancement queue',
      resultText: 'A fast-growing marketplace enhances thousands of daily seller uploads through batch endpoints, and publishes only files that pass its rules.',
    },
    {
      label: 'Brand ecosystems',
      tone: 'plum',
      icon: 'cloud',
      kicker: 'Brand ecosystems',
      title: 'Your brands, one imagery standard.',
      points: [
        { text: 'Suppliers and agencies send mixed-quality files.' },
        { text: 'Manual enhancement causes delays and drift.' },
        { text: 'Modern retail needs one unified pipeline.' },
      ],
      image: IMG + 'ind-ecosystem.webp',
      imageAlt: 'A brand team checking enhancement output on a tablet',
      resultText: 'A consumer-brand group replaced manual touch-ups with one enhancement API, giving every brand team catalog-ready imagery from a single source.',
    },
  ],
};

/** Pinned while the visitor scrolls; each quarter of the scroll shows the next service. */
export const API_SERVICES_RING: DeliveryContent = {
  eyebrow: 'Services',
  title: 'Enhance it. Score it.',
  titleAccent: 'Publish it everywhere.',
  lead: 'From a single image to a national catalog, built for retail and marketplace workloads, and ready to scale as you grow.',
  centered: true,
  steps: [
    {
      label: 'Design & strategy', title: 'Design & strategy', tone: 'teal', icon: 'cloud',
      intro: 'Plan enhancement around your channels and acceptance rules.',
      points: [
        { text: 'Rule packs mapped to each marketplace’s requirements.' },
        { text: 'Category profiles for pack shots, apparel, electronics and art.' },
        { text: 'Output contracts: size, format, background and naming.' },
        { text: 'Documentation and sandboxes for your developers.' },
      ],
    },
    {
      label: 'Enhancement engines', title: 'Enhancement engines', tone: 'green', icon: 'orbit',
      intro: 'Turn any supplier upload into catalog-ready imagery, on demand.',
      points: [
        { text: 'Real-ESRGAN-class super-resolution per category.' },
        { text: 'Background, crop and file-weight normalisation.' },
        { text: 'Webhooks that fire the moment a job finishes.' },
        { text: 'REST endpoints with predictable, versioned output.' },
      ],
    },
    {
      label: 'Delivery & management', title: 'Delivery & management', tone: 'purple', icon: 'database',
      intro: 'Run, monitor and scale enhancement as your catalog grows.',
      points: [
        { text: 'Autoscaling queues for catalog-sized batches.' },
        { text: 'Rate limiting, traffic shaping and usage metering.' },
        { text: 'Quality dashboards, usage analytics and audit trails.' },
        { text: 'CDN delivery of every enhanced file.' },
      ],
    },
    {
      label: 'Trust & security', title: 'Trust & security', tone: 'rose', icon: 'shield',
      intro: 'Security built into every call, from access to storage.',
      points: [
        { text: 'OAuth2 and signed-URL access control.' },
        { text: 'Automatic deletion of processed supplier files.' },
        { text: 'GDPR-compliant processing agreements.' },
        { text: 'Threat modeling and continuous monitoring.' },
      ],
    },
  ],
};

export const API_CLOUD = {
  eyebrow: 'Infrastructure',
  titleAccent: 'Catalog-scale',
  titleRest: 'from day one.',
  lead: 'Your enhancement runs on highly available infrastructure that scales as your catalog grows.',
  items: [
    'Autoscaling queues for catalog-sized batches.',
    'GPU or CPU capacity matched to each category’s budget.',
    'Hybrid delivery: CDN, direct PIM push or signed URLs.',
    'Built-in CI/CD for rapid model and rule updates.',
  ],
};

/** Hovering a card fades its photo, tints the card (tint) and shows the text. */
export const API_WHY = {
  titleLead: 'Why',
  titleAccent: 'SupplierClarity?',
  lead: 'Image AI and catalog expertise, focused on one thing: imagery that passes and converts.',
  cards: [
    { title: 'Fluent in retail imagery', text: 'From grocery to fashion, category know-how in every rule pack we build.', image: IMG + 'why-finance.webp', tint: '#e7f5f6' },
    { title: 'Catalog-scale by default', text: 'Proven on batches from one image to two million.', image: IMG + 'why-cloud.webp', tint: '#fdf2d9' },
    { title: 'Security in every layer', text: 'Supplier files processed, scored and deleted on schedule.', image: IMG + 'why-security.webp', tint: '#d7ecef' },
    { title: 'Rules before pixels', text: 'Every pipeline starts with your channel requirements.', image: IMG + 'why-strategy.webp', tint: '#f0f9fa' },
  ],
};

export const API_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Get more from every system',
  titleAccent: 'you already run.',
  lead: 'Enhancement APIs turn the supplier uploads you already receive into catalog-ready assets, without reshoots.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Imagery stuck below channel standards.',
      text: 'Every new channel, category or supplier adds custom QA work, extra cost and longer timelines.',
      image: IMG + 'impact-solves.webp',
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'New shelf-ready assets from files you own.',
      text: 'Publish enhanced imagery on what you receive today, protecting your suppliers’ original investment while opening new channels.',
      image: IMG + 'impact-value.webp',
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'Every channel cheaper than the last.',
      text: 'One enhancement API replaces per-channel touch-ups, so each new marketplace is faster and costs less.',
      image: IMG + 'impact-efficiency.webp',
    },
  ],
  action: {
    kicker: 'See it in action',
    title: 'The Clarity Upscaler, live on this site',
    text: 'The same engine that powers these APIs, running in your browser right now: upload a supplier photo and see the output quality yourself.',
    cta: 'Try the upscaler',
    href: ENHANCE,
  },
};

export const API_CTA = {
  titleLead: 'Ready to enhance',
  titleAccent: 'what you receive?',
  lead: 'One enhancement API between your suppliers and your catalog, so every listing goes live sharp.',
  image: IMG + 'cta-servers.webp',
  imageAlt: 'Monitors showing enhancement queue dashboards in a server room',
  secondaryLabel: 'Explore the platform',
  secondaryHref: '/#services',
};
