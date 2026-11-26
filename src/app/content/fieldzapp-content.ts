/**
 * Copy for the FieldZapp product page (/products/fieldzapp), from the "FieldZapp V1" design.
 * Hero animation follows the FieldZapp recording. Images marked PLACEHOLDER are cut from the design and screenshots.
 */
import { CapabilitiesContent, CtaBandContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const IMG = 'assets/img/fieldzapp/';
const DEMO = '#contact';

export const FZ_HERO: ProductHeroContent = {
  title: [
    { text: 'Your field team,', breakAfter: true },
    { text: 'always one step ahead.', accent: true },
  ],
  lead: 'FieldZapp is an AI-powered field service app that puts schedules, job details, customer locations and documents in your technicians’ hands, online or offline, so every visit runs faster and every customer gets served on time.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch FieldZapp in action', href: '/products/fieldzapp#fieldzapp-video' },
  logo: IMG + 'logo-orb.png', // PLACEHOLDER
  logoAlt: 'FieldZapp logo',
  accent: '#f5b51b',
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
    { text: 'From dispatch to done,', breakAfter: true },
    { text: 'in one app.', accent: true },
  ],
  lead: 'FieldZapp uses AI to connect your field team, back office and customers in one mobile app, cutting travel time, paperwork and back-and-forth, so more jobs get done right the first time, even without a network.',
  poster: IMG + 'video-poster.webp', // PLACEHOLDER
  posterAlt: 'A technician checking a job on his phone beside an air conditioner',
  caption: 'Watch FieldZapp video',
  duration: '1:41 min',
  videoUrl: 'https://www.youtube.com/embed/lQw58XxJ97I', // youtu.be/lQw58XxJ97I
};

export const FZ_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Key features',
  eyebrowIcon: 'industries',
  titleLead: 'Built for the field.',
  titleAccent: 'Ready in their pocket.',
  lead: 'Keep field executives, back office and customers in sync, so jobs finish on time and customers stay happy.',
  pills: ['Reduce customer service time', 'Optimize your field force', 'Real-time service levels', 'No network? No problem.'],
  intervalMs: 3500,
  items: [
    { name: 'Appointments at a glance', image: IMG + 'cap-1.webp',
      text: 'Every task, appointment and pending job on one screen, with real-time updates when schedules change, so technicians plan their day in seconds.' },
    { name: 'Detailed view', image: IMG + 'cap-2.webp', // PLACEHOLDER
      text: 'Full job details at their fingertips, so technicians arrive prepared, cut downtime and get every job done right the first time.' },
    { name: 'Customer location mapping', image: IMG + 'cap-3.webp', // PLACEHOLDER
      text: 'Real-time location data guides technicians straight to the customer, opened directly from the appointment screen, cutting travel time on every visit.' },
    { name: 'Upload documents with ease', image: IMG + 'cap-4.webp', // PLACEHOLDER
      text: 'Capture and scan documents on the spot from any mobile device, keeping technicians, back office and customers in sync.' },
    { name: 'Works offline', image: IMG + 'cap-5.webp', // PLACEHOLDER
      text: 'No network? No problem. Field executives keep viewing jobs, updating status and capturing documents offline, and FieldZapp syncs everything the moment they reconnect.' },
  ],
};

export const FZ_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Service that',
  titleAccent: 'never skips a beat.',
  lead: 'AI-powered scheduling, routing and offline working, so every field executive completes more jobs, every day.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Visits slowed by travel and paperwork.',
      text: 'Wasted travel, missed appointments, paperwork and network dead zones that slow every visit.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'More jobs from the team you have.',
      text: 'More completed jobs and higher customer satisfaction from the field force you already have.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'Smarter routes, more done per shift.',
      text: 'AI plans the best route, job details are ready before arrival and work carries on offline, so more gets done every shift.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'The data behind the field',
    title: 'Data modernization by WhiteBlue',
    text: 'Turn every completed job into service insight on one governed data foundation.',
    cta: 'Explore data modernization',
    href: '/services/data-modernization',
  },
};

export const FZ_CTA: CtaBandContent = {
  titleLead: 'See how much more',
  titleAccent: 'your field team can do.',
  lead: 'Book a demo and see FieldZapp run a real day in the field, from first appointment to final sign-off.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Explore infra automation', href: '/services/infra-automation' },
};
