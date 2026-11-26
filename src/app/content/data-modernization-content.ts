/**
 * Copy for the Data modernization service page (/services/data-modernization), from the
 * "Data Modernization V1.1" design. Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", commas instead of dashes, full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/data/';

export const DATA_HERO: HeroContent = {
  titleLead: 'From scattered assets to',
  titleAccent: 'one catalog truth.',
  lead: 'With SupplierClarity’s catalog data practice, supplier files, PIM records and channel rules become one governed foundation that lets enhancement and QA grow with your assortment.',
  image: IMG + 'hero-pipeline.webp',
  imageAlt: 'Illustration of product images from many suppliers flowing through a governed layer into the catalog',
  chips: [
    { label: 'Real-time ingest pipelines', tone: 'blue' },
    { label: 'Quality scores on every asset', tone: 'blue' },
    { label: 'Trustworthy catalog analytics', tone: 'yellow' },
  ],
};

export const DATA_HELP: HelpContent = {
  eyebrow: 'How we help',
  titleLead: 'Your catalog,',
  titleAccent: 'working as one.',
  lead: 'Modernize what’s scattered, connect every supplier file to its SKU and turn imagery into intelligence that helps your catalog grow.',
  resultLabel: 'The result',
  tabs: [
    {
      label: 'From supplier inboxes to one asset library',
      tone: 'blue',
      icon: 'database',
      title: 'From supplier inboxes to one asset library',
      intro: 'Turn fragmented image stores into a governed catalog library built for enhancement and AI. Our approach blends:',
      points: [
        { term: 'Real-time ingest pipelines', text: 'for instant intake from email, SFTP and portals.' },
        { term: 'SKU and variant linking', text: 'so every file lands next to the product it shows.' },
        { term: 'ML-driven quality scoring', text: 'for imagery decisions you can trust.' },
      ],
      image: IMG + 'help-team.webp',
      imageAlt: 'Two catalog engineers reviewing the asset library on a laptop',
      resultText: 'Image foundations that evolve with your assortment, feeding enhancement models and channel systems with reliable, explainable assets.',
    },
    {
      label: 'Answers your catalog can trust',
      tone: 'purple',
      icon: 'code',
      title: 'Answers your catalog can trust',
      intro: 'Turn raw image data into explainable catalog intelligence that drives real merchandising outcomes, with quality scores, rejection analytics and predictive QA:',
      points: [
        { term: 'Faster answers', text: 'to “why did this listing get rejected?” with per-rule analytics.' },
        { term: 'Higher acceptance rates', text: 'through ML-based monitoring of suppliers and categories.' },
        { term: 'Faster decisions', text: 'powered by quality trends, so you fix root causes sooner.' },
      ],
      image: IMG + 'help-analytics.webp',
      imageAlt: 'A category manager reviewing imagery quality dashboards',
      resultText: 'A continuously improving catalog ecosystem where every image, score and rejection is faster to trace, more accurate and grounded in trusted product data.',
    },
  ],
};

/** Pinned while the visitor scrolls; each third of the scroll shows the next layer. */
export const DATA_LAYERS: DeliveryContent = {
  eyebrow: 'Services',
  title: 'Three layers,',
  titleAccent: 'one catalog foundation.',
  lead: 'Supplier files, PIM records and channel rules, connected with context, so every image is accurate, accessible and ready for enhancement, compliance and AI, and built to scale as your assortment grows.',
  steps: [
    {
      label: 'Core catalog capabilities',
      title: 'Core catalog capabilities',
      tone: 'teal',
      icon: 'code',
      points: [
        { strong: 'Cloud asset library:', text: 'one governed home for every supplier file, optimized for AI scale.' },
        { strong: 'Real-time ingest:', text: 'event-driven intake for instant enhancement triggers.' },
        { strong: 'Automated asset governance:', text: 'AI-powered lineage, duplicates, anomaly detection and access controls.' },
        { strong: 'Rule-aware retrieval:', text: 'contextual, channel-aware asset lookup for your systems.' },
      ],
    },
    {
      label: 'Catalog-driven business growth',
      title: 'Catalog-driven business growth',
      tone: 'purple',
      icon: 'orbit',
      points: [
        { strong: 'Faster decision-making:', text: 'quality insights in hours, not weeks, with dashboards per supplier and category.' },
        { strong: 'Trusted catalog intelligence:', text: 'governed, explainable pipelines reduce inconsistencies.' },
        { strong: 'Predictive insights at scale:', text: 'imagery data that powers forecasting, QA and automation as you grow.' },
        { strong: 'Compliance by design:', text: 'automated rule lineage, policy enforcement and audit-ready reporting.' },
      ],
    },
    {
      label: 'Smart catalog outcomes',
      title: 'Smart catalog outcomes',
      tone: 'green',
      icon: 'database',
      points: [
        { strong: '70% reduction', text: 'in manual QA with automated quality scores.' },
        { strong: '95% asset traceability', text: 'through automated lineage tracking.' },
        { strong: '30 days', text: 'to deploy a modern, governed asset library.' },
      ],
    },
  ],
};

export const DATA_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Trusted numbers. Faster insight.',
  titleAccent: 'Smarter AI.',
  lead: 'One governed asset foundation, so every enhancement, QA verdict and AI project runs on imagery your team can trust.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Scattered files, one governed view.',
      text: 'Supplier images from inboxes, drives and legacy DAMs in one governed view, so scores match and enhancement scales.',
      image: IMG + 'impact-solves.webp',
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Same assets, faster merchandising.',
      text: 'Category managers, QA and AI work from the same governed library, so decisions are faster, easier to defend and ready to scale.',
      image: IMG + 'impact-value.webp',
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'Insight, not file hunting.',
      text: 'Automated ingest and governance cut manual file wrangling, so teams spend their time on assortment, not assembly.',
      image: IMG + 'impact-efficiency.webp',
    },
  ],
  action: {
    kicker: 'See it in the pipeline',
    title: 'BatchForge, our bulk enhancement engine',
    text: 'It turns every supplier drop into scored, catalog-ready assets overnight.',
    cta: 'Explore BatchForge',
    href: '/products/batchforge',
  },
};

export const DATA_CTA = {
  titleLead: 'Ready to put your imagery',
  titleAccent: 'to work?',
  lead: 'Your supplier files shouldn’t sit in inboxes. SupplierClarity modernizes them into AI-ready catalog foundations that speed up listings, reduce rejections and scale with your growth.',
  image: IMG + 'cta-team.webp',
  imageAlt: 'A team reviewing catalog quality dashboards on a large screen in a meeting room',
  secondaryLabel: 'Explore the platform',
  secondaryHref: '/#services',
};
