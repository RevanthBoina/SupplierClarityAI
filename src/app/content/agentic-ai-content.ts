/**
 * Copy for the Agentic AI service page (/services/agentic-ai), from the "Agentic AI V1.2" design
 * and the interaction walkthrough. Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/agentic/';

export const AGENTIC_HERO: HeroContent = {
  titleLead: 'AI agents that run your processes,',
  titleAccent: 'with fees tied to results.',
  lead: 'WhiteBlue builds governed AI agents grounded in your own knowledge, connects them to your systems and measures them against KPIs you agree up front.',
  image: IMG + 'hero-workstation.webp', // PLACEHOLDER
  imageAlt: 'A monitor and laptop showing an AI agent workflow connected to business apps',
  chips: [
    { label: 'Custom copilots', tone: 'blue' },
    { label: 'Governed autonomy', tone: 'blue' },
    { label: 'RAG-enabled knowledge agents', tone: 'yellow' },
  ],
};

/** Each shape flips to a coloured panel with a short explanation on hover, focus or tap. */
export const AGENTIC_WHY = {
  eyebrow: 'Why agentic AI',
  titleLead: 'Scale like a capability center.',
  titleAccent: 'Invest in results.',
  lead: 'Cloud, data and APIs give your business a modern foundation. Agentic AI puts it to work, turning systems into outcomes you can measure.',
  shapes: [
    {
      shape: 'circle', icon: 'target', tone: 'blue',
      // Non-breaking hyphens keep "Results-as-a-Service" on one line
      kicker: 'RaaS (Results‑as‑a‑Service)', title: 'Fees linked to outcomes',
      detail: 'We agree the KPI, the baseline and how it is measured before we build. Fees are tied to the improvement we verify, not to hours logged.',
      image: IMG + 'why-outcomes.webp',
    },
    {
      shape: 'cloud', icon: 'code', tone: 'purple',
      kicker: 'Knowledge-grounded', title: 'Agents that use your facts',
      detail: 'Agents answer from your approved knowledge, not from guesswork. Policies, definitions and ownership are structured so answers are accurate and traceable to a source.',
      image: IMG + 'why-knowledge.webp',
    },
    {
      shape: 'parallelogram', icon: 'database', tone: 'yellow',
      kicker: 'Your foundation', title: 'Built on what you already run',
      detail: 'Agents connect to the data, APIs and cloud you already run, so value arrives faster and nothing has to be rebuilt.',
      image: IMG + 'why-foundation.webp',
    },
  ],
};

export const AGENTIC_HELP: HelpContent = {
  eyebrow: 'How we help',
  titleLead: 'Agents in production.',
  titleAccent: 'Engineers on the ground.',
  lead: 'RAG-powered copilots that work alongside your people, agents built on proven agentic AI frameworks that scale across functions and on-site engineers who make it all run.',
  resultLabel: 'The result',
  tabs: [
    {
      label: 'Grounded in your knowledge',
      tone: 'blue',
      icon: 'code',
      title: 'Agents grounded in your knowledge',
      intro: 'Agents are only as reliable as the knowledge behind them. We ground them in your knowledge, then put them to work:',
      points: [
        { term: 'Structured knowledge (OKF):', text: 'definitions, policies, ownership and business rules written as linked, version-controlled knowledge, so agents follow explicit relationships instead of inferring them.' },
        { term: 'Retrieval (RAG):', text: 'large document sets such as contracts, tickets and manuals are searched at query time, and each answer cites its source.' },
        { term: 'Action:', text: 'agents carry out the workflow across your systems within approved limits, and escalate to a person when confidence is low.' },
      ],
      note: 'OKF is an early open specification from Google Cloud. We build knowledge in a portable, version-controlled form that works with or without it.',
      image: IMG + 'help-team.webp', // PLACEHOLDER
      imageAlt: 'An engineer walks colleagues through an agent workflow on a large screen',
      resultText: 'Answers your teams can trust and your auditors can trace.',
    },
    {
      label: 'AI-first, outcome-driven results',
      tone: 'purple',
      icon: 'target',
      title: 'Results-as-a-Service (RaaS)',
      intro: 'You pay for the outcome, not the effort. Every engagement runs in four steps:',
      points: [
        { term: 'Baseline:', text: 'measure today’s performance: cost per case, turnaround time, error rate.' },
        { term: 'Target:', text: 'agree the KPI, the improvement and how it will be verified.' },
        { term: 'Deliver:', text: 'build, deploy and operate the agent.' },
        { term: 'Measure:', text: 'report against the baseline. Fees follow the verified result.' },
      ],
      note: 'Best for processes with a clear, measurable outcome that you can attribute to the agent.',
      image: IMG + 'help-raas.webp', // PLACEHOLDER
      imageAlt: 'A business leader reviews performance dashboards',
      resultText: 'Budget linked to business impact, and risk shared.',
    },
    {
      // Condensed from the four-row comparison table in the walkthrough (see chat for the rationale).
      label: 'Choose your delivery model',
      tone: 'yellow',
      icon: 'helmet',
      title: 'Choose your delivery model',
      intro: 'Same agents, governance and commercial options (fixed scope, time-and-materials or RaaS). Two ways to run the work:',
      options: [
        {
          name: 'Conventional delivery',
          text: 'Our team builds in WhiteBlue delivery centers and works with yours through scheduled reviews, with documentation and training at each milestone.',
          bestWhen: 'requirements are clear and systems are well documented.',
        },
        {
          name: 'Forward-deployed team',
          text: 'Our engineers work inside your business, next to the people who run the process, with daily feedback and paired working until your team takes over.',
          bestWhen: 'workflows are complex, change often or sit in regulated or legacy environments.',
        },
      ],
      image: IMG + 'help-delivery.webp', // PLACEHOLDER
      imageAlt: 'Two colleagues working together on a laptop',
      resultText: 'The right level of proximity for your process, without changing the outcome you pay for.',
    },
  ],
};

/** Pinned while the visitor scrolls; each third of the scroll shows the next step. */
export const AGENTIC_DELIVERY: DeliveryContent = {
  eyebrow: 'Services',
  title: 'Intelligent agent delivery',
  subtitle: 'AI agents that act, learn and optimize, securely.',
  lead: 'WhiteBlue ensures agents are not black boxes, but governed, explainable and aligned to measurable outcomes. Every agent is tied to business KPIs, such as cost, efficiency, compliance and growth.',
  steps: [
    {
      label: 'Measurable outcomes',
      title: 'Outcomes you can measure',
      tone: 'teal',
      icon: 'radar',
      points: [
        { strong: 'Lower cost per transaction', text: 'through process automation.' },
        { strong: 'Faster cycle times', text: 'from intake to resolution.' },
        { strong: 'Higher accuracy,', text: 'tracked against an agreed evaluation set.' },
        { strong: 'Always available', text: 'within approved limits, with human escalation.' },
      ],
    },
    {
      label: 'Core AI + agentic capabilities',
      title: 'Core AI + agentic capabilities',
      tone: 'purple',
      icon: 'chip',
      points: [
        { strong: 'Function copilots:', text: 'finance, HR, compliance and customer service copilots built into your existing workflows.' },
        { strong: 'Knowledge-grounded agents:', text: 'RAG with structured knowledge (OKF) for accurate, source-cited answers.' },
        { strong: 'Cross-system orchestration:', text: 'agents coordinate across your APIs, SaaS apps and cloud platforms.' },
        { strong: 'Governed autonomy:', text: 'role-based permissions, approval steps, full audit trails and ongoing evaluation.' },
      ],
      link: { label: 'See function copilots at work in Dobby', href: '/products/dobby' },
    },
    {
      label: 'Business benefits',
      title: 'Business benefits',
      tone: 'green',
      icon: 'chart',
      points: [
        { strong: 'Faster path to production:', text: 'agents move from pilot to live use with governance in place from the start.' },
        { strong: 'Spend tied to results:', text: 'RaaS links fees to KPIs.' },
        { strong: 'Freed-up teams:', text: 'routine work is handled by agents, so people focus on exceptions and decisions.' },
        { strong: 'Compliance by design:', text: 'every action is logged, explainable and reviewable.' },
      ],
    },
  ],
};

export const AGENTIC_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Faster operations. Better output.',
  titleAccent: 'Real growth.',
  lead: 'Agentic AI turns routine processes into measurable returns: leaner operations, faster delivery and room to grow, with every agent tied to a KPI you agree up front.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Manual work that drains budget.',
      text: 'Manual, repetitive processes that slow teams down and drain budget across finance, HR, compliance and service.',
      image: IMG + 'impact-solves.webp', // PLACEHOLDER
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Pay for results, not hours.',
      textLead: 'With', strong: 'Results-as-a-Service (RaaS)',
      text: ', fees are tied to KPIs you agree up front, so you pay for verified business results, not hours logged.',
      image: IMG + 'impact-value.webp', // PLACEHOLDER
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'spark',
      title: 'Agents handle routine, people drive growth.',
      text: 'Governed agents handle the routine within approved limits, so work moves faster and your people focus on decisions that drive growth.',
      image: IMG + 'impact-efficiency.webp', // PLACEHOLDER
    },
  ],
  action: {
    kicker: 'See it in action',
    title: 'Dobby, our AI agent for Slack and Teams',
    text: 'Built on this agentic AI practice, Dobby pulls answers, builds reports and handles routine requests in the chat.',
    cta: 'Explore Dobby',
    href: '/products/dobby',
  },
};

export const AGENTIC_CTA = {
  titleLead: 'Which process should an agent',
  titleAccent: 'take on first?',
  lead: 'Tell us the KPI that matters. We’ll show how an agent could move it, which delivery model suits you and how we’d measure it.',
  image: IMG + 'cta-workstations.webp', // PLACEHOLDER
  imageAlt: 'Monitors showing agent dashboards in an office at dusk',
  secondaryLabel: 'Explore services',
  secondaryHref: '/#services',
};
