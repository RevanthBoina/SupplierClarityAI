/**
 * Copy for the Company pages (Purpose & leadership, Clarity framework, Clarity for Good, Global presence),
 * following the site's copy rules (sentence case, no comma before "and", US spelling, full stops on bullets).
 */
import { DeliveryContent } from './content-types';

const IMG = 'assets/img/about/';

export const ABOUT_LINKS = {
  purpose: '/company/purpose-leadership',
  framework: '/company/framework',
  social: '/company/social-initiative',
  global: '/company/global-presence',
  services: '/#services',
  careers: '#',
  contact: '/enhance',
};

/* ------------------------------------------------------------------ Purpose & leadership */

export interface Leader {
  name: string;
  role: string;
  image: string;
  bio: string[];
  education?: string;
  founder?: boolean;
}

export interface Advisor {
  name: string;
  role: string;
  image: string;
  bio: string[];
  highlights?: string[];
}

export const PURPOSE = {
  hero: {
    titleLead: 'The best for your catalog,',
    titleAccent: 'from the best in the business.',
    lead: 'With expertise spanning image AI, catalog operations and marketplace compliance, we work tirelessly to deliver tailor-made enhancement pipelines that address the unique needs of every retailer.',
    image: IMG + 'team-group.webp',
    imageAlt: 'The SupplierClarity team collaborating in the studio',
    primary: { label: 'Our framework', href: ABOUT_LINKS.framework },
    secondary: { label: 'Explore the platform', href: ABOUT_LINKS.services },
  },
  story: {
    eyebrow: 'Our story',
    titleLead: 'From vision',
    titleAccent: 'to reality.',
    paragraphs: [
      'At SupplierClarity AI, our mission is simple: to empower retailers with image intelligence that drives measurable catalog outcomes.',
      'Unlike traditional vendors that treat imagery as a design problem or a storage problem, we built our foundation on the understanding that catalog quality is an operations problem, solved with AI.',
      'We don’t just enhance photos. We create opportunities for growth, collaboration and excellence. Let’s shape your catalog together.',
    ],
    milestones: [
      { year: '2022', label: 'Founded in Singapore' },
      { year: '3', label: 'Countries: Singapore, India and the Netherlands' },
      { year: '3M+', label: 'Supplier images enhanced' },
      { year: '40+', label: 'Team members building what’s next' },
    ],
  },
  values: {
    eyebrow: 'Our values',
    titleLead: 'The principles behind',
    titleAccent: 'every decision.',
    lead: 'The principles that guide every decision and drive our commitment to excellence.',
    items: [
      { title: 'Retailer centric', tone: 'teal', icon: 'heart', points: ['Every catalog is unique.', 'Listen a lot.', 'Earn trust.'] },
      { title: 'Quality obsessed', tone: 'purple', icon: 'target', points: ['Measure everything.', 'Enhance, then verify.', 'Solve.'] },
      { title: 'Walk the talk', tone: 'green', icon: 'shield', points: ['Say no when required.', 'Deliver.', 'Own up.'] },
    ],
  },
  leadership: {
    eyebrow: 'Leadership',
    titleLead: 'Diverse expertise,',
    titleAccent: 'one shared passion.',
    lead: 'Our leaders bring decades of experience across image AI, retail operations and marketplace compliance, united by a passion for catalogs that convert.',
    teamTitle: 'Leadership team',
    teamLead: 'The founders and leaders who make every deployment work. Select a profile to read more.',
  },
  leaders: [
    {
      name: 'Arjun Mehta', role: 'Founder & CEO', founder: true, image: IMG + 'lead-arjun.svg',
      bio: [
        'Arjun is responsible for market and customer value creation, leveraging people, domain and technology. A passionate business leader, he builds long-term relationships with retailers, marketplaces, partners and investors through mutual trust and accountability.',
        'He spent a decade running catalog operations at regional e-commerce leaders before founding SupplierClarity to fix the supplier-image problem he lived every day.',
      ],
      education: 'Engineering, NUS Singapore · MBA, INSEAD',
    },
    {
      name: 'Priya Raghavan', role: 'Co-founder & COO', image: IMG + 'lead-priya.svg',
      bio: [
        'Priya is responsible for sustainable business growth by enabling people and customer success. A seasoned operations leader, she inspires and unleashes human capital, instills corporate values and delivers value for customers.',
        'She practices accountability and walks the talk relentlessly. Across her career she has built award-winning catalog and fulfillment teams for grocery and fashion retailers.',
      ],
      education: 'Commerce, Madras Christian College · MBA, IIM Bangalore',
    },
    {
      name: 'Vikram Iyer', role: 'Co-founder & CTO', image: IMG + 'lead-vikram.svg',
      bio: [
        'Vikram provides technology direction for the organization in line with its business goals, with extensive experience in computer vision, super-resolution research and cloud-native pipelines.',
        'A proven global delivery leader for large image-processing initiatives, he researches new model architectures, sets policy on information security and data privacy, and keeps the enhancement pipeline honest: measurable quality, no black boxes.',
      ],
    },
    {
      name: 'Neha Kulkarni', role: 'Co-founder & CFO', image: IMG + 'lead-neha.svg',
      bio: [
        'Neha is a passionate business builder with the ability to drive the organization from dream to delight. A serial entrepreneur, her portfolio spans consumer marketplaces to enterprise SaaS.',
        'A strong advocate of corporate governance with integrity, she is an engineer and a keen learner of pricing strategy and unit economics for image workloads.',
      ],
    },
    {
      name: 'Farhan Ali', role: 'Chief Product Officer', image: IMG + 'lead-farhan.svg',
      bio: [
        'Forged in the early days of marketplace APIs, Farhan inspires high-performing teams to turn complex enhancement challenges into simple products that retailers actually enjoy using.',
        'Drawing on deep expertise in image quality assessment and workflow automation, he shapes product strategy with clear vision and collaboration.',
      ],
      education: 'Engineering, BITS Pilani · MS, TU Delft',
    },
    {
      name: 'Grace Tan', role: 'Chief Growth Officer (APAC) & VP, Sales', image: IMG + 'lead-grace.svg',
      bio: [
        'With two decades in retail technology, Grace has a strong track record of driving strategic growth and building trusted client partnerships across marketplaces, grocery, fashion and consumer electronics.',
        'She has led growth initiatives across catalog operations, PIM ecosystems, marketplace integrations and AI enhancement programs for regional and global brands.',
      ],
      education: 'B.BA, National University of Singapore · Executive program, Kellogg',
    },
    {
      name: 'Diego Morales', role: 'Relationship Head, EMEA', image: IMG + 'lead-diego.svg',
      bio: [
        'Diego has more than two decades of experience in retail, consumer goods, logistics and IT across the globe, helping European retailers modernize supplier onboarding and catalog imagery.',
        'A PIM expert and data quality evangelist, he works across catalog standardization, GS1 compliance and marketplace content programs.',
      ],
    },
    {
      name: 'Hana Suzuki', role: 'Director, Customer Success', image: IMG + 'lead-hana.svg',
      bio: [
        'Hana has played varied roles in corporate and not-for-profit organizations and is passionate about building long-term, impactful relationships with people and customers. She believes trust and respect must be earned.',
        'Her customer-centric principles are to earn trust and treat every catalog as unique. She holds an MBA in marketing and is an avid urban gardener.',
      ],
    },
    {
      name: 'Rohan Desai', role: 'Senior Director, Global Service Delivery', image: IMG + 'lead-rohan.svg',
      bio: [
        'A technology leader with over 20 years in delivery management, specializing in image pipelines and ML operations, Rohan has led consulting and delivery engagements across industries with a customer-first approach.',
        'He is passionate about mentoring and fostering a growth mindset. He is an alumnus of COEP Pune and IIT Madras.',
      ],
    },
    {
      name: 'Amara Okafor', role: 'Director, Sales & Marketing', image: IMG + 'lead-amara.svg',
      bio: [
        'Amara leads go-to-market strategy for SupplierClarity’s B2B expansion through account-based selling, market intelligence and a land-and-expand revenue model, with over eight years of experience scaling B2B SaaS ventures.',
        'Before SupplierClarity she spent four years in revenue operations at a global PIM vendor, with earlier roles at retail technology startups.',
      ],
    },
    {
      name: 'Elena Petrova', role: 'Senior Manager, People Success', image: IMG + 'lead-elena.svg',
      bio: [
        'Elena enables people success, helping everyone be their best and do their best at work. She believes “people are our brand” and builds people as brand ambassadors.',
        'She holds an MSc in Organizational Psychology from the University of Amsterdam and volunteers as a mentor for women returning to tech.',
      ],
    },
  ] as Leader[],
  advisory: {
    eyebrow: 'Advisory board',
    titleLead: 'Guided by',
    titleAccent: 'industry experts.',
    lead: 'Seasoned leaders from retail, marketplaces and beyond who help shape how we solve problems in their industries.',
    groups: [
      {
        label: 'Domain',
        advisors: [
          { name: 'Marcus Webb', role: 'Member, Retail Advisory Board', image: IMG + 'adv-marcus.svg',
            bio: ['Over three decades in big-box and grocery retail. As VP of E-commerce at a global grocery chain he led the migration of a 200,000-SKU catalog to rich media standards, and now advises retailers on content supply chains.'] },
          { name: 'Anita Krishnan', role: 'Member, Retail Advisory Board', image: IMG + 'adv-anita.svg',
            bio: ['Over 25 years in catalog operations and vendor management for fashion and general merchandise. Former Head of Seller Onboarding at a leading multi-vendor marketplace, where her team processed imagery from 40,000 sellers.'] },
          { name: 'Sofia Lindgren', role: 'Member, Marketplace Advisory Board', image: IMG + 'adv-sofia.svg',
            bio: ['An award-winning marketplace leader with over 20 years across European e-commerce, scaling cross-border catalogs and leading content-quality transformations for two top-five marketplaces.'],
            highlights: ['Marketplace Leader of the Year, Nordic Commerce Awards 2023', 'Top 50 Women in E-commerce, ECIC 2022'] },
          { name: 'David Chen', role: 'Member, Marketplace Advisory Board', image: IMG + 'adv-david.svg',
            bio: ['Over 25 years of leadership in retail technology. Former Director of Content Platforms at a global consumer-electronics marketplace, driving large-scale image QA automation and vendor compliance programs.'] },
        ] as Advisor[],
      },
      {
        label: 'Regional',
        advisors: [
          { name: 'Dr. Amina Yusuf', role: 'Regional Advisor, Middle East', image: IMG + 'adv-amina.svg',
            bio: ['Over 25 years across the private and public sectors in retail development and digital trade. Former advisor on e-commerce enablement programs with regional economic authorities.'] },
          { name: 'Omar Haddad', role: 'Regional Advisor, Middle East', image: IMG + 'adv-omar.svg',
            bio: ['An engineer with over 18 years in retail infrastructure and marketplace operations. Senior program lead for retail digitization initiatives, aligning operations with regional visions of sustainable commerce.'] },
        ] as Advisor[],
      },
    ],
  },
  join: {
    kicker: 'Join our team',
    titleLead: 'Build what’s next',
    titleAccent: 'with us.',
    lead: 'Be part of a culture that values creativity, strategic thinking and collaborative excellence.',
    stats: [
      { value: '40+', label: 'Team members' },
      { value: '120+', label: 'Catalogs transformed' },
      { value: '4+', label: 'Years of excellence' },
    ],
    image: IMG + 'team-group.webp',
    primary: { label: 'View open positions', href: ABOUT_LINKS.careers },
    secondary: { label: 'See what we do', href: ABOUT_LINKS.services },
  },
};

/* ------------------------------------------------------------------ Clarity framework */

export const FRAMEWORK = {
  hero: {
    titleLead: 'The Clarity',
    titleAccent: 'framework.',
    lead: 'Where image AI delivers catalog-ready results. Every 90 days. Every category. Every supplier.',
    image: IMG + 'framework-hero.webp',
    imageAlt: 'A team planning an image-operations roadmap together',
    chips: ['Image-AI framework', 'Quarterly impact', 'Use-case solutions'],
    primary: { label: 'Request a callback', href: ABOUT_LINKS.contact },
    secondary: { label: 'Meet our leaders', href: ABOUT_LINKS.purpose + '#leadership' },
  },
  approach: {
    eyebrow: 'Our approach',
    titleLead: 'Beyond catalog cleanup.',
    titleAccent: 'An image-first framework.',
    paragraphs: [
      'While others talk catalog cleanup, SupplierClarity delivers image intelligence that truly transforms catalog operations. Using our proven image-AI framework, we drive measurable outcomes in 90-day cycles.',
      'We don’t offer generic filters or one-off fixes. We build custom enhancement strategies that lift acceptance rates, cut reshoot costs and accelerate time-to-shelf.',
      'Every engagement focuses on specific business outcomes through image enhancement, quality analytics and compliance automation.',
    ],
    cycle: [
      { label: 'Audit', text: 'Benchmark every image against channel rules.' },
      { label: 'Align', text: 'Tie every category to an acceptance KPI.' },
      { label: 'Enhance', text: 'Ship a working pipeline in 90 days.' },
      { label: 'Optimize', text: 'Monitor, retrain and improve.' },
    ],
  },
  method: {
    eyebrow: 'Our method',
    title: 'The Clarity',
    titleAccent: 'image-operations method.',
    lead: 'Four stages, repeated every 90 days, so every engagement ends in a measurable outcome.',
    centered: true,
    steps: [
      { label: 'Catalog intelligence audit', title: 'Catalog intelligence audit', tone: 'teal', icon: 'radar',
        intro: 'Find the imagery gaps with the highest ROI.',
        points: [
          { text: 'Automated image mining maps your catalog against channel rules.' },
          { text: 'Hidden rejection drivers come to the surface.' },
          { text: 'The business impact of enhancement is quantified up front.' },
        ] },
      { label: 'Quality-strategic alignment', title: 'Quality-strategic alignment', tone: 'purple', icon: 'chart',
        intro: 'Every category targets a measurable outcome.',
        points: [
          { text: 'Acceptance-rate targets.' },
          { text: 'Time-to-shelf reduction.' },
          { text: 'Conversion and returns improvements.' },
        ] },
      { label: 'Enhancement pipeline delivery', title: 'Enhancement pipeline delivery', tone: 'green', icon: 'chip',
        intro: 'Catalog value delivered every 90 days.',
        points: [
          { text: 'Real-ESRGAN-class super-resolution tuned per category.' },
          { text: 'Compliance checks that prevent bad listings.' },
          { text: 'Deployed into the PIM and marketplaces you already use.' },
        ] },
      { label: 'Continuous quality optimization', title: 'Continuous quality optimization', tone: 'rose', icon: 'orbit',
        intro: 'Systems that evolve with your catalog.',
        points: [
          { text: 'Real-time monitoring of enhancement quality.' },
          { text: 'Automated model retraining on your categories.' },
          { text: 'Continuous process improvement.' },
        ] },
    ],
  } as DeliveryContent,
  stories: {
    eyebrow: 'Success stories',
    titleLead: 'Catalog quality,',
    titleAccent: 'delivered.',
    lead: 'A glimpse into the impact SupplierClarity has delivered for retailers across industries.',
    items: [
      { industry: 'Fashion', title: 'Zero-defect imagery at marketplace scale', client: 'Top-five fashion marketplace', image: IMG + 'story-insurance.webp',
        stat: { value: '96%', label: 'first-pass acceptance after enhancement' },
        q1: ['Automated upscaling and sharpening across 2M seller listings.', 'Background and crop standardization per category.', 'API-led integration connecting seller uploads to the PIM.'],
        q2: ['Compliance dashboards for category managers.', 'Automated rejection feedback to sellers.'],
        cta: 'Unlock marketplace scale' },
      { industry: 'Grocery', title: 'Pack-shot rescue for a national range', client: 'Regional grocery chain', image: IMG + 'story-maritime.webp',
        q1: ['Legacy pack shots upscaled and label-sharpened for 12,000 SKUs.', 'Consistent white-background standardization.', 'Automated ingest from supplier email attachments.'],
        q2: ['Zoom-ready detail images for the mobile app.', 'Automated publication back to the PIM.'],
        cta: 'Transform your grocery catalog' },
      { industry: 'Consumer electronics', title: 'Zoom-ready detail from legacy photos', client: 'Consumer-electronics retailer', image: IMG + 'story-banking.webp',
        q1: ['Supplier snapshots upscaled 4× with texture-accurate detail.', 'Automated angle and crop checks.', 'Enhancement embedded in the PIM workflow.'],
        q2: ['Predictive QA flagging images that need reshoots.', 'Faster time-to-shelf for seasonal ranges.'],
        cta: 'Unlock sharper electronics imagery' },
    ],
  },
  philosophy: {
    eyebrow: 'Our philosophy',
    titleLead: 'Our image-AI',
    titleAccent: 'philosophy.',
    lead: 'Three beliefs shape every engagement, from the first audit to the last model update.',
    items: [
      { title: 'Enhancement with intent', icon: 'bulb', points: ['We don’t enhance blindly. We enhance toward a channel rule.', 'AI finds the quality gap before anything is processed.', 'Every deployment is built for accuracy and measurable value.'] },
      { title: 'Business outcome obsession', icon: 'trend', points: ['Every pipeline is tied to catalog KPIs.', 'Cost reduction through automated quality gates.', 'Revenue growth through imagery that converts.'] },
      { title: 'Transparent AI partnership', icon: 'eye', points: ['Full visibility into enhancement decisions and quality scores.', 'Every model output is auditable and explainable, never a black box.', 'Results that are measurable and aligned to your goals.'] },
    ],
  },
  different: {
    eyebrow: 'Why SupplierClarity',
    titleLead: 'What makes our image AI',
    titleAccent: 'different.',
    items: [
      { title: 'Outcome-driven enhancement', text: 'We don’t process images for technology’s sake. Every pipeline connects directly to measurable catalog improvements and ROI.' },
      { title: 'Rules-first pipelines', text: 'Before enhancing, we benchmark. Catalog intelligence finds the quality gaps that actually cause rejections.' },
      { title: 'Continuous learning systems', text: 'Our pipelines don’t just enhance. They learn, adapt and keep improving with your categories and channels over time.' },
      { title: 'Enterprise-grade image security', text: 'Built-in compliance, auditable outputs and enterprise security keep supplier imagery to the highest standards.' },
    ],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    titleLead: 'Capabilities that',
    titleAccent: 'drive results.',
    lead: 'The building blocks we combine in every 90-day cycle.',
    items: [
      { title: 'Super-resolution enhancement', points: ['Real-ESRGAN-class models tuned per category.', 'Detail reconstruction for text, labels and fabric.', 'Up to 4× output with quality scoring.'] },
      { title: 'Catalog quality analytics', points: ['Automated benchmarks against marketplace rules.', 'Rejection-driver analysis per supplier and category.', 'Predictive QA before images go live.'] },
      { title: 'Compliance automation', points: ['Real-time checks for resolution, background and crop.', 'Automated compliance monitoring and reporting.', 'Channel-specific rule packs.'] },
      { title: 'Supplier experience automation', points: ['Self-service upload portals for vendors.', 'Automated feedback with fix instructions.', 'Predictive intake quality scoring.'] },
    ],
  },
  cta: {
    titleLead: 'Ready to enhance your',
    titleAccent: 'path to catalog quality?',
    lead: 'Stop rejecting supplier images that AI can fix. Get an enhancement pipeline that delivers measurable outcomes every quarter.',
    primary: { label: 'Start your image transformation', href: ABOUT_LINKS.contact },
    secondary: { label: 'Explore the platform', href: ABOUT_LINKS.services },
  },
};

/* ------------------------------------------------------------------ Clarity for Good */

export const SOCIAL = {
  hero: {
    eyebrow: 'Our social initiative',
    titleLead: 'Opportunity begins when',
    titleAccent: 'someone opens a door.',
    lead: 'At SupplierClarity AI, we believe progress means more when we give back. Through the Brightbook Project, we’re helping make digital learning more accessible and creating opportunities for children to learn, grow and dream bigger.',
    image: IMG + 'school-child.webp',
    imageAlt: 'A smiling student writing in her notebook in class',
    stat: { value: 65, label: 'students’ learning kits funded by SupplierClarity' },
  },
  community: {
    eyebrow: 'The community we support',
    titleLead: 'Every child deserves',
    titleAccent: 'a chance to thrive.',
    text: 'The Brightbook Project partners with community learning centers that provide free after-school education to children from underserved neighborhoods in Singapore and Bengaluru. Their work makes foundational literacy and digital skills more accessible, giving children the chance to build knowledge, confidence and a brighter future.',
    image: IMG + 'school-gate.webp',
    imageAlt: 'The entrance of a community learning center',
    place: 'Singapore & Bengaluru',
  },
  contribute: {
    eyebrow: 'How we contribute',
    titleLead: 'Showing up,',
    titleAccent: 'in more ways than one.',
    items: [
      { title: 'Making learning accessible', text: 'SupplierClarity funds learning kits and tuition support for about 30% of the centers’ students, helping reduce financial barriers to learning.', stat: '30%', statLabel: 'of students supported', tone: 'blue', icon: 'book' },
      { title: 'Sharing our time', text: 'Our employees volunteer at the centers, teaching, sharing knowledge and encouraging curiosity through meaningful interactions.', stat: '1:1', statLabel: 'time with the children', tone: 'yellow', icon: 'hands' },
    ],
  },
  journey: {
    eyebrow: 'A shared journey',
    titleLead: 'Learning goes',
    titleAccent: 'both ways.',
    text: 'We believe giving back is about more than what we contribute. It’s about showing up, sharing experiences and learning from one another. Through our time with the children, we hope to nurture curiosity, inspire confidence and build meaningful connections.',
    image: IMG + 'school-team.webp',
    imageAlt: 'SupplierClarity team members with teachers at a learning center',
    words: ['Curiosity', 'Confidence', 'Connection'],
  },
  cta: {
    titleLead: 'More opportunities.',
    titleAccent: 'Brighter tomorrows.',
    lead: 'We believe in giving back. If you’d like to support the Brightbook Project or volunteer with us, we’d love to hear from you.',
    primary: { label: 'Get in touch', href: ABOUT_LINKS.contact },
    secondary: { label: 'Meet our people', href: ABOUT_LINKS.purpose + '#leadership' },
  },
};

/* ------------------------------------------------------------------ Global presence */

export interface Region {
  id: string;
  name: string;
  flag: string;
  cities: string;
  tagline: string;
  image: string;
  imageAlt: string;
}

export const GLOBAL = {
  hero: {
    eyebrow: 'Global presence',
    titleLead: 'Local insight.',
    titleAccent: 'Global delivery.',
    lead: 'We operate across Singapore, India and the Netherlands, bringing image AI and catalog expertise to retailers in every market we serve.',
    stats: [
      { value: '3', label: 'Countries' },
      { value: '3', label: 'Cities' },
      { value: '40+', label: 'People' },
    ],
  },
  regions: [
    { id: 'singapore', name: 'Singapore', flag: '🇸🇬', cities: 'Singapore (HQ)', tagline: 'Headquarters, product and regional delivery', image: IMG + 'region-singapore.webp', imageAlt: 'The Singapore skyline at dusk' },
    { id: 'india', name: 'India', flag: '🇮🇳', cities: 'Bengaluru', tagline: 'Engineering and catalog delivery at scale', image: IMG + 'region-bangalore.webp', imageAlt: 'A Bengaluru tech-park skyline at golden hour' },
    { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', cities: 'Amsterdam', tagline: 'European retailer partnerships', image: IMG + 'region-amsterdam.webp', imageAlt: 'Amsterdam canal houses at dusk' },
  ] as Region[],
  india: {
    titleLead: 'Where it',
    titleAccent: 'all began.',
    text: 'Our Bengaluru engineering hub was the first SupplierClarity office. The team here builds and operates the enhancement pipeline, the APIs and our products: Clarity Upscaler, BatchForge, PIM Connect and ComplyCheck.',
    points: ['Engineering and delivery for every engagement.', 'Home of our image-AI research team.', 'SOC 2 aligned security practices.'],
  },
  singapore: {
    titleLead: 'Headquarters in',
    titleAccent: 'the city of the future.',
    intro: [
      'Singapore is not just our home base. It’s a global hub of trade and innovation, where retail supply chains from every continent converge.',
      'From here we partner with marketplaces and retail groups across APAC, delivering tailored enhancement pipelines with measurable ROI and tangible catalog impact.',
    ],
    footprintTitle: 'Our APAC footprint',
    footprint: [
      { title: 'Marketplaces', text: 'Seller-image standardization for multi-vendor platforms.' },
      { title: 'Grocery retail', text: 'Pack-shot enhancement and label legibility at range scale.' },
      { title: 'Fashion', text: 'Zoom-ready fabric detail and true-to-colour output.' },
      { title: 'Consumer electronics', text: 'Detail-image enhancement for spec-driven shoppers.' },
    ],
    solutionsTitle: 'Empowering retailers with image AI and catalog automation',
    solutions: [
      'Super-resolution enhancement tuned per category.',
      'Automated compliance checks before images go live.',
      'End-to-end ingest pipelines built for scale.',
      'PIM and marketplace integrations aligned with each client’s stack.',
      'Agentic QA agents acting as specialized copilots for catalog teams.',
    ],
    gallery: [
      { image: IMG + 'region-singapore.webp', alt: 'The Singapore skyline at dusk' },
      { image: IMG + 'team-group.webp', alt: 'The SupplierClarity team collaborating' },
      { image: IMG + 'framework-hero.webp', alt: 'A team planning an image-operations roadmap' },
    ],
    advisorsTitle: 'Regional advisors, APAC and Middle East',
    closing: 'As retail prepares for the next decade of AI-assisted commerce, Singapore is leading the charge, and we help businesses here embrace rapid transformation through image-driven strategy, automation and catalog intelligence.',
  },
  netherlands: {
    titleLead: 'Partnership at the',
    titleAccent: 'heart of Europe.',
    intro: 'At SupplierClarity, we’re not just another SaaS vendor. We’re here to challenge the norm and build the unique. Our Amsterdam team reflects our commitment to cutting-edge image AI and catalog solutions for forward-thinking European retailers.',
    pillars: [
      { title: 'Retail expertise', image: IMG + 'region-amsterdam.webp', points: ['Experts in grocery, fashion, electronics and marketplace retail.', 'Proven delivery for multi-vendor platforms and national chains.', 'Catalog, data and AI transformation that lasts.'] },
      { title: 'Customer-centric innovation', image: IMG + 'team-group.webp', points: ['Business-first technology with clear ROI.', 'Enhancement pipelines that cut time-to-shelf.', 'Quality analytics for smarter decisions.'] },
      { title: 'Commitment to customer success', image: IMG + 'framework-hero.webp', points: ['Business needs first, not just technology.', 'Partnerships that build scalable, future-ready catalogs.', 'Solutions tailored for innovation and growth.'] },
      { title: 'Future-ready tech', image: IMG + 'region-singapore.webp', points: ['Image AI and automation that future-proof the catalog.', 'Scalable architectures for long-term success.', 'Predictive QA for data-driven decisions.'] },
    ],
  },
  cta: {
    titleLead: 'Take the next step toward your',
    titleAccent: 'catalog-ready future.',
    lead: 'Wherever you are, our teams in Singapore, India and the Netherlands are ready to help.',
    primary: { label: 'Request a call', href: ABOUT_LINKS.contact },
    secondary: { label: 'Explore the platform', href: ABOUT_LINKS.services },
  },
};
