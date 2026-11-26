/**
 * Copy for the API services page (/services/api-services), from the "API Services V4.1" design.
 * Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", commas instead of dashes, full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/api/';

export const API_HERO: HeroContent = {
  titleLead: 'APIs that turn legacy',
  titleAccent: 'into leverage.',
  titleSegments: [
    { text: 'APIs that turn ' },
    { text: 'legacy', accent: true, breakAfter: true },
    { text: 'into ' },
    { text: 'leverage.', accent: true },
  ],
  lead: 'With WhiteBlue’s API services, your core systems connect securely to apps, partners and data, so your business scales faster.',
  image: IMG + 'hero-network.webp', // PLACEHOLDER
  imageAlt: 'Illustration of a secure API hub connecting apps, databases and servers',
  chips: [
    { label: 'Modern API styles', sub: 'REST / GraphQL / gRPC', tone: 'blue', pos: 'top-right' },
    { label: 'OAuth2, JWT', sub: 'for secure user and system access', tone: 'yellow', pos: 'bottom-left' },
  ],
};

/** "Industries": same tabbed card + photo section as "How we help" on other service pages. */
export const API_INDUSTRIES: HelpContent = {
  eyebrowIcon: 'industries',
  eyebrow: 'Industries',
  titleLead: 'Every business',
  titleAccent: 'connects differently.',
  lead: 'Whatever your scale, the right APIs help you integrate faster, adapt sooner and keep growing.',
  resultLabel: 'How WhiteBlue helped',
  tabs: [
    {
      label: 'Established enterprises',
      tone: 'blue',
      icon: 'legacy',
      kicker: 'Established enterprises',
      title: 'Legacy holds back new launches.',
      points: [
        { text: 'Monolithic systems slow down new products.' },
        { text: 'Customers and platforms expect secure, standards-based APIs.' },
        { text: 'Audits need traceable data flows.' },
      ],
      image: IMG + 'ind-enterprise.webp', // PLACEHOLDER
      imageAlt: 'Container cranes at a port terminal',
      resultText: 'A large port operator’s terminal system now shares real-time shipment data with logistics platforms and carriers, through secure APIs built around its core.',
    },
    {
      label: 'Digital-native businesses',
      tone: 'yellow',
      icon: 'orbit',
      kicker: 'Digital-native businesses',
      title: 'Growth that needs integrations to keep up.',
      points: [
        { text: 'Third-party integrations multiply fast.' },
        { text: 'High transaction volumes need fast, reliable APIs.' },
        { text: 'Real-time experiences need well-governed data.' },
      ],
      image: IMG + 'ind-digital.webp', // PLACEHOLDER
      imageAlt: 'A warehouse worker scanning parcels on a conveyor',
      resultText: 'A fast-growing e-commerce platform handling thousands of daily orders keeps payment gateways and last-mile delivery providers in sync with reliable APIs.',
    },
    {
      label: 'Ecosystem players',
      tone: 'plum',
      icon: 'cloud',
      kicker: 'Ecosystem players',
      title: 'Your ecosystem, one way in.',
      points: [
        { text: 'Supplier and vendor links are often manual.' },
        { text: 'Data silos cause delays and errors.' },
        { text: 'Modern experiences need one unified API layer.' },
      ],
      image: IMG + 'ind-ecosystem.webp', // PLACEHOLDER
      imageAlt: 'An engineer checking a tablet beside a robotic arm on a production line',
      resultText: 'A manufacturer replaced manual file uploads and legacy EDI with one API layer, giving procurement and inventory teams real-time visibility across suppliers.',
    },
  ],
};

/** Pinned while the visitor scrolls; each quarter of the scroll shows the next service. */
export const API_SERVICES_RING: DeliveryContent = {
  eyebrow: 'Services',
  title: 'Design it. Secure it.',
  titleAccent: 'Run it at scale.',
  lead: 'From strategy to security, built for financial services, including credit unions and insurance, and ready to scale as you grow.',
  centered: true,
  steps: [
    {
      label: 'Design & strategy', title: 'Design & strategy', tone: 'teal', icon: 'cloud',
      intro: 'Plan APIs around your growth goals and regulations.',
      points: [
        { text: 'API-first architecture for regulated financial workflows.' },
        { text: 'Domain models for loans, policies, KYC and claims.' },
        { text: 'OpenAPI specs for reuse and governance.' },
        { text: 'Documentation and sandboxes for third-party developers.' },
      ],
    },
    {
      label: 'Modernization', title: 'Modernization', tone: 'green', icon: 'orbit',
      intro: 'Turn legacy systems into modern, reusable APIs that bring new products to market sooner.',
      points: [
        { text: 'Legacy system integration with cloud APIs.' },
        { text: 'Microservices that replace monoliths.' },
        { text: 'Event-driven APIs for real-time policies and loans.' },
        { text: 'REST, GraphQL and gRPC.' },
      ],
    },
    {
      label: 'Gateway & management', title: 'Gateway & management', tone: 'purple', icon: 'database',
      intro: 'Run, monitor and scale every API as your traffic grows.',
      points: [
        { text: 'Azure API Management, AWS API Gateway and GCP.' },
        { text: 'Rate limiting, traffic shaping and usage metering.' },
        { text: 'Developer portals, subscriptions and analytics.' },
        { text: 'Secure partner onboarding.' },
      ],
    },
    {
      label: 'Security', title: 'Security', tone: 'rose', icon: 'shield',
      intro: 'Security built into every API, from access to compliance.',
      points: [
        { text: 'OAuth2 and JWT access control.' },
        { text: 'OWASP Top 10 coverage.' },
        { text: 'GDPR, HIPAA and PCI DSS compliance mapping.' },
        { text: 'Threat modeling and continuous monitoring.' },
      ],
    },
  ],
};

export const API_CLOUD = {
  eyebrow: 'Infrastructure',
  titleAccent: 'Cloud ready',
  titleRest: 'from day one.',
  lead: 'Your APIs run on highly available cloud platforms that scale as your business grows.',
  items: [
    'Multi-cloud API enablement (Azure, AWS, GCP).',
    'Autoscaling architectures for transaction-heavy operations.',
    'Hybrid integrations with on-premises core systems across financial services.',
    'Built-in CI/CD for rapid iteration and testing.',
  ],
};

/** Hovering a card fades its photo, tints the card (tint) and shows the text. */
export const API_WHY = {
  titleLead: 'Why',
  titleAccent: 'WhiteBlue?',
  lead: 'Cloud, data and AI expertise, focused on one thing: connected systems that grow your business.',
  cards: [
    { title: 'Fluent in financial services', text: 'From credit unions to insurers, sector know-how in every API we build.', image: IMG + 'why-finance.webp', tint: '#e8efff' }, // PLACEHOLDER image
    { title: 'Cloud-native by default', text: 'Proven across Azure, AWS and hybrid setups.', image: IMG + 'why-cloud.webp', tint: '#fdedb9' }, // PLACEHOLDER image
    { title: 'Security in every layer', text: 'Compliance and data protection built in.', image: IMG + 'why-security.webp', tint: '#d5dff8' }, // PLACEHOLDER image
    { title: 'Strategy before code', text: 'Every API starts with your growth goals.', image: IMG + 'why-strategy.webp', tint: '#f2f5fe' }, // PLACEHOLDER image
  ],
};

export const API_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Get more from every system',
  titleAccent: 'you already run.',
  lead: 'APIs turn the core systems you’ve invested in into new products, channels and integrations, without replacing them.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Data stuck in system silos.',
      text: 'Every new product, channel or integration needs custom work, extra cost and longer timelines.',
      image: IMG + 'impact-solves.webp', // PLACEHOLDER
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'New revenue from systems you own.',
      text: 'Launch digital products and integrations on what you run today, protecting past investment while opening new revenue.',
      image: IMG + 'impact-value.webp', // PLACEHOLDER
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'Every integration cheaper than the last.',
      text: 'One secure API layer replaces fragile point-to-point links, so each new connection is faster and costs less.',
      image: IMG + 'impact-efficiency.webp', // PLACEHOLDER
    },
  ],
  action: {
    kicker: 'See it in action',
    title: 'InsureLiv, our insurance platform for brokers',
    text: 'Its API-ready integration sends every package straight to insurer portals, built the way we build APIs for enterprises.',
    cta: 'Explore InsureLiv',
    href: '/products/insureliv',
  },
};

export const API_CTA = {
  titleLead: 'Ready to connect',
  titleAccent: 'what you’ve built?',
  lead: 'Secure APIs that connect your systems and data, so your business moves faster.',
  image: IMG + 'cta-servers.webp', // PLACEHOLDER
  imageAlt: 'Monitors showing network dashboards in a server room',
  secondaryLabel: 'Explore services',
  secondaryHref: '/#services',
};
