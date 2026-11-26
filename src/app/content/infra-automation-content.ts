/**
 * Copy for the Infra automation service page (/services/infra-automation), from the
 * "Infra Automation V1.1" design and walkthrough. Global copy rules applied (see DESIGN-RULES.md).
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 * Statistics (90%, 99%, 0%, 40%, 95%…) come from the design and need confirming before launch.
 */
import { ImpactContent, CapabilitiesContent } from './content-types';

const IMG = 'assets/img/infra/';

export const INFRA_HERO = {
  titleLead: 'Infrastructure excellence,',
  titleAccent: 'powered by AI.',
  lead: 'With WhiteBlue’s infrastructure automation, manual setups become code-driven cloud environments that launch faster, stay reliable and scale with your growth.',
  stats: [
    { value: '90%', label: 'Deployment time reduction through intelligent automation', tone: 'blue' },
    { value: '99%', label: 'Infrastructure reliability via predictive monitoring', tone: 'grey' },
    { value: '0%', label: 'Manual configuration drift with self-correcting systems', tone: 'yellow' },
  ],
  image: IMG + 'hero-datacenter.webp', // PLACEHOLDER
  imageAlt: 'A laptop on a stand in a data center aisle',
};

export const INFRA_SPEND = {
  titleLead: 'Spend less on cloud.',
  titleAccent: 'Scale more with it.',
  lead: 'Our machine learning algorithms analyze your usage patterns, forecast future demand and dynamically adjust resource allocation, keeping performance intact while optimizing costs. Whether you’re looking at AWS cost optimization or Azure cost management, we identify waste, right-size resources and recommend architectural changes that align with your business goals.',
  stats: [
    { value: '40%', label: 'Average cost savings through intelligent right-sizing' },
    { value: '30 days', label: 'To see optimization in action' },
    { value: '24/7', label: 'AI-powered cost monitoring and adjustment' },
  ],
  cta: 'See what we build',
  ctaHref: '/#services',
  image: IMG + 'spend-engineer.webp', // PLACEHOLDER
  imageAlt: 'An engineer working on a laptop in a server room',
};

/** Auto-advances every few seconds; pauses while hovered or focused. */
export const INFRA_CAPABILITIES: CapabilitiesContent = {
  titleLead: 'Core AI-enhanced',
  titleAccent: 'capabilities',
  intervalMs: 3500,
  items: [
    {
      name: 'Intelligent IaC',
      text: 'Our ML-powered Terraform and Ansible implementations automatically detect configuration drift, suggest optimizations and self-heal issues before they escalate.',
      image: IMG + 'cap-1.webp', // PLACEHOLDER
    },
    {
      name: 'Autonomous CI/CD pipelines',
      text: 'Self-learning deployment pipelines that monitor trends, predict failures and optimize release processes, all while ensuring security and compliance.',
      image: IMG + 'cap-2.webp', // PLACEHOLDER
    },
    {
      name: 'Predictive cost intelligence',
      text: 'Advanced analytics that forecast cloud spending trends, identify cost-saving opportunities and automate remediation.',
      image: IMG + 'cap-3.webp', // PLACEHOLDER
    },
    {
      name: 'Adaptive security & compliance',
      text: 'Machine learning models continuously monitor infrastructure for threats, enforce policies and adapt to changing compliance requirements automatically.',
      image: IMG + 'cap-4.webp', // PLACEHOLDER
    },
    {
      name: 'Cross-cloud AI orchestration',
      text: 'Unified AI governance across AWS, Azure and GCP, intelligently selecting the best cloud services based on performance, cost and workload needs.',
      image: IMG + 'cap-5.webp', // PLACEHOLDER
    },
    {
      name: 'Continuous optimization',
      text: 'Our systems learn from every deployment, rollback and anomaly, improving infrastructure performance and minimizing manual intervention over time.',
      image: IMG + 'cap-6.webp', // PLACEHOLDER
    },
  ],
};

export const INFRA_BENEFITS = {
  titleLead: 'AI-driven',
  titleAccent: 'transformation benefits',
  items: [
    { icon: 'code', title: 'Accelerated innovation', text: 'AI identifies deployment bottlenecks and release windows, enabling faster delivery with lower risk.' },
    { icon: 'gear', title: 'Autonomous operations', text: 'Routine tasks are handled by intelligent automation, so your teams can focus on innovation and strategic goals.' },
    { icon: 'database', title: 'Predictive cost management', text: 'Forecast your 6-month cloud spend with up to 95% accuracy, and plan ahead with confidence.' },
    { icon: 'shield', title: 'Self-healing security', text: 'Security controls evolve with threats, maintaining compliance across environments with minimal human oversight.' },
  ],
};

export const INFRA_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Shorter release cycles. Fewer outages.',
  titleAccent: 'Leaner operations.',
  lead: 'Code-driven infrastructure that scales with demand and corrects itself, so your cloud supports growth instead of slowing it.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Manual setups that slow every release.',
      text: 'Manual setups, configuration drift and unpredictable cloud costs that slow every release.',
      image: IMG + 'impact-solves.webp', // PLACEHOLDER
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Spend that tracks growth.',
      text: 'Infrastructure that scales and right-sizes with demand, so spend tracks growth and outages stop costing customers.',
      image: IMG + 'impact-value.webp', // PLACEHOLDER
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'More releases, fewer incidents.',
      text: 'Environments spin up on demand through code, so teams release more often with fewer incidents.',
      image: IMG + 'impact-efficiency.webp', // PLACEHOLDER
    },
  ],
  action: {
    kicker: 'Pair it with',
    title: 'QuickQode, our AI coding accelerator',
    text: 'Generate, test and document code with AI, then ship it on automated infrastructure.',
    cta: 'Explore QuickQode',
    href: '/products/quickqode',
  },
};

export const INFRA_CTA = {
  titleLead: 'Ready to automate',
  titleAccent: 'how you scale?',
  lead: 'Code-driven infrastructure that spins up fast, fixes itself and scales as your business grows.',
  image: IMG + 'cta-dashboards.webp', // PLACEHOLDER
  imageAlt: 'Monitoring dashboards on screens in a data center',
  secondaryLabel: 'Explore services',
  secondaryHref: '/#services',
};
