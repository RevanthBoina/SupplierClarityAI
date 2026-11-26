/**
 * All copy for the WhiteBlue homepage, taken verbatim from Figma (wb_website_redesign, node 805:60594).
 * Keeping it in one place means marketing edits never touch component markup.
 * Links marked '#' have no destination in the design yet.
 */

export interface NavLink { label: string; href: string; }
/** A top-level menu item; `children` appear as a drop-down on hover/focus (and indented on mobile). */
export interface NavItem extends NavLink { children?: NavLink[]; }

/** Service detail pages (see app.routes.ts) */
export const AGENTIC_AI_HREF = '/services/agentic-ai';
export const INFRA_AUTOMATION_HREF = '/services/infra-automation';
export const DATA_MODERNIZATION_HREF = '/services/data-modernization';
export const API_SERVICES_HREF = '/services/api-services';
export const INSURELIV_HREF = '/products/insureliv';
export const DOBBY_HREF = '/products/dobby';
export const QUICKQODE_HREF = '/products/quickqode';
export const FIELDZAPP_HREF = '/products/fieldzapp';

/**
 * Header menu. Add each new page to the right parent's `children` (Products, Services, …).
 * A parent with no children is a plain link.
 */
export const NAV_LINKS: NavItem[] = [
  {
    label: 'Products',
    href: '/#products',
    children: [
      { label: 'InsureLiv', href: INSURELIV_HREF },
      { label: 'Dobby', href: DOBBY_HREF },
      { label: 'QuickQode', href: QUICKQODE_HREF },
      { label: 'FieldZapp', href: FIELDZAPP_HREF },
    ],
  },
  {
    label: 'Services',
    href: '/#services',
    children: [
      { label: 'API services', href: API_SERVICES_HREF },
      { label: 'Data modernization', href: DATA_MODERNIZATION_HREF },
      { label: 'Infra automation', href: INFRA_AUTOMATION_HREF },
      { label: 'Agentic AI', href: AGENTIC_AI_HREF },
    ],
  },
  { label: 'Industries', href: '/#industries' },
  { label: 'Insights', href: '/#case-studies' },
  {
    label: 'Company',
    href: '/company/purpose-leadership',
    children: [
      { label: 'Purpose & leadership', href: '/company/purpose-leadership' },
      { label: 'WhiteBlue framework', href: '/company/framework' },
      { label: 'Social initiative', href: '/company/social-initiative' },
      { label: 'Global presence', href: '/company/global-presence' },
    ],
  },
  { label: 'Careers', href: '#' },
];

export const CONSULTATION_HREF = '#contact';

export interface ClientLogo { name: string; src: string; width: number; height: number; }
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Adani Renewables', src: 'assets/img/client-adani.png', width: 109, height: 74 },
  { name: 'KLA', src: 'assets/img/client-kla.png', width: 177, height: 40 },
  { name: 'New American Funding', src: 'assets/img/client-naf.png', width: 253, height: 50 },
  { name: 'JoyRide Superapp', src: 'assets/img/client-joyride.png', width: 175, height: 66 },
];

export interface Stat { value: string; accent: string; label: string; }
export const STATS: Stat[] = [
  { value: '180', accent: '+', label: 'Global talent pool' },
  { value: '100', accent: '%', label: 'Certified workforce' },
  { value: '20', accent: '+', label: 'Global clients trusting our services' },
  { value: 'ISO ', accent: '27001', label: 'Certified' },
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
    title: 'Financial Services, Credit Unions, & Insurance',
    description: 'Modernize core banking and policy systems, connect credit union cores through APIs, and bring explainable AI into regulated workflows.',
    image: 'assets/img/industry-financial.png',
    tone: 'blue',
    href: '#',
  },
  {
    number: '02',
    title: 'Supply Chain',
    description: 'Predict arrivals and delays, optimize capacity across your network, and automate booking, documentation and invoicing.',
    image: 'assets/img/industry-supply-chain.png',
    tone: 'yellow',
    href: '#',
  },
  {
    number: '03',
    title: 'Hi-Tech',
    description: 'Speed up engineering with AI coding accelerators, Infrastructure-as-Code and API-first platforms.',
    image: 'assets/img/industry-hitech.png',
    tone: 'yellow',
    href: '#',
  },
  {
    number: '04',
    title: 'Manufacturing',
    description: 'Unify plant and IoT data, connect legacy systems through APIs, and give field teams apps that keep working offline.',
    image: 'assets/img/industry-manufacturing.png',
    tone: 'blue',
    href: '#',
  },
];

export interface Service { title: string; description: string; linkLabel: string; icon: string; iconSize: number; href: string; }
export const SERVICES: Service[] = [
  {
    title: 'API Services',
    description: 'Turn legacy systems into secure, scalable APIs (REST, event-driven or GraphQL), protected with OAuth2, JWT and policy enforcement.',
    linkLabel: 'Explore API services',
    icon: 'assets/icons/api.svg',
    iconSize: 42,
    href: API_SERVICES_HREF,
  },
  {
    title: 'Data Modernization',
    description: 'Clean, normalise and structure fragmented data into cloud-ready pipelines that your analytics and AI can rely on.',
    linkLabel: 'Explore data modernization',
    icon: 'assets/icons/data.svg',
    iconSize: 42,
    href: DATA_MODERNIZATION_HREF,
  },
  {
    title: 'Infra Automation',
    description: 'Cloud-native environments built with Infrastructure-as-Code and CI/CD, so every release can be repeated.',
    linkLabel: 'Explore infra automation',
    icon: 'assets/icons/automation.svg',
    iconSize: 42,
    href: INFRA_AUTOMATION_HREF,
  },
  {
    title: 'Agentic AI',
    description: 'GenAI agents that pull real-time context through RAG and handle complex decisions within the governance limits you set.',
    // Figma reads "Explore agentic A →"; corrected to the evident intent.
    linkLabel: 'Explore agentic AI',
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
    name: 'InsureLiv',
    tagline: 'AI-native insurance distribution.',
    summary: 'AI-native insurance distribution for brokers and insurers.',
    ctaLabel: 'Visit insurelive.com',
    href: 'https://insurelive.com',
    image: 'assets/img/product-insureliv.webp',
    wordmark: 'assets/img/insureliv-logo.svg',
    logo: 'assets/img/insureliv-mark.svg', // diamond mark cut from the wordmark
    gradient: 'linear-gradient(90deg, #1b3fb5 0%, #2c58f1 100%)',
  },
  {
    name: 'Dobby',
    tagline: 'Automate tasks with AI.',
    summary: 'Automate tasks with AI.',
    ctaLabel: 'Learn about Dobby',
    href: DOBBY_HREF,
    image: 'assets/img/product-dobby.webp',
    logo: 'assets/img/logo-dobby.png',
    gradient: 'linear-gradient(89.66deg, #6ec8d7 4.97%, #2e43cf 104.55%)',
  },
  {
    name: 'QuickQode',
    tagline: 'Build, test, and deploy code faster.',
    summary: 'Build, test, and deploy code faster.',
    ctaLabel: 'Learn about QuickQode',
    href: QUICKQODE_HREF,
    image: 'assets/img/product-quickqode.webp',
    logo: 'assets/img/logo-quickqode.png',
    gradient: 'linear-gradient(90deg, #7170d5 0%, #74409e 66.07%)',
  },
  {
    name: 'FieldZapp',
    tagline: 'Streamline field operations and team management.',
    summary: 'Streamline field operations and team management.',
    ctaLabel: 'Learn about FieldZapp',
    href: FIELDZAPP_HREF,
    image: 'assets/img/product-fieldzapp.webp',
    logo: 'assets/img/logo-fieldzapp.png',
    gradient: 'linear-gradient(90deg, #ac5a84 0%, #843b8c 66.07%)',
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
/** Figma shows three carousel dots but only one testimonial exists in the design. Add the others here. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quoteBefore: 'WhiteBlue has been able to support me with cutting edge ',
    highlight: 'Azure IoT architecture',
    quoteAfter: ', strategy and implementation solutions for a very complex Digital/Engineering project for one of the largest Rail customers based out of Canada.',
    name: 'Kadiravan T',
    initials: 'KT',
    role: 'Associate Vice President & Head, Delivery',
    companyLogo: 'assets/img/mphasis-logo-white.png', // white monochrome, trimmed
    companyName: 'Mphasis',
  },
];

export interface CaseStudy { industry: string; title: string; icon: string; href: string; }
export const CASE_STUDIES: CaseStudy[] = [
  // Title is truncated in Figma ("…for a major"); confirm the full headline with the content team.
  { industry: 'Ports & Maritime', title: 'Smart port operations for a major', icon: 'assets/icons/automation-sm.svg', href: '#' },
  { industry: 'Insurance', title: 'AI-driven claims processing for a Fortune 500 insurance provider', icon: 'assets/icons/protection.svg', href: '#' },
  { industry: 'Banking', title: 'Intelligent data operations for a leading regional bank', icon: 'assets/icons/banking.svg', href: '#' },
];

export const FOUNDER_NOTE = {
  paragraphs: [
    'When we started WhiteBlue in 2020, we made ourselves one promise: we would only build things that make a real difference to the people who use them.',
    'That promise is easy to make and hard to keep. It means listening before we build, saying no when something isn’t right, and owning the outcome long after go-live. It means treating every client’s challenge as its own, because no two ever are.',
    'Six years on, we’re a team across India, the UAE and the US. The promise hasn’t changed, and neither have the reasons we keep it: the people we work with, the people we work for, and the community we come from.',
    'Thank you for spending a few minutes with us. If there’s a hard problem in your way, I’d love to hear about it.',
  ],
  name: 'Jai Ganesh Chellamuthu',
  role: 'Founder & CEO, WhiteBlue',
  initials: 'JG',
  photo: 'assets/img/founder-jai.png',
};

export interface FooterColumn { heading: string; links: NavLink[]; }
export const FOOTER_COLUMNS: FooterColumn[] = [
  { heading: 'Products', links: [{ label: 'InsureLiv', href: INSURELIV_HREF }, { label: 'Dobby', href: DOBBY_HREF }, { label: 'Quickqode', href: QUICKQODE_HREF }, { label: 'FieldZapp', href: FIELDZAPP_HREF }] },
  {
    heading: 'Services',
    links: [
      { label: 'API Services', href: API_SERVICES_HREF },
      { label: 'Data Modernization', href: DATA_MODERNIZATION_HREF },
      { label: 'Infra Automation', href: INFRA_AUTOMATION_HREF },
      { label: 'Agentic AI', href: AGENTIC_AI_HREF },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/company/purpose-leadership' },
      { label: 'Leadership', href: '/company/purpose-leadership#leadership' },
      { label: 'Framework', href: '/company/framework' },
      { label: 'Social Initiative', href: '/company/social-initiative' },
      { label: 'Global Presence', href: '/company/global-presence' },
      { label: 'News & Insights', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: 'assets/icons/linkedin.svg', href: '#' },
  { label: 'Instagram', icon: 'assets/icons/instagram.svg', href: '#' },
  { label: 'Facebook', icon: 'assets/icons/facebook.svg', href: '#' },
  { label: 'YouTube', icon: 'assets/icons/youtube.svg', href: '#' },
  // X is switched off for now; uncomment to show it again.
  // { label: 'X (Twitter)', icon: 'assets/icons/x.svg', href: '#' },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy', href: '#' },
  { label: 'Cookies', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Cookies Preferences', href: '#' },
];

/** Office pins drawn on the globe image: where each pin touches the globe, as % of the 350 × 366 image. */
export const OFFICE_PINS = [
  { country: 'USA', cities: 'California, Austin', x: 12.9, y: 29.2 },
  { country: 'UAE', cities: 'Dubai', x: 82.7, y: 52.1 },
  { country: 'India', cities: 'Hyderabad, Bangalore, Chennai', x: 90.6, y: 46.8 },
];

/**
 * Page colour for each section (Figma section fills). As a section reaches the middle
 * of the screen, the whole page fades to its colour. Change any value to restyle.
 */
export const SECTION_THEMES = {
  hero: '#ffffff',
  everyPitch: '#f7f8fd', // matches the pitch video's background so its edges disappear
  stats: '#ffffff',
  industries: '#f8f9fb',
  services: '#ffd06a',
  products: '#eaf2fe',
  testimonials: '#ffd06a', // same yellow as Services
  caseStudies: '#f8f9fb',
  founder: '#fdfeff',
  footer: '#f0f6ff',
} as const;
