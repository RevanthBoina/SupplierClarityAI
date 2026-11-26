/**
 * Copy for the Dobby product page (/products/dobby), from the "Dobby V1" design and its capability screenshots.
 * Style: sentence case, no comma before "and", commas or colons instead of dashes, full stops on bullets.
 * Images marked PLACEHOLDER are cut from the design files; replace them with the originals.
 */
import { CapabilitiesContent, CtaBandContent, HelpContent, ImpactContent, ProductHeroContent, ProductVideoContent } from './content-types';

const IMG = 'assets/img/dobby/';
const DEMO = '#contact';

export const DOBBY_HERO: ProductHeroContent = {
  title: [
    { text: 'The intelligent AI agent', breakAfter: true },
    { text: 'behind faster decisions.', accent: true },
  ],
  lead: 'Dobby is WhiteBlue’s AI agent for Slack and Microsoft Teams. It pulls answers from the systems your teams already use, builds reports and handles routine requests in plain English.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Watch Dobby in action', href: '/products/dobby#dobby-video' },
  logo: IMG + 'logo-orb.png', // PLACEHOLDER, cut from the design
  logoAlt: 'Dobby logo',
  accent: '#b33fd6',
  chips: [
    { label: 'Slack · Microsoft Teams', tone: 'accent' },
    { label: 'Real-time data', tone: 'blue' },
    { label: 'Insightful reports', tone: 'accent' },
    { label: 'Plain-English answers', tone: 'blue' },
  ],
};

export const DOBBY_VIDEO: ProductVideoContent = {
  id: 'dobby-video',
  title: [
    { text: 'Any question.', breakAfter: true },
    { text: 'Everything your team needs, in seconds.', accent: true },
  ],
  lead: 'Dobby connects to your CRM, HR and operations systems, so anyone can ask in plain English and get the figure, record or report without leaving the conversation.',
  poster: IMG + 'video-poster.webp', // PLACEHOLDER
  posterAlt: 'A team member asking Dobby a question at her laptop',
  caption: 'Watch Dobby video',
  duration: '1:20 min',
  videoUrl: 'https://www.youtube.com/embed/q-5o59z5ddk', // youtu.be/q-5o59z5ddk
};

export const DOBBY_CAPABILITIES: CapabilitiesContent = {
  eyebrow: 'Capabilities',
  eyebrowIcon: 'capabilities',
  titleLead: 'What Dobby does',
  titleAccent: 'for your teams',
  intervalMs: 3500,
  items: [
    { name: 'Real-time data retrieval', title: 'Ask for a number. Get it in the chat.', image: IMG + 'cap-1.webp',
      text: 'Dobby connects to your platforms and pulls the figures you ask for, from sales numbers to employee details and operational stats, so decisions rest on current data.' },
    { name: 'Ease of access', title: 'Works where your teams already talk.', image: IMG + 'cap-2.webp',
      text: 'Dobby lives inside Slack and Microsoft Teams. Nobody learns a new tool or switches apps; they simply ask in the chat.' },
    { name: 'Customizable agents', title: 'Shaped around your systems.', image: IMG + 'cap-3.webp',
      text: 'Each Dobby agent is configured to connect to the platforms that matter to you, such as your CRM and project tools, and to answer the questions your teams ask most. Built on WhiteBlue’s agentic AI practice.',
      link: { label: 'agentic AI', href: '/services/agentic-ai' } },
    { name: 'Natural language processing', title: 'Plain-English questions. Clear answers.', image: IMG + 'cap-4.webp',
      text: 'No query language or dashboards to learn. Ask the way you would ask a colleague and Dobby replies with a clear, concise answer.' },
    { name: 'Secure integration', title: 'Your data stays protected.', image: IMG + 'cap-5.webp',
      text: 'Dobby connects with security controls built in, keeping financial data and employee records private. See how we handle trust and security.',
      link: { label: 'trust and security', href: '#' } }, // TODO: trust and security page
    { name: 'Insightful reports', title: 'From raw data to ready reports.', image: IMG + 'cap-6.webp',
      text: 'Dobby turns data into reports on performance trends, departmental summaries and predictive analytics, ready to share in the chat.' },
  ],
};

export const DOBBY_INDUSTRIES: HelpContent = {
  eyebrow: '',
  titleLead: 'Dobby for',
  titleAccent: 'every industry',
  lead: 'Tailored AI solutions to optimize workflows across diverse sectors.',
  resultLabel: 'How WhiteBlue helped',
  tabs: [
    {
      label: 'Ports', tone: 'blue', icon: 'document', title: 'Ports',
      intro: 'Dobby helps port managers and operations teams run a complex operation with data at hand:',
      points: [
        { term: 'Monitor vessel activities:', text: 'updates on vessel visits, berthing schedules and crane productivity.' },
        { term: 'Optimize operations:', text: 'total moves, arrival delays and congestion causes.' },
        { term: 'Instant key reports:', text: 'ship handling targets, crane deployment and common delay reasons.' },
      ],
      image: IMG + 'ind-ports.webp', // PLACEHOLDER
      imageAlt: 'A port supervisor checking a tablet beside a container ship',
      resultText: 'Port operations teams get vessel, berth and crane data on request, right in the chat.',
    },
    {
      label: 'HR', tone: 'purple', icon: 'chat', title: 'HR',
      intro: 'Dobby gives employees and managers instant answers on everyday HR questions:',
      points: [
        { term: 'Onboarding support:', text: 'first-day details and document requirements.' },
        { term: 'Employee support:', text: 'leave balances, training, holidays and pay slips.' },
        { term: 'Manager insights:', text: 'attrition trends, appraisals and training status.' },
      ],
      image: IMG + 'ind-hr.webp', // PLACEHOLDER
      imageAlt: 'Two colleagues reviewing HR answers from Dobby on a laptop',
      resultText: 'HR teams spend less time on routine queries, and employees get answers when they need them.',
    },
  ],
};

export const DOBBY_IMPACT: ImpactContent = {
  eyebrow: 'Business impact',
  titleLead: 'Your data, on demand.',
  titleAccent: 'Your teams, at full speed.',
  // The design's lead runs off the page; the opening and ending are completed here. Please confirm.
  lead: 'Dobby turns questions into answers, reports and completed requests inside Slack and Microsoft Teams, so your teams get more done and decisions move faster.',
  items: [
    { kicker: 'What it solves', tone: 'teal', icon: 'grid', title: 'Teams stuck chasing the same answers.',
      text: 'Teams waiting on reports, chasing numbers across systems and fielding the same HR and operations questions every day.', image: IMG + 'impact-solves.webp' },
    { kicker: 'The value it brings', tone: 'purple', icon: 'trend', title: 'Act on today’s data, not next week’s report.',
      text: 'Leaders act on current data the moment they need it, so opportunities are spotted sooner and decisions don’t wait on the next report.', image: IMG + 'impact-value.webp' },
    { kicker: 'The efficiency you gain', tone: 'green', icon: 'bolt', title: 'More done, same headcount.',
      text: 'AI handles routine requests and reporting, so the same teams deliver more without adding headcount or new tools.', image: IMG + 'impact-efficiency.webp' },
  ],
  action: {
    kicker: 'The technology behind Dobby',
    title: 'Built on WhiteBlue’s agentic AI',
    text: 'Dobby runs on the same governed, knowledge-grounded agents we build for enterprises across finance, HR, compliance and service.',
    cta: 'Explore agentic AI',
    href: '/services/agentic-ai',
  },
};

export const DOBBY_CTA: CtaBandContent = {
  titleLead: 'See what Dobby can',
  titleAccent: 'answer for you.',
  lead: 'Book a demo and we’ll show Dobby working with the systems and questions your teams handle every day.',
  primary: { label: 'Request demo', href: DEMO },
  secondary: { label: 'Explore agentic AI', href: '/services/agentic-ai' },
};
