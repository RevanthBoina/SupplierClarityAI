/**
 * Copy for the PIM Connect product page (/products/pim-connect), from the "QuickQode V1.1" design.
 * Hero animation follows the QuickQode recording. Images marked PLACEHOLDER are cut from the design and screenshots.
 */
import { CapabilitiesContent, CtaBandContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const IMG = 'assets/img/quickqode/';
const DEMO = '/enhance';
const ENHANCE = '/enhance';
const QA_HREF = '/products/complycheck';

export const QQ_HERO: ProductHeroContent = {
  title: [
    { text: 'Enhanced imagery.', breakAfter: true },
    { text: 'Every channel.', breakAfter: true },
    { text: 'In sync.', accent: true },
  ],
  lead: 'PIM Connect syncs enhanced imagery into your PIM, marketplaces and store systems automatically, so every channel serves the same catalog-ready files.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch PIM Connect in action', href: '/products/pim-connect#pim-connect-video' },
  logo: 'assets/img/logo-pimconnect.svg',
  logoAlt: 'PIM Connect logo',
  accent: '#12505e',
  // Motion measured from the QuickQode recording: all dots swing together (≈1.95s each way) while the logo bobs
  orbit: {
    innerR: 136,
    logoSize: 38.5,
    bob: { logo: 1.7, chips: -0.9 },
    backdrop: 'halo',
    dots: [
      { ring: 'inner', from: 0, to: 30, solid: true, dur: 1.95 },
      { ring: 'outer', from: -38, to: -71, solid: true, dur: 1.95 },
      { ring: 'inner', from: 190, to: 220, solid: false, dur: 1.95 },
      { ring: 'outer', from: 141, to: 110, solid: false, dur: 1.95 },
      { ring: 'outer', from: 235, to: 200, solid: false, dur: 1.95 },
    ],
  },
  chips: [
    { label: 'AI code generation', tone: 'accent' },
    { label: 'Unit tests in seconds', tone: 'blue' },
    { label: 'Smart code comments', tone: 'accent' },
    { label: 'Code translation', tone: 'blue' },
  ],
};

export const QQ_VIDEO: ProductVideoContent = {
  id: 'quickqode-video',
  title: [
    { text: 'From enhancement', breakAfter: true },
    { text: 'to every channel,', breakAfter: true },
    { text: 'automatically.', accent: true },
  ],
  lead: 'PIM Connect puts the finished catalog to work. Enhanced images land in your PIM with quality scores attached, then flow to marketplaces and stores through connectors that keep every channel in sync.',
  poster: IMG + 'video-poster.webp',
  posterAlt: 'Two catalog leads reviewing channel sync status on a monitor',
  caption: 'Watch PIM Connect video',
  duration: '2:30 min',
  videoUrl: '',
};

export const QQ_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Capabilities',
  eyebrowIcon: 'capabilities',
  titleLead: 'What PIM Connect does',
  titleAccent: 'for your catalog',
  intervalMs: 3500,
  items: [
    { name: 'PIM and DAM sync', image: IMG + 'cap-1.webp',
      text: 'Enhanced images land in your PIM or DAM in place, with names, variants and metadata preserved, so nothing falls out of order.' },
    { name: 'Marketplace connectors', image: IMG + 'cap-2.webp',
      text: 'Channel connectors push the right file size, crop and background to each marketplace, so listings pass the first time.' },
    { name: 'Quality metadata', image: IMG + 'cap-3.webp',
      text: 'Every synced image carries its quality scores, so category teams can sort, filter and prioritize by measured clarity.' },
    { name: 'Webhook triggers', image: IMG + 'cap-4.webp',
      text: 'Real-time webhooks tell your systems the moment enhancement finishes, ideal for just-in-time publishing.',
      link: { label: 'image APIs', href: '/services/image-apis' } },
  ],
};

export const QQ_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Every developer,',
  titleAccent: 'delivering more.',
  lead: 'Automated sync does the heavy lifting after enhancement, so your catalog teams stay focused on assortment, not file juggling.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Channels that drift out of sync.',
      text: 'Marketplaces showing old images, PIM exports lagging behind and teams re-uploading files channel by channel.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'One catalog, everywhere it sells.',
      text: 'Every channel serves the same enhanced files, so the brand looks consistent and listings stay compliant.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'Publish without the busywork.',
      text: 'Sync runs itself, so the same team keeps more channels current without re-uploading anything.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'Check it with',
    title: 'Compliance checks by ComplyCheck',
    text: 'Run channel rules against every synced image before it goes live.',
    cta: 'Explore ComplyCheck',
    href: QA_HREF,
  },
};

export const QQ_CTA: CtaBandContent = {
  titleLead: 'Put enhanced imagery',
  titleAccent: 'to work everywhere.',
  lead: 'Book a demo and watch PIM Connect sync a live batch into your PIM and marketplaces.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Try the upscaler', href: ENHANCE },
};
