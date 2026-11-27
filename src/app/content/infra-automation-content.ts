/**
 * Copy for the Infra automation service page (/services/infra-automation), from the
 * "Infra Automation V1.1" design and walkthrough. Global copy rules applied (see DESIGN-RULES.md).
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 * Statistics (90%, 99%, 0%, 40%, 95%…) come from the design and need confirming before launch.
 */
import { ImpactContent, CapabilitiesContent } from './content-types';

const IMG = 'assets/img/infra/';

export const INFRA_HERO = {
  titleLead: 'Catalog workflow excellence,',
  titleAccent: 'powered by AI.',
  lead: 'With SupplierClarity’s workflow automation, manual catalog work becomes pipeline-driven flow that onboards suppliers faster, stays consistent and scales with your assortment.',
  stats: [
    { value: '90%', label: 'Faster supplier onboarding through automated ingest', tone: 'blue' },
    { value: '99%', label: 'Pipeline reliability via predictive monitoring', tone: 'grey' },
    { value: '0%', label: 'Manual touch-ups with self-correcting pipelines', tone: 'yellow' },
  ],
  image: IMG + 'hero-datacenter.webp',
  imageAlt: 'A laptop running the enhancement pipeline in a server room',
};

export const INFRA_SPEND = {
  titleLead: 'Spend less on QA.',
  titleAccent: 'Publish more with it.',
  lead: 'Our machine learning models analyze your rejection patterns, forecast category demand and dynamically adjust enhancement intensity, keeping quality intact while optimizing processing costs. Whether you’re processing a thousand images a week or two million, we identify waste, right-size pipelines and recommend rule changes that align with your channels.',
  stats: [
    { value: '40%', label: 'Average QA savings through intelligent pre-scoring' },
    { value: '30 days', label: 'To see the pipeline in action' },
    { value: '24/7', label: 'Automated ingest and enhancement monitoring' },
  ],
  cta: 'See what we build',
  ctaHref: '/#services',
  image: IMG + 'spend-engineer.webp',
  imageAlt: 'An engineer working on the enhancement pipeline on a laptop',
};

/** Auto-advances every few seconds; pauses while hovered or focused. */
export const INFRA_CAPABILITIES: CapabilitiesContent = {
  titleLead: 'Core AI-enhanced',
  titleAccent: 'workflow capabilities',
  intervalMs: 3500,
  items: [
    {
      name: 'Automated supplier ingest',
      text: 'Email attachments, SFTP drops, portal uploads and PIM exports flow into one queue automatically, with intake quality scored before a human ever sees the file.',
      image: IMG + 'cap-1.webp',
    },
    {
      name: 'Hands-free enhancement',
      text: 'Self-tuning pipelines pick the right enhancement model and rules per category, monitor trends and optimize output, all while ensuring channel compliance.',
      image: IMG + 'cap-2.webp',
    },
    {
      name: 'Predictive QA intelligence',
      text: 'Analytics that forecast rejection patterns by supplier and category, identify root causes and automate the fix.',
      image: IMG + 'cap-3.webp',
    },
    {
      name: 'Adaptive compliance',
      text: 'Rule packs continuously track marketplace requirement changes, enforce them at ingest and adapt without manual updates.',
      image: IMG + 'cap-4.webp',
    },
    {
      name: 'Cross-channel orchestration',
      text: 'Unified orchestration across PIM, DAM and marketplaces, intelligently selecting the best route for every asset based on rules, cost and workload.',
      image: IMG + 'cap-5.webp',
    },
    {
      name: 'Continuous optimization',
      text: 'Our systems learn from every batch, rejection and supplier pattern, improving catalog throughput and minimizing manual intervention over time.',
      image: IMG + 'cap-6.webp',
    },
  ],
};

export const INFRA_BENEFITS = {
  titleLead: 'AI-driven',
  titleAccent: 'catalog benefits',
  items: [
    { icon: 'code', title: 'Faster listings', text: 'AI identifies intake bottlenecks and quality gaps, enabling faster time-to-shelf with lower risk.' },
    { icon: 'gear', title: 'Autonomous operations', text: 'Routine enhancement and QA are handled by intelligent automation, so your teams can focus on assortment and strategy.' },
    { icon: 'database', title: 'Predictive capacity planning', text: 'Forecast your enhancement workload with up to 95% accuracy, and plan ahead with confidence.' },
    { icon: 'shield', title: 'Self-healing pipelines', text: 'Quality controls evolve with channel rules, maintaining compliance across markets with minimal human oversight.' },
  ],
};

export const INFRA_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Shorter release cycles. Fewer outages.',
  titleAccent: 'Leaner operations.',
  lead: 'Pipeline-driven catalog flow that scales with demand and corrects itself, so imagery supports growth instead of slowing it.',
  items: [
    {
      kicker: 'What it solves', tone: 'teal', icon: 'grid',
      title: 'Manual steps that slow every listing.',
      text: 'Manual touch-ups, duplicate requests to suppliers and unpredictable QA queues that slow every launch.',
      image: IMG + 'impact-solves.webp',
    },
    {
      kicker: 'The value it brings', tone: 'purple', icon: 'trend',
      title: 'Throughput that tracks growth.',
      text: 'Pipelines that scale and right-size with catalog demand, so onboarding tracks growth and imagery stops costing launches.',
      image: IMG + 'impact-value.webp',
    },
    {
      kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt',
      title: 'More listings, fewer exceptions.',
      text: 'Images flow on demand through the pipeline, so teams publish more often with fewer exceptions.',
      image: IMG + 'impact-efficiency.webp',
    },
  ],
  action: {
    kicker: 'Pair it with',
    title: 'PIM Connect, our channel sync engine',
    text: 'Enhance automatically, then sync to every PIM and marketplace without re-uploads.',
    cta: 'Explore PIM Connect',
    href: '/products/pim-connect',
  },
};

export const INFRA_CTA = {
  titleLead: 'Ready to automate',
  titleAccent: 'how your catalog flows?',
  lead: 'Pipeline-driven catalog operations that ingest instantly, enhance automatically and scale as your assortment grows.',
  image: IMG + 'cta-dashboards.webp',
  imageAlt: 'Enhancement queue dashboards on screens in a server room',
  secondaryLabel: 'Explore the platform',
  secondaryHref: '/#services',
};
