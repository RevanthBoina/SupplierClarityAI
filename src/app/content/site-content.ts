/**
 * All copy for the SupplierClarity AI homepage.
 * Keeping it in one place means marketing edits never touch component markup.
 * Links marked '#' have no destination yet.
 */

export interface NavLink { label: string; href: string; }
/** A top-level menu item; `children` appear as a drop-down on hover/focus (and indented on mobile). */
export interface NavItem extends NavLink { children?: NavLink[]; }

/** Platform capability pages (see app.routes.ts) */
export const AGENTIC_AI_HREF = '/services/agentic-qa';
export const INFRA_AUTOMATION_HREF = '/services/workflow-automation';
export const DATA_MODERNIZATION_HREF = '/services/catalog-data';
export const API_SERVICES_HREF = '/services/image-apis';
export const INSURELIV_HREF = '/enhance';
export const DOBBY_HREF = '/products/batchforge';
export const QUICKQODE_HREF = '/products/pim-connect';
export const FIELDZAPP_HREF = '/products/complycheck';

/** Primary CTA across the site: the live upscaler tool. */
export const CONSULTATION_HREF = '/enhance';

/**
 * Header menu. Add each new page to the right parent's `children` (Products, Platform, …).
 * A parent with no children is a plain link.
 */
export const NAV_LINKS: NavItem[] = [
  {
    label: 'Product',
    href: '/#products',
    children: [
      { label: 'Clarity Upscaler', href: INSURELIV_HREF },
      { label: 'BatchForge', href: DOBBY_HREF },
      { label: 'PIM Connect', href: QUICKQODE_HREF },
      { label: 'ComplyCheck', href: FIELDZAPP_HREF },
    ],
  },
  {
    label: 'Platform',
    href: '/#services',
    children: [
      { label: 'Image APIs', href: API_SERVICES_HREF },
      { label: 'Catalog data', href: DATA_MODERNIZATION_HREF },
      { label: 'Workflow automation', href: INFRA_AUTOMATION_HREF },
      { label: 'Agentic QA', href: AGENTIC_AI_HREF },
    ],
  },
  { label: 'Industries', href: '/#industries' },
  { label: 'Insights', href: '/#case-studies' },
  {
    label: 'Company',
    href: '/company/purpose-leadership',
    children: [
      { label: 'Purpose & leadership', href: '/company/purpose-leadership' },
      { label: 'The Clarity framework', href: '/company/framework' },
      { label: 'Clarity for Good', href: '/company/social-initiative' },
      { label: 'Global presence', href: '/company/global-presence' },
    ],
  },
  { label: 'Docs', href: '#' },
];

export interface ClientLogo { name: string; src: string; width: number; height: number; }
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'ShopVerse', src: '', width: 150, height: 54 },
  { name: 'UrbanKart', src: '', width: 170, height: 54 },
  { name: 'FreshHub', src: '', width: 148, height: 54 },
  { name: 'ModeHub', src: '', width: 140, height: 54 },
];

export interface Stat { value: string; accent: string; label: string; }
export const STATS: Stat[] = [
  { value: '3', accent: 'M+', label: 'Supplier images enhanced' },
  { value: '98', accent: '%', label: 'Catalog acceptance rate after enhancement' },
  { value: '40', accent: '+', label: 'Marketplace & PIM integrations' },
  { value: 'SOC 2', accent: ' Type II', label: 'Security certified' },
];

export interface Industry {
  number: string;
  title: string;
  description: string;
  image: string;
  tone: 'blue' | 'yellow';
  href: string;
}
export const INDUSTRIES: Industry[] = [
  {
    number: '01',
    title: 'E-commerce & Retail',
    description: 'Meet marketplace image rules on every SKU — resolution, background, crop and file weight — checked and fixed automatically.',
    image: 'assets/img/industry-ecomm.webp',
    tone: 'blue',
    href: '/enhance',
  },
  {
    number: '02',
    title: 'Marketplaces & Multi-vendor',
    description: 'Onboard thousands of sellers faster. Normalise mixed supplier imagery into one consistent catalog look.',
    image: 'assets/img/industry-marketplace.webp',
    tone: 'yellow',
    href: '/products/batchforge',
  },
  {
    number: '03',
    title: 'Grocery & FMCG',
    description: 'Crisp pack shots at scale: upscale legacy photography and keep every label legible on a phone screen.',
    image: 'assets/img/industry-grocery.webp',
    tone: 'yellow',
    href: '/products/pim-connect',
  },
  {
    number: '04',
    title: 'Fashion & Apparel',
    description: 'True-to-colour, sharp fabric detail. Turn supplier snapshots into zoom-ready lookbook images.',
    image: 'assets/img/industry-fashion.webp',
    tone: 'blue',
    href: '/products/complycheck',
  },
];

export interface Service { title: string; description: string; linkLabel: string; icon: string; iconSize: number; href: string; }
export const SERVICES: Service[] = [
  {
    title: 'Image APIs',
    description: 'Enhance images on demand through a REST API with batch endpoints, webhooks and CDN delivery for every channel.',
    linkLabel: 'Explore image APIs',
    icon: 'assets/icons/api.svg',
    iconSize: 42,
    href: API_SERVICES_HREF,
  },
  {
    title: 'Catalog Data Modernization',
    description: 'Clean, enrich and structure fragmented product data into a single catalog every channel can trust.',
    linkLabel: 'Explore catalog data',
    icon: 'assets/icons/data.svg',
    iconSize: 42,
    href: DATA_MODERNIZATION_HREF,
  },
  {
    title: 'Workflow Automation',
    description: 'From supplier inbox to PIM: automated ingest, enhancement, QA and publishing without manual steps.',
    linkLabel: 'Explore workflow automation',
    icon: 'assets/icons/automation.svg',
    iconSize: 42,
    href: INFRA_AUTOMATION_HREF,
  },
  {
    title: 'Agentic QA',
    description: 'AI agents review every enhanced image against marketplace rules and flag only what needs a human.',
    linkLabel: 'Explore agentic QA',
    icon: 'assets/icons/agentic.svg',
    iconSize: 36,
    href: AGENTIC_AI_HREF,
  },
];

export interface Product {
  name: string;
  tagline: string;
  summary: string;
  ctaLabel: string;
  href: string;
  /** Photo shown when the card is expanded. */
  image?: string;
  /** Wordmark shown over the photo. */
  wordmark?: string;
  /** Round app logo shown on the collapsed card and over the expanded photo. */
  logo?: string;
  gradient: string;
}
export const PRODUCTS: Product[] = [
  {
    name: 'Clarity Upscaler',
    tagline: 'Upscale and sharpen supplier images to catalog standard.',
    summary: 'Upscale and sharpen supplier images to catalog standard.',
    ctaLabel: 'Open the tool',
    href: '/enhance',
    image: 'assets/img/product-upscaler.webp',
    wordmark: 'assets/img/sc-wordmark-white.svg',
    logo: 'assets/img/logo-upscaler.svg',
    gradient: 'linear-gradient(90deg, #0e9aa5 0%, #0a626b 100%)',
  },
  {
    name: 'BatchForge',
    tagline: 'Process entire supplier catalogs in bulk.',
    summary: 'Process entire supplier catalogs in bulk — thousands of images overnight.',
    ctaLabel: 'Learn about BatchForge',
    href: DOBBY_HREF,
    image: 'assets/img/product-batchforge.webp',
    logo: 'assets/img/logo-batchforge.svg',
    gradient: 'linear-gradient(89.66deg, #6ec8d7 4.97%, #0a626b 104.55%)',
  },
  {
    name: 'PIM Connect',
    tagline: 'Sync enhanced imagery into your PIM and marketplaces.',
    summary: 'Sync enhanced imagery straight into your PIM and marketplaces.',
    ctaLabel: 'Learn about PIM Connect',
    href: QUICKQODE_HREF,
    image: 'assets/img/product-pimconnect.webp',
    logo: 'assets/img/logo-pimconnect.svg',
    gradient: 'linear-gradient(90deg, #6fa8c9 0%, #12505e 66.07%)',
  },
  {
    name: 'ComplyCheck',
    tagline: 'Automatic marketplace compliance checks.',
    summary: 'Automatic marketplace compliance checks before images ever go live.',
    ctaLabel: 'Learn about ComplyCheck',
    href: FIELDZAPP_HREF,
    image: 'assets/img/product-complycheck.webp',
    logo: 'assets/img/logo-complycheck.svg',
    gradient: 'linear-gradient(90deg, #e8a54b 0%, #9a6214 66.07%)',
  },
];

export interface Testimonial {
  quoteBefore: string;
  highlight: string;
  quoteAfter: string;
  name: string;
  initials: string;
  role: string;
  companyLogo: string;
  companyName: string;
}
export const TESTIMONIALS: Testimonial[] = [
  {
    quoteBefore: 'SupplierClarity AI cleared a 40,000-SKU backlog in three weeks. Our ',
    highlight: 'image rejection rate dropped to nearly zero',
    quoteAfter: ' — suppliers stopped getting reshoot emails entirely.',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'Head of Catalog Operations, ShopVerse',
    companyLogo: 'assets/img/logo-shopverse.svg',
    companyName: 'ShopVerse',
  },
  {
    quoteBefore: 'The enhancement API slotted into our PIM in a day. ',
    highlight: 'Every image is fixed before QA ever sees it',
    quoteAfter: ', so the team now spends its time on new sellers, not tickets.',
    name: 'Daniel Okafor',
    initials: 'DO',
    role: 'E-commerce Platform Lead, UrbanKart',
    companyLogo: 'assets/img/logo-urbankart.svg',
    companyName: 'UrbanKart',
  },
  {
    quoteBefore: 'Supplier photos used to mean a week of back-and-forth. Now they mean ',
    highlight: 'a background job that finishes overnight',
    quoteAfter: ' — pack shots, labels and all.',
    name: 'Mei Ling Chan',
    initials: 'MC',
    role: 'Category Manager, FreshHub',
    companyLogo: 'assets/img/logo-freshhub.svg',
    companyName: 'FreshHub',
  },
];

export interface CaseStudy { industry: string; title: string; icon: string; href: string; }
export const CASE_STUDIES: CaseStudy[] = [
  { industry: 'Fashion marketplace', title: 'Zero-defect imagery across 2M seller listings', icon: 'assets/icons/protection.svg', href: '#' },
  { industry: 'Grocery retail', title: 'Pack-shot rescue for a 12,000-SKU range', icon: 'assets/icons/automation-sm.svg', href: '#' },
  { industry: 'Consumer electronics', title: 'Zoom-ready detail images from legacy supplier photos', icon: 'assets/icons/banking.svg', href: '#' },
];

export const FOUNDER_NOTE = {
  paragraphs: [
    'When we started SupplierClarity in 2022, we kept hearing the same story from retail teams: great products, held back by bad photos. Suppliers send what they have, catalogs reject what they cannot use, and everyone loses a week in between.',
    'So we built the missing layer — an engine that takes any supplier image and makes it catalog-ready: upscaled, sharpened, standardised. No reshoots, no tickets, no compromises on what a shopper sees.',
    'Today our pipeline runs behind marketplaces, grocery chains and fashion retailers across three continents. The promise hasn’t changed: every image we touch should look like the product at its best.',
    'If blurry supplier photos are slowing your catalog down, I’d love to show you what thirty seconds of clarity looks like.',
  ],
  name: 'Arjun Mehta',
  role: 'Founder & CEO, SupplierClarity AI',
  initials: 'AM',
  photo: 'assets/img/founder-arjun.png',
};

export interface FooterColumn { heading: string; links: NavLink[]; }
export const FOOTER_COLUMNS: FooterColumn[] = [
  { heading: 'Product', links: [{ label: 'Clarity Upscaler', href: INSURELIV_HREF }, { label: 'BatchForge', href: DOBBY_HREF }, { label: 'PIM Connect', href: QUICKQODE_HREF }, { label: 'ComplyCheck', href: FIELDZAPP_HREF }] },
  {
    heading: 'Platform',
    links: [
      { label: 'Image APIs', href: API_SERVICES_HREF },
      { label: 'Catalog Data', href: DATA_MODERNIZATION_HREF },
      { label: 'Workflow Automation', href: INFRA_AUTOMATION_HREF },
      { label: 'Agentic QA', href: AGENTIC_AI_HREF },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/company/purpose-leadership' },
      { label: 'Clarity framework', href: '/company/framework' },
      { label: 'Clarity for Good', href: '/company/social-initiative' },
      { label: 'Global Presence', href: '/company/global-presence' },
      { label: 'Docs', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: 'assets/icons/linkedin.svg', href: '#' },
  { label: 'Instagram', icon: 'assets/icons/instagram.svg', href: '#' },
  { label: 'Facebook', icon: 'assets/icons/facebook.svg', href: '#' },
  { label: 'YouTube', icon: 'assets/icons/youtube.svg', href: '#' },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy', href: '#' },
  { label: 'Cookies', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Cookies Preferences', href: '#' },
];

/** Office pins drawn on the globe image: where each pin touches the globe, as % of the 350 × 366 image. */
export const OFFICE_PINS = [
  { country: 'Singapore', cities: 'Singapore (HQ)', x: 76.9, y: 58.2 },
  { country: 'India', cities: 'Bengaluru', x: 87.9, y: 61.1 },
  { country: 'Netherlands', cities: 'Amsterdam', x: 46.2, y: 30.9 },
];

/**
 * Page colour for each section. As a section reaches the middle of the screen,
 * the whole page fades to its colour.
 */
export const SECTION_THEMES = {
  hero: '#ffffff',
  everyPitch: '#f6fafb',
  stats: '#ffffff',
  industries: '#f7fafa',
  services: '#ffcf70',
  products: '#e7f5f6',
  testimonials: '#ffcf70', // same amber as Platform
  caseStudies: '#f7fafa',
  founder: '#fbfeff',
  footer: '#eef8f9',
} as const;
