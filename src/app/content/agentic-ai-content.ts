/**
 * Copy for the Agentic AI service page (/services/agentic-ai), from the "Agentic AI V1.2" design
 * and the interaction walkthrough. Edit text here, not in the templates.
 * Style: sentence case, no comma before "and", full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { DeliveryContent, HelpContent, HeroContent, ImpactContent } from './content-types';

const IMG = 'assets/img/agentic/';

export const AGENTIC_HERO: HeroContent = {
  titleLead: 'QA agents that review your catalog,',
  titleAccent: 'with acceptance tied to results.',
  lead: 'SupplierClarity builds governed QA agents grounded in your channel rules, connects them to your catalog systems and measures them against acceptance KPIs you agree up front.',
  image: IMG + 'hero-workstation.webp',
  imageAlt: 'A monitor and laptop showing a QA agent workflow connected to catalog systems',
  chips: [
    { label: 'QA copilots', tone: 'blue' },
    { label: 'Governed autonomy', tone: 'blue' },
    { label: 'Rule-grounded verdicts', tone: 'yellow' },
  ],
};

/** Each shape flips to a coloured panel with a short explanation on hover, focus or tap. */
export const AGENTIC_WHY = {
  eyebrow: 'Why agentic QA',
  titleLead: 'Scale like a QA center.',
  titleAccent: 'Invest in acceptance.',
  lead: 'Pipelines give your catalog a modern foundation. Agentic QA puts it to work, turning imagery into acceptance rates you can measure.',
  shapes: [
    {
      shape: 'circle', icon: 'target', tone: 'blue',
      // Non-breaking hyphens keep "Results-as-a-Service" on one line
      kicker: 'AaaS (Acceptance‑as‑a‑Service)', title: 'Fees linked to acceptance',
      detail: 'We agree the acceptance KPI, the baseline and how it is measured before we build. Fees are tied to the improvement we verify, not to hours logged.',
      image: IMG + 'why-outcomes.webp',
    },
    {
      shape: 'cloud', icon: 'code', tone: 'purple',
      kicker: 'Rule-grounded', title: 'Agents that use your rules',
      detail: 'Agents judge from your approved channel rules, not from guesswork. Requirements, definitions and ownership are structured so verdicts are accurate and traceable to a rule.',
      image: IMG + 'why-knowledge.webp',
    },
    {
      shape: 'parallelogram', icon: 'database', tone: 'yellow',
      kicker: 'Your foundation', title: 'Built on what you already run',
      detail: 'Agents connect to the PIM, DAM and marketplaces you already run, so value arrives faster and nothing has to be rebuilt.',
      image: IMG + 'why-foundation.webp',
    },
  ],
};

export const AGENTIC_HELP: HelpContent = {
  eyebrow: 'How we help',
  titleLead: 'Agents in production.',
  titleAccent: 'Engineers on the ground.',
  lead: 'Rule-grounded QA copilots that work alongside your reviewers, agents built on proven evaluation frameworks that scale across categories and on-site engineers who make it all run.',
  resultLabel: 'The result',
  tabs: [
    {
      label: 'Grounded in your rules',
      tone: 'blue',
      icon: 'code',
      title: 'Agents grounded in your rules',
      intro: 'Agents are only as reliable as the rules behind them. We ground them in your channel requirements, then put them to work:',
      points: [
        { term: 'Structured rule packs:', text: 'resolution, background, crop and file-weight requirements written as linked, version-controlled rules, so agents follow explicit thresholds instead of inferring them.' },
        { term: 'Retrieval (RAG):', text: 'large rule sets across marketplaces and categories are searched at review time, and each verdict cites the rule it applied.' },
        { term: 'Action:', text: 'agents carry out the review across your systems within approved limits, and escalate borderline cases to a person.' },
      ],
      note: 'Rule packs are built in a portable, version-controlled form that works with any PIM or QA workflow.',
      image: IMG + 'help-team.webp',
      imageAlt: 'An engineer walks colleagues through a QA agent workflow on a large screen',
      resultText: 'Verdicts your teams can trust and your auditors can trace.',
    },
    {
      label: 'AI-first, acceptance-driven results',
      tone: 'purple',
      icon: 'target',
      title: 'Acceptance-as-a-Service (AaaS)',
      intro: 'You pay for the acceptance rate, not the effort. Every engagement runs in four steps:',
      points: [
        { term: 'Baseline:', text: 'measure today’s performance: first-pass acceptance, cost per image, turnaround time.' },
        { term: 'Target:', text: 'agree the KPI, the improvement and how it will be verified.' },
        { term: 'Deliver:', text: 'build, deploy and operate the QA agent.' },
        { term: 'Measure:', text: 'report against the baseline. Fees follow the verified result.' },
      ],
      note: 'Best for catalogs with a clear, measurable acceptance outcome that you can attribute to the agent.',
      image: IMG + 'help-raas.webp',
      imageAlt: 'A catalog leader reviews acceptance dashboards',
      resultText: 'Budget linked to catalog impact, and risk shared.',
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
          text: 'Our team builds in SupplierClarity delivery centers and works with yours through scheduled reviews, with rule documentation and training at each milestone.',
          bestWhen: 'requirements are clear and channel rules are well documented.',
        },
        {
          name: 'Forward-deployed team',
          text: 'Our engineers work inside your business, next to the people who run the catalog, with daily feedback and paired working until your team takes over.',
          bestWhen: 'workflows are complex, rules change often or sit across legacy systems.',
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
  title: 'Intelligent QA delivery',
  subtitle: 'QA agents that review, learn and optimize, securely.',
  lead: 'SupplierClarity ensures QA agents are not black boxes, but governed, explainable and aligned to measurable outcomes. Every agent is tied to catalog KPIs, such as acceptance rate, cost per image, compliance and time-to-shelf.',
  steps: [
    {
      label: 'Measurable outcomes',
      title: 'Outcomes you can measure',
      tone: 'teal',
      icon: 'radar',
      points: [
        { strong: 'Lower cost per image', text: 'through automated review.' },
        { strong: 'Faster verdicts', text: 'from upload to publish-ready.' },
        { strong: 'Higher acceptance,', text: 'tracked against an agreed evaluation set.' },
        { strong: 'Always available', text: 'within approved limits, with human escalation.' },
      ],
    },
    {
      label: 'Core AI + agentic capabilities',
      title: 'Core AI + agentic capabilities',
      tone: 'purple',
      icon: 'chip',
      points: [
        { strong: 'Category copilots:', text: 'grocery, fashion, electronics and marketplace QA copilots built into your existing workflows.' },
        { strong: 'Rule-grounded agents:', text: 'RAG with structured rule packs for accurate, rule-cited verdicts.' },
        { strong: 'Cross-system orchestration:', text: 'agents coordinate across your PIM, DAM, APIs and marketplaces.' },
        { strong: 'Governed autonomy:', text: 'role-based permissions, approval steps, full audit trails and ongoing evaluation.' },
      ],
      link: { label: 'See QA copilots at work in ComplyCheck', href: '/products/complycheck' },
    },
    {
      label: 'Business benefits',
      title: 'Business benefits',
      tone: 'green',
      icon: 'chart',
      points: [
        { strong: 'Faster path to production:', text: 'agents move from pilot to live use with governance in place from the start.' },
        { strong: 'Spend tied to acceptance:', text: 'AaaS links fees to KPIs.' },
        { strong: 'Freed-up teams:', text: 'routine review is handled by agents, so people focus on exceptions and decisions.' },
        { strong: 'Compliance by design:', text: 'every verdict is logged, explainable and reviewable.' },
      ],
    },
  ],
};

export const AGENTIC_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Faster operations. Better output.',
  titleAccent: 'Real growth.',
  lead: 'Agentic QA turns routine review into measurable returns: leaner QA, faster listings and room to grow, with every agent tied to a KPI you agree up front.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Manual review that drains budget.',
      text: 'Manual, repetitive image QA that slows listings down and drains budget across categories, channels and suppliers.',
      image: IMG + 'impact-solves.webp',
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Pay for acceptance, not hours.',
      textLead: 'With', strong: 'Acceptance-as-a-Service (AaaS)',
      text: ', fees are tied to KPIs you agree up front, so you pay for verified catalog results, not hours logged.',
      image: IMG + 'impact-value.webp',
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'spark',
      title: 'Agents handle routine, people drive growth.',
      text: 'Governed agents handle the routine within approved limits, so review moves faster and your people focus on decisions that drive growth.',
      image: IMG + 'impact-efficiency.webp',
    },
  ],
  action: {
    kicker: 'See it in action',
    title: 'ComplyCheck, our compliance engine',
    text: 'Built on this agentic QA practice, ComplyCheck reviews every batch and flags only what needs a human.',
    cta: 'Explore ComplyCheck',
    href: '/products/complycheck',
  },
};

export const AGENTIC_CTA = {
  titleLead: 'Which category should an agent',
  titleAccent: 'review first?',
  lead: 'Tell us the acceptance KPI that matters. We’ll show how an agent could move it, which delivery model suits you and how we’d measure it.',
  image: IMG + 'cta-workstations.webp',
  imageAlt: 'Monitors showing QA agent dashboards in an office at dusk',
  secondaryLabel: 'Explore the platform',
  secondaryHref: '/#services',
};
