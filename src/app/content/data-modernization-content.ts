/**
 * Copy for the Data modernization service page (/services/data-modernization), from the
 * "Data Modernization V1.1" design. Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", commas instead of dashes, full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/data/';

export const DATA_HERO: HeroContent = {
  titleLead: 'From scattered data to',
  titleAccent: 'scalable growth.',
  lead: 'With WhiteBlue’s data modernization, legacy data becomes a governed cloud foundation that lets analytics and AI grow with your business.',
  image: IMG + 'hero-pipeline.webp', // PLACEHOLDER
  imageAlt: 'Illustration of data from many servers flowing through a governed layer into a cloud platform',
  chips: [
    { label: 'Real-time data pipelines', tone: 'blue' },
    { label: 'Semantic layers + RAG', tone: 'blue' },
    { label: 'Trustworthy analytics', tone: 'yellow' },
  ],
};

export const DATA_HELP: HelpContent = {
  eyebrow: 'How we help',
  titleLead: 'Your data,',
  titleAccent: 'working as one.',
  lead: 'Modernize what’s scattered, connect it on the cloud and turn it into intelligence that helps your business grow.',
  resultLabel: 'The result',
  tabs: [
    {
      label: 'From silos to intelligent data ecosystems',
      tone: 'blue',
      icon: 'database',
      title: 'From silos to intelligent data ecosystems',
      intro: 'Turn fragmented legacy systems into cloud-native platforms built for AI and RAG. Our approach blends:',
      points: [
        { term: 'Real-time data pipelines', text: 'for instant ingestion and processing.' },
        { term: 'Semantic layers and RAG retrieval', text: 'for context-aware access to knowledge.' },
        { term: 'ML-driven data quality and anomaly detection', text: 'for analytics you can trust.' },
      ],
      image: IMG + 'help-team.webp', // PLACEHOLDER
      imageAlt: 'Two engineers reviewing a data platform on a laptop',
      resultText: 'Data foundations that evolve with your business, feeding AI models and operational systems with reliable, explainable intelligence.',
    },
    {
      label: 'Answers your business can trust',
      tone: 'purple',
      icon: 'code',
      title: 'Answers your business can trust',
      intro: 'Turn raw data into explainable intelligence that drives real business outcomes, with AI-native pipelines, retrieval-augmented generation and predictive analytics:',
      points: [
        { term: 'Faster insights', text: 'from AI-ready pipelines and retrieval-augmented queries.' },
        { term: 'Higher data quality', text: 'through ML-based monitoring.' },
        { term: 'Faster decisions', text: 'powered by predictive and generative AI, so you act on growth opportunities sooner.' },
      ],
      image: IMG + 'help-analytics.webp', // PLACEHOLDER
      imageAlt: 'A business analyst reviewing charts on a laptop and tablet',
      resultText: 'A continuously improving data and AI ecosystem where every query, report and model response is faster, more accurate and grounded in trusted business data.',
    },
  ],
};

/** Pinned while the visitor scrolls; each third of the scroll shows the next layer. */
export const DATA_LAYERS: DeliveryContent = {
  eyebrow: 'Services',
  title: 'Three layers,',
  titleAccent: 'one data foundation.',
  lead: 'Structured and unstructured data, retrieved with context, so every dataset is accurate, accessible and ready for analytics, compliance and AI, and built to scale as your business grows.',
  steps: [
    {
      label: 'Core AI + RAG capabilities',
      title: 'Core AI + RAG capabilities',
      tone: 'teal',
      icon: 'code',
      points: [
        { strong: 'Cloud data warehousing and lakehouse:', text: 'Snowflake, BigQuery and Databricks, optimized for AI scale.' },
        { strong: 'Real-time pipelines:', text: 'event-driven streaming for instant intelligence.' },
        { strong: 'Automated data governance:', text: 'AI-powered lineage, anomaly detection and access controls.' },
        { strong: 'RAG-enhanced query layer:', text: 'contextual, domain-aware data retrieval for LLMs.' },
      ],
    },
    {
      label: 'AI-driven business growth',
      title: 'AI-driven business growth',
      tone: 'purple',
      icon: 'orbit',
      points: [
        { strong: 'Faster decision-making:', text: 'insights in hours, not weeks, with ML-powered reporting and self-service BI dashboards.' },
        { strong: 'Trusted business intelligence:', text: 'governed, explainable pipelines reduce inconsistencies.' },
        { strong: 'Predictive and generative insights at scale:', text: 'data that powers forecasting, personalization and automation as you grow.' },
        { strong: 'Compliance by design:', text: 'automated lineage, policy enforcement and audit-ready reporting.' },
      ],
    },
    {
      label: 'Smart data outcomes',
      title: 'Smart data outcomes',
      tone: 'green',
      icon: 'database',
      points: [
        { strong: '70% reduction', text: 'in manual reporting with automated, RAG-powered summaries.' }, // VERIFY claim
        { strong: '95% governance compliance', text: 'through AI-driven lineage tracking.' }, // VERIFY claim
        { strong: '30 days', text: 'to deploy a modern, intelligent data platform.' }, // VERIFY claim
      ],
    },
  ],
};

export const DATA_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Trusted numbers. Faster insight.',
  titleAccent: 'Smarter AI.',
  lead: 'One governed data foundation, so every decision, report and AI project runs on numbers your leadership can trust.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Scattered data, one governed view.',
      text: 'Data from silos and legacy platforms in one governed view, so reports match and AI projects scale.',
      image: IMG + 'impact-solves.webp', // PLACEHOLDER
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Same numbers, faster decisions.',
      text: 'Leaders, compliance and AI work from the same governed numbers, so decisions are faster, easier to defend and ready to scale.',
      image: IMG + 'impact-value.webp', // PLACEHOLDER
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'Insight, not assembly.',
      text: 'Automated pipelines and governance cut manual reporting, so analysts spend their time on insight, not assembly.',
      image: IMG + 'impact-efficiency.webp', // PLACEHOLDER
    },
  ],
  action: {
    kicker: 'See it in the field',
    title: 'FieldZapp, our AI-powered field service app',
    text: 'It turns every visit into real-time service levels for operations leaders.',
    cta: 'Explore FieldZapp',
    href: '/products/fieldzapp',
  },
};

export const DATA_CTA = {
  titleLead: 'Ready to put your data',
  titleAccent: 'to work?',
  lead: 'Your data shouldn’t just sit in silos. WhiteBlue modernizes it into AI-ready foundations that speed up decisions, reduce risk and scale with your growth.',
  image: IMG + 'cta-team.webp', // PLACEHOLDER
  imageAlt: 'A team reviewing a data dashboard on a large screen in a meeting room',
  secondaryLabel: 'Explore services',
  secondaryHref: '/#services',
};
