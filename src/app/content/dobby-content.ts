/**
 * Copy for the BatchForge product page (/products/batchforge).
 * Style: sentence case, no comma before "and", commas or colons instead of dashes, full stops on bullets.
 */
import { CapabilitiesContent, CtaBandContent, HelpContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const PIM_HREF = '/products/pim-connect';
const QA_HREF = '/products/complycheck';

const IMG = 'assets/img/dobby/';
const DEMO = '/enhance';

export const DOBBY_HERO: ProductHeroContent = {
  title: [
    { text: 'Entire supplier catalogs,', breakAfter: true },
    { text: 'enhanced overnight.', accent: true },
  ],
  lead: 'BatchForge is the bulk processing engine behind SupplierClarity. Point it at a supplier drop, a PIM export or an SFTP folder and it enhances, standardises and quality-scores thousands of images while your team sleeps.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch BatchForge in action', href: '/products/batchforge#batchforge-video' },
  logo: 'assets/img/logo-batchforge.svg',
  logoAlt: 'BatchForge logo',
  accent: '#0e9aa5',
  chips: [
    { label: 'SFTP · Drive · API drop', tone: 'accent' },
    { label: '12,000+ images per run', tone: 'blue' },
    { label: 'Quality-scored output', tone: 'accent' },
    { label: 'Auto-published to your PIM', tone: 'blue' },
  ],
};

export const DOBBY_VIDEO: ProductVideoContent = {
  id: 'batchforge-video',
  title: [
    { text: 'One supplier drop.', breakAfter: true },
    { text: 'A catalog-ready result by morning.', accent: true },
  ],
  lead: 'BatchForge queues every incoming image, runs the right model per category, and publishes only the files that pass your acceptance rules, with a full quality report for your team.',
  poster: IMG + 'video-poster.webp',
  posterAlt: 'A catalog operations lead reviewing an overnight BatchForge run',
  caption: 'Watch BatchForge video',
  duration: '1:10 min',
  videoUrl: '',
};

export const DOBBY_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Capabilities',
  eyebrowIcon: 'capabilities',
  titleLead: 'What BatchForge does',
  titleAccent: 'for your catalog',
  intervalMs: 3500,
  items: [
    { name: 'Bulk ingest', title: 'Drop a folder. Get a finished batch.', image: IMG + 'cap-1.webp',
      text: 'BatchForge watches SFTP drops, cloud folders and PIM exports, and queues every new supplier image automatically, so no catalog ever waits in an inbox.' },
    { name: 'Category-aware models', title: 'The right engine for every category.', image: IMG + 'cap-2.webp',
      text: 'Pack shots, apparel, electronics and sketch-style art each get the Real-ESRGAN model tuned for them, with per-category rules for scale, background and crop.' },
    { name: 'Rules engine', title: 'Shaped around your acceptance rules.', image: IMG + 'cap-3.webp',
      text: 'Each batch applies the resolution, background and file-weight rules your channels enforce, so images come out compliant the first time. Reviewed by ComplyCheck before publish.',
      link: { label: 'ComplyCheck', href: QA_HREF } },
    { name: 'Quality scoring', title: 'Every output gets a score.', image: IMG + 'cap-4.webp',
      text: 'Sharpness, resolution, background purity and file weight are measured per image, so category managers see one number instead of spot-checking folders.' },
    { name: 'Publishing built in', title: 'Straight back to your PIM.', image: IMG + 'cap-5.webp',
      text: 'Finished images sync straight into your PIM and marketplaces, replacing the old files in place. See how PIM Connect handles every channel.',
      link: { label: 'PIM Connect', href: PIM_HREF } },
    { name: 'Run reports', title: 'From overnight run to morning report.', image: IMG + 'cap-6.webp',
      text: 'BatchForge turns every run into a report on throughput, pass rates and the suppliers who keep sending unusable files, ready to share with your team.' },
  ],
};

export const DOBBY_INDUSTRIES: HelpContent = {
  eyebrow: '',
  titleLead: 'BatchForge for',
  titleAccent: 'every industry',
  lead: 'Tailored enhancement pipelines to optimize catalog workflows across diverse sectors.',
  resultLabel: 'How SupplierClarity helped',
  tabs: [
    {
      label: 'Grocery & FMCG', tone: 'blue', icon: 'document', title: 'Grocery & FMCG',
      intro: 'BatchForge keeps pack shots and labels crisp across a fast-moving range:',
      points: [
        { term: 'Label legibility:', text: 'upscaled pack shots keep every ingredient line readable on a phone screen.' },
        { term: 'Range-wide consistency:', text: 'one background and crop standard across thousands of SKUs.' },
        { term: 'Overnight runs:', text: 'new supplier drops processed before the daily catalog refresh.' },
      ],
      image: IMG + 'ind-ports.webp',
      imageAlt: 'Grocery pack shots lined up in a BatchForge run queue',
      resultText: 'Grocery catalog teams get a shelf-ready range every morning, without a single reshoot email.',
    },
    {
      label: 'Fashion & Apparel', tone: 'purple', icon: 'chat', title: 'Fashion & Apparel',
      intro: 'BatchForge turns supplier snapshots into zoom-ready lookbook images:',
      points: [
        { term: 'Fabric detail:', text: 'weave, stitching and texture restored at 4× resolution.' },
        { term: 'True-to-colour output:', text: 'consistent white balance across suppliers.' },
        { term: 'Marketplace rules:', text: 'crop, margins and file weight applied automatically.' },
      ],
      image: IMG + 'ind-hr.webp',
      imageAlt: 'Two colleagues reviewing enhanced fashion imagery on a laptop',
      resultText: 'Fashion teams publish seller imagery that passes first time and looks like one brand.',
    },
  ],
};

export const DOBBY_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Your data, on demand.',
  titleAccent: 'Your teams, at full speed.',
  // The design's lead runs off the page; the opening and ending are completed here. Please confirm.
  lead: 'BatchForge turns supplier drops into catalog-ready imagery overnight, so your teams get more done and listings go live faster.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Backlogs that grow faster than teams.',
      text: 'Enhancement queues measured in weeks, suppliers chased for reshoots and category managers spot-checking folders by hand.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'Listings that go live the day suppliers send files.',
      text: 'Products reach the shelf the moment imagery passes, so seasonal ranges launch on time and slow suppliers stop delaying revenue.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'More catalog, same headcount.',
      text: 'The pipeline handles the routine work, so the same team onboards more suppliers and categories without adding headcount or tools.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'The technology behind BatchForge',
    title: 'Built on the Real-ESRGAN pipeline',
    text: 'BatchForge runs the same enhancement engine as our public upscaler, tuned per category and wrapped in quality gates your team defines.',
    cta: 'Try the upscaler',
    href: '/enhance',
  },
};

export const DOBBY_CTA: CtaBandContent = {
  titleLead: 'See what BatchForge can',
  titleAccent: 'clear for you.',
  lead: 'Book a demo and we’ll run a live batch of your own supplier images through the pipeline.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Try the upscaler', href: '/enhance' },
};
