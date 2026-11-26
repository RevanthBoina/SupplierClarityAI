/**
 * Copy for the QuickQode product page (/products/quickqode), from the "QuickQode V1.1" design.
 * Hero animation follows the QuickQode recording. Images marked PLACEHOLDER are cut from the design and screenshots.
 */
import { CapabilitiesContent, CtaBandContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const IMG = 'assets/img/quickqode/';
const DEMO = '#contact';

export const QQ_HERO: ProductHeroContent = {
  title: [
    { text: 'Faster delivery.', breakAfter: true },
    { text: 'Smarter code.', breakAfter: true },
    { text: 'Powered by AI.', accent: true },
  ],
  lead: 'QuickQode writes, tests, documents and translates code with AI, so your teams deliver more in less time.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch QuickQode in action', href: '/products/quickqode#quickqode-video' },
  logo: IMG + 'logo-orb.png', // PLACEHOLDER
  logoAlt: 'QuickQode logo',
  accent: '#1fae8c',
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
    { text: 'From prompt to', breakAfter: true },
    { text: 'working code,', breakAfter: true },
    { text: 'in minutes.', accent: true },
  ],
  lead: 'QuickQode puts AI to work across the development cycle. Describe what you need, and it generates the code, tests and documentation, so your developers spend their time on what moves the business forward.',
  poster: IMG + 'video-poster.webp', // PLACEHOLDER
  posterAlt: 'Two developers reviewing generated code on a monitor',
  caption: 'Watch QuickQode video',
  duration: '3:00 min',
  videoUrl: 'https://www.youtube.com/embed/2fS7PvZhJvM', // youtu.be/2fS7PvZhJvM
};

export const QQ_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Capabilities',
  eyebrowIcon: 'capabilities',
  titleLead: 'What QuickQode does',
  titleAccent: 'for your developers',
  intervalMs: 3500,
  items: [
    { name: 'Natural language code generation', image: IMG + 'cap-1.webp',
      text: 'Type what you need in plain language. QuickQode’s AI turns it into precise, working code with a single command.' },
    { name: 'Automated unit test generation', image: IMG + 'cap-2.webp', // PLACEHOLDER
      text: 'AI writes your unit tests automatically, saving hours of repetitive effort while keeping quality and reliability high.' },
    { name: 'Smart code comments', image: IMG + 'cap-3.webp', // PLACEHOLDER
      text: 'AI-generated comments make every line easy to read, review and hand over, keeping your codebase well-documented as it grows.' },
    { name: 'Code translation across languages', image: IMG + 'cap-4.webp', // PLACEHOLDER
      text: 'Move code between languages like C# and Java in a fraction of the time, ideal for modernizing legacy systems.',
      link: { label: 'modernizing legacy systems', href: '/services/api-services' } },
  ],
};

export const QQ_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Every developer,',
  titleAccent: 'delivering more.',
  lead: 'AI does the heavy lifting on repetitive code, so your developers stay focused on building what’s next.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Hours lost to repetitive code.',
      text: 'Developer hours spent on boilerplate, test writing, documentation and manual rewrites of legacy code.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'Ship sooner, modernize safely.',
      text: 'Features reach customers sooner, and legacy systems move to modern stacks without starting over.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'Every sprint covers more ground.',
      text: 'AI handles routine coding, so every sprint covers more ground with the same team.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'Ship it with',
    title: 'Infra automation by WhiteBlue',
    text: 'Run QuickQode-generated code on automated, self-correcting cloud infrastructure.',
    cta: 'Explore infra automation',
    href: '/services/infra-automation',
  },
};

export const QQ_CTA: CtaBandContent = {
  titleLead: 'Put AI to work',
  titleAccent: 'on your codebase.',
  lead: 'Book a demo and watch QuickQode generate, test and document code for your stack, live.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Explore agentic AI', href: '/services/agentic-ai' },
};
