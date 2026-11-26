/**
 * Copy for the Company pages (Purpose & leadership, WhiteBlue framework, Social initiative, Global presence),
 * taken from the current whiteblue.com pages and edited to the site's copy rules
 * (sentence case, no comma before "and", commas instead of dashes, US spelling, full stops on bullets).
 * Photos come from whiteblue.com; leader portraits are re-cut onto one blue backdrop.
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
  contact: '#contact',
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
    titleLead: 'The best for your business,',
    titleAccent: 'from the best in the business.',
    lead: 'With expertise spanning AI, cloud, data and IoT, we work tirelessly to deliver tailor-made strategies that address the unique needs of every client.',
    image: IMG + 'team-group.webp',
    imageAlt: 'The WhiteBlue team together at a company event',
    primary: { label: 'Our framework', href: ABOUT_LINKS.framework },
    secondary: { label: 'Explore our services', href: ABOUT_LINKS.services },
  },
  story: {
    eyebrow: 'Our story',
    titleLead: 'From vision',
    titleAccent: 'to reality.',
    paragraphs: [
      'At WhiteBlue, our mission is simple: to empower businesses with transformative technology solutions that drive measurable outcomes.',
      'Unlike traditional agencies that lean heavily toward either creativity or technology, we’ve built our foundation on the understanding that transformative results require both.',
      'We don’t just build solutions. We create opportunities for growth, collaboration and excellence. Let’s shape the future together.',
    ],
    milestones: [
      { year: '2020', label: 'Founded in Chennai' },
      { year: '3', label: 'Countries: India, UAE and USA' },
      { year: '6', label: 'Cities with WhiteBlue teams' },
      { year: '150+', label: 'People building what’s next' },
    ],
  },
  values: {
    eyebrow: 'Our values',
    titleLead: 'The principles behind',
    titleAccent: 'every decision.',
    lead: 'The principles that guide every decision and drive our commitment to excellence.',
    items: [
      { title: 'Customer centric', tone: 'teal', icon: 'heart', points: ['Every customer is unique.', 'Listen a lot.', 'Earn trust.'] },
      { title: 'Outcome obsessed', tone: 'purple', icon: 'target', points: ['Align to outcomes.', 'Collaborate.', 'Solve.'] },
      { title: 'Walk the talk', tone: 'green', icon: 'shield', points: ['Say no when required.', 'Deliver.', 'Own up.'] },
    ],
  },
  leadership: {
    eyebrow: 'Leadership',
    titleLead: 'Diverse expertise,',
    titleAccent: 'one shared passion.',
    lead: 'Our leaders bring decades of experience across AI, cloud, data and industry, united by a passion for transformative digital experiences.',
    teamTitle: 'Leadership team',
    teamLead: 'Co-founders and the leaders who make every engagement work. Select a profile to read more.',
  },
  leaders: [
    {
      name: 'Jai Ganesh Chellamuthu', role: 'Founder & CEO', founder: true, image: IMG + 'lead-jai.webp',
      bio: [
        'Jai is responsible for market and customer value creation by leveraging people, domain and technology. A passionate business leader, he builds long-term relationships with customers, partners, investors and the community through mutual trust and accountability.',
        'He strongly believes in building a people-centric organization and thrives on enriching people with technology for success.',
      ],
      education: 'Engineering, A.C. Tech (Tamil Nadu) · MBA, XIME Bangalore',
    },
    {
      name: 'Ashok Shunmugavel', role: 'Co-founder & COO', image: IMG + 'lead-ashok.webp',
      bio: [
        'Ashok is responsible for sustainable business growth by enabling people and customer success. A seasoned business leader, he inspires and unleashes human capital, instills corporate values and delivers value for customers.',
        'He practices accountability and walks the talk relentlessly. Across his career he has worked with global corporations, predominantly in financial services, and has built award-winning teams.',
      ],
      education: 'Commerce, St. Xavier’s College · MBA, XIME Bangalore',
    },
    {
      name: 'Srikant S Nair', role: 'Co-founder & CTO', image: IMG + 'lead-srikant.webp',
      bio: [
        'Srikant provides technology direction for the organization in line with its business goals, with extensive experience in technology consulting, enterprise architecture and cloud-native solutions.',
        'A proven global delivery leader for large transformation initiatives, he researches new technology trends, helps internal and customer teams build business-savvy use cases and sets policy on information security and data privacy.',
      ],
    },
    {
      name: 'Pachaimuthu Muthusamy', role: 'Co-founder & CFO', image: IMG + 'lead-pachaimuthu.webp',
      bio: [
        'Pachaimuthu is a passionate businessman with the ability to drive the organization from dream to delight. A serial entrepreneur, his portfolio spans software design for electro-mechanical businesses (General Datum Product Design) to consumer businesses.',
        'A strong advocate of corporate governance with integrity, he is an engineer and a keen learner of cloud infrastructure (Azure and AWS) and artificial intelligence.',
      ],
    },
    {
      name: 'Sakthi Prassad', role: 'Chief Solutions Officer', image: IMG + 'lead-sakthi.webp',
      bio: [
        'Forged in the early days of digital transformation, Sakthi inspires high-performing teams to turn complex challenges into scalable, secure solutions that drive revenue growth and customer success.',
        'Drawing on deep expertise in AI, cognitive computing and process automation, he shapes IT strategy with clear vision and collaboration.',
      ],
      education: 'Engineering, SASTRA University · MBA, XIME Bangalore',
    },
    {
      name: 'Arun Srikanth', role: 'Chief Growth Officer (US) & VP, Sales', image: IMG + 'lead-arun-srikanth.webp',
      bio: [
        'With three decades in IT, Arun has a strong track record of driving strategic growth and building trusted client partnerships across insurance, logistics and supply chain, pharma and life sciences, hospitality and hi-tech, serving Fortune 100 and Fortune 500 clients.',
        'He has led growth initiatives across customer experience, enterprise systems, cloud, information security, data and AI, application development, managed services and business process services.',
      ],
      education: 'B.E., University of Mysore · Executive program in AI and Analytics, Wharton',
    },
    {
      name: 'Dr. Arun Prasad', role: 'Relationship Head, MENA', image: IMG + 'lead-arun-prasad.webp',
      bio: [
        'Dr. Arun has more than two decades of experience in banking, manufacturing, retail, financial services, IT and education across the globe, and has received the “Glory of India Award” and the “Dr. APJ Abdul Kalam Excellence Award” from IIFS.',
        'An RPA expert and data science evangelist, he works across data acquisition, data warehousing, data cleansing and predictive modeling.',
      ],
    },
    {
      name: 'Sowmya', role: 'Director, Customer Success', image: IMG + 'lead-sowmya.webp',
      bio: [
        'Sowmya has played varied roles in corporate and not-for-profit organizations and is passionate about building long-term, impactful relationships with people and customers. She believes trust and respect must be earned.',
        'Her customer-centric principles are to earn trust and treat every customer as unique. She holds an MBA in finance and has an ardent love for farming.',
      ],
    },
    {
      name: 'Kesavan Hariharasubramanian', role: 'Senior Director, Global Service Delivery', image: IMG + 'lead-kesavan.webp',
      bio: [
        'A technology leader with over 25 years in delivery management, specializing in data analytics and AI, Kesavan has led consulting and delivery engagements across industries with a customer-first approach.',
        'He is passionate about mentoring and fostering a growth mindset. He is an alumnus of College of Engineering, Trivandrum and IIT Kharagpur.',
      ],
    },
    {
      name: 'Akash Lakshmanan', role: 'Director, Sales & Marketing', image: IMG + 'lead-akash.webp',
      bio: [
        'Akash leads go-to-market strategy for WhiteBlue’s B2B expansion through account-based selling, market intelligence and a land-and-expand revenue model, with over eight years of experience scaling B2B tech ventures.',
        'Before WhiteBlue he spent three years in revenue operations and program management at Freshworks, with earlier roles at IBM, HSBC and Shell.',
      ],
    },
    {
      name: 'Sugitha Karunakaran', role: 'Senior Manager, People Success', image: IMG + 'lead-sugitha.webp',
      bio: [
        'Sugitha enables people success, helping everyone be their best and do their best at work. She believes “people are our brand” and builds people as brand ambassadors.',
        'She holds an MPhil in English Literature from Bharathidasan University and has published her first novel on Amazon Kindle.',
      ],
    },
  ] as Leader[],
  advisory: {
    eyebrow: 'Advisory board',
    titleLead: 'Guided by',
    titleAccent: 'industry experts.',
    lead: 'Seasoned leaders from logistics, insurance and beyond who help shape how we solve problems in their industries.',
    groups: [
      {
        label: 'Domain',
        advisors: [
          { name: 'M.C. Sureshkumar', role: 'Member, Logistics Advisory Board', image: IMG + 'adv-suresh.webp',
            bio: ['Over three decades in the logistics and port equipment industry. As MD of Cargotec India he steered major growth phases, including integrating Navis India into Cargotec’s portfolio. He also served as Director of Services Sales & Operations (IMEA) for Kalmar and as Chairperson of the Finland Chamber of Commerce in India.'] },
          { name: 'Sankar Raman Rajagopalan', role: 'Member, Logistics Advisory Board', image: IMG + 'adv-sankar.webp',
            bio: ['Over four decades of engineering and managerial expertise in port equipment and container handling, with roles as Port Equipment Consultant at SS Port Consultancy Services, Head of Crane Upgrades at Cargotec India and Regional Head of Engineering at DP World.'] },
          { name: 'Shefali Sonpar', role: 'Member, Insurance Advisory Board', image: IMG + 'adv-shefali.webp',
            bio: ['An award-winning insurance and digital transformation leader with over 20 years across global insurance markets, leading transformations for SwissRe, MetLife, Cardif, RBCI, Allianz, BUPA and Viant, and helping set up the captive tech operations of ING and AIG in India.'],
            highlights: ['Woman Achiever of the Year, Insurtech India 2021', 'Top 100 Global Women in Leadership, GCPIT 2021', 'Power Women Award, Lead India 2021'] },
          { name: 'Sridharan Sundaram', role: 'Member, Insurance Advisory Board', image: IMG + 'adv-sridharan.webp',
            bio: ['Over 25 years of leadership in insurance technology. Vice President at AAA, The Auto Club Group, formerly Executive Director of IT & Enterprise Architecture at Farmers Insurance, driving large-scale digital transformation and application modernization.'] },
        ] as Advisor[],
      },
      {
        label: 'Regional',
        advisors: [
          { name: 'Dr. Waleed', role: 'Regional Advisor, Middle East', image: IMG + 'adv-waleed.webp',
            bio: ['Over 25 years across the private and public sectors in finance, corporate banking, credit and risk management. Former Assistant Deputy Minister for Labor Policies at the Ministry of Human Resources and Social Development.'] },
          { name: 'Dr. Khalfan Khamis Almehairbi', role: 'Regional Advisor, Middle East', image: IMG + 'adv-khalfan.webp',
            bio: ['An engineer with over 18 years in electrical and civil maintenance, facility and infrastructure management. Senior Specialist at Dubai Electricity and Water Authority (DEWA), aligning operations with Dubai’s vision of sustainability and excellence.'] },
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
      { value: '150+', label: 'Team members' },
      { value: '50+', label: 'Projects completed' },
      { value: '5+', label: 'Years of excellence' },
    ],
    image: IMG + 'team-group.webp',
    primary: { label: 'View open positions', href: ABOUT_LINKS.careers },
    secondary: { label: 'See what we do', href: ABOUT_LINKS.services },
  },
};

/* ------------------------------------------------------------------ WhiteBlue framework */

export const FRAMEWORK = {
  hero: {
    titleLead: 'The WhiteBlue',
    titleAccent: 'framework.',
    lead: 'Where AI-driven automation delivers transformational business outcomes. Every 90 days. Every process. Every result.',
    image: IMG + 'framework-hero.webp',
    imageAlt: 'A team planning an automation roadmap together',
    chips: ['AI-powered framework', 'Quarterly impact', 'Use-case solutions'],
    primary: { label: 'Request a callback', href: ABOUT_LINKS.contact },
    secondary: { label: 'Meet our leaders', href: ABOUT_LINKS.purpose + '#leadership' },
  },
  approach: {
    eyebrow: 'Our approach',
    titleLead: 'Beyond digital transformation.',
    titleAccent: 'An AI-first framework.',
    paragraphs: [
      'While others talk digital transformation, WhiteBlue delivers intelligent automation that truly transforms business operations. Using our proven AI-powered framework, we drive measurable outcomes in 90-day cycles.',
      'We don’t offer generic tools or standalone models. We build custom automation strategies that optimize processes, cut costs and accelerate growth.',
      'Every engagement focuses on specific business outcomes through process automation, predictive analytics and AI-enhanced decision making.',
    ],
    cycle: [
      { label: 'Discover', text: 'Map workflows with AI process mining.' },
      { label: 'Align', text: 'Tie every initiative to a KPI.' },
      { label: 'Deliver', text: 'Ship working automation in 90 days.' },
      { label: 'Optimize', text: 'Monitor, retrain and improve.' },
    ],
  },
  method: {
    eyebrow: 'Our method',
    title: 'The WhiteBlue',
    titleAccent: 'AI-automation method.',
    lead: 'Four stages, repeated every 90 days, so every engagement ends in a measurable outcome.',
    centered: true,
    steps: [
      { label: 'Process intelligence discovery', title: 'Process intelligence discovery', tone: 'teal', icon: 'radar',
        intro: 'Find the automation with the highest ROI.',
        points: [
          { text: 'AI-powered process mining maps your existing workflows.' },
          { text: 'Hidden inefficiencies come to the surface.' },
          { text: 'The business impact of automation is quantified up front.' },
        ] },
      { label: 'AI-strategic alignment', title: 'AI-strategic alignment', tone: 'purple', icon: 'chart',
        intro: 'Every initiative targets a measurable outcome.',
        points: [
          { text: 'Cost reduction.' },
          { text: 'Revenue acceleration.' },
          { text: 'Customer satisfaction and operational efficiency gains.' },
        ] },
      { label: 'Intelligent automation delivery', title: 'Intelligent automation delivery', tone: 'green', icon: 'chip',
        intro: 'Business value delivered every 90 days.',
        points: [
          { text: 'Robotic process automation (RPA) for routine work.' },
          { text: 'Machine learning models that predict and prevent issues.' },
          { text: 'Deployed into the systems your teams already use.' },
        ] },
      { label: 'Continuous AI optimization', title: 'Continuous AI optimization', tone: 'rose', icon: 'orbit',
        intro: 'Systems that evolve with your business.',
        points: [
          { text: 'Real-time monitoring of AI performance.' },
          { text: 'Automated model retraining.' },
          { text: 'Continuous process improvement.' },
        ] },
    ],
  } as DeliveryContent,
  stories: {
    eyebrow: 'Success stories',
    titleLead: 'AI automation,',
    titleAccent: 'delivered.',
    lead: 'A glimpse into the impact WhiteBlue has delivered for clients across industries.',
    items: [
      { industry: 'Insurance', title: 'AI-powered claims revolution', client: 'Fortune 500 insurance provider', image: IMG + 'story-insurance.webp',
        stat: { value: '75%', label: 'less manual claims review' },
        q1: ['AI-driven claims processing automation reducing manual review by 75%.', 'Intelligent document extraction and fraud detection.', 'API-led integration connecting legacy systems.'],
        q2: ['Predictive analytics dashboards for risk assessment.', 'Automated customer communication workflows.'],
        cta: 'Unlock insurance efficiency' },
      { industry: 'Maritime', title: 'Smart port operations', client: 'Major South Indian port authority', image: IMG + 'story-maritime.webp',
        q1: ['AI-powered vessel tracking with predictive arrival times.', 'Automated notifications for stakeholders.', 'Machine learning-based berth allocation.'],
        q2: ['Intelligent booking system with dynamic pricing.', 'Automated invoice processing and reconciliation.'],
        cta: 'Transform your logistics ops' },
      { industry: 'Banking', title: 'Intelligent data operations', client: 'Leading regional bank', image: IMG + 'story-banking.webp',
        q1: ['AI-automated data pipeline modernization and cloud migration.', 'Machine learning-powered data quality monitoring.', 'Automated regulatory reporting.'],
        q2: ['Predictive analytics for loan default risk.', 'AI-enhanced customer segmentation and targeting.'],
        cta: 'Unlock smarter finance solutions' },
    ],
  },
  philosophy: {
    eyebrow: 'Our philosophy',
    titleLead: 'Our AI-automation',
    titleAccent: 'philosophy.',
    lead: 'Three beliefs shape every engagement, from the first process map to the last model update.',
    items: [
      { title: 'Intelligence-first approach', icon: 'bulb', points: ['We don’t automate broken processes. We redesign them intelligently.', 'AI finds the best path for improvement before anything is automated.', 'Every deployment is built for efficiency, accuracy and measurable value.'] },
      { title: 'Business outcome obsession', icon: 'trend', points: ['Every model, workflow and system is tied to business KPIs.', 'Cost reduction through intelligent process automation.', 'Revenue growth and risk mitigation through predictive insight.'] },
      { title: 'Transparent AI partnership', icon: 'eye', points: ['Full visibility into AI decisions, model performance and impact.', 'Every agent and model is auditable and explainable, never a black box.', 'Results that are measurable and aligned to your goals.'] },
    ],
  },
  different: {
    eyebrow: 'Why WhiteBlue',
    titleLead: 'What makes our AI automation',
    titleAccent: 'different.',
    items: [
      { title: 'Outcome-driven AI strategy', text: 'We don’t implement AI for technology’s sake. Every solution connects directly to measurable business improvements and ROI.' },
      { title: 'Process-first automation', text: 'Before automating, we optimize. AI-powered process intelligence finds the smartest automation opportunities.' },
      { title: 'Continuous learning systems', text: 'Our solutions don’t just automate. They learn, adapt and keep improving your processes over time.' },
      { title: 'Enterprise-grade AI security', text: 'Built-in compliance, explainable AI decisions and enterprise security keep automated systems to the highest standards.' },
    ],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    titleLead: 'Capabilities that',
    titleAccent: 'drive results.',
    lead: 'The building blocks we combine in every 90-day cycle.',
    items: [
      { title: 'Intelligent process automation (IPA)', points: ['RPA enhanced with AI for complex decision-making.', 'Natural language processing for document automation.', 'Computer vision for visual quality control.'] },
      { title: 'Predictive business analytics', points: ['Machine learning models for demand forecasting.', 'AI-powered risk assessment and mitigation.', 'Predictive maintenance and operational optimization.'] },
      { title: 'Automated decision systems', points: ['Real-time AI recommendations for operations.', 'Automated compliance monitoring and reporting.', 'Intelligent resource allocation and scheduling.'] },
      { title: 'Customer experience automation', points: ['AI chatbots with natural language understanding.', 'Automated personalization engines.', 'Predictive customer service and support.'] },
    ],
  },
  cta: {
    titleLead: 'Ready to automate your',
    titleAccent: 'path to success?',
    lead: 'Stop managing processes that AI can optimize. Get intelligent automation that delivers measurable outcomes every quarter.',
    primary: { label: 'Start your AI transformation', href: ABOUT_LINKS.contact },
    secondary: { label: 'Explore our services', href: ABOUT_LINKS.services },
  },
};

/* ------------------------------------------------------------------ Social initiative */

export const SOCIAL = {
  hero: {
    eyebrow: 'Our social initiative',
    titleLead: 'Opportunity begins when',
    titleAccent: 'someone opens a door.',
    lead: 'At WhiteBlue, we believe progress means more when we give back. Through our association with Sai Sankalp Nursery and Primary School, we’re helping make education more accessible and creating opportunities for children to learn, grow and dream bigger.',
    image: IMG + 'school-child.webp',
    imageAlt: 'A smiling student writing in her notebook in class',
    stat: { value: 65, label: 'students’ tuition supported by WhiteBlue' },
  },
  community: {
    eyebrow: 'The community we support',
    titleLead: 'Every child deserves',
    titleAccent: 'a chance to thrive.',
    text: 'Sai Sankalp Nursery and Primary School provides free education to children from underserved communities in and around Arasankazhani and Semmenchery, Chennai. Its work makes foundational education more accessible, giving children the chance to build knowledge, confidence and a brighter future.',
    image: IMG + 'school-gate.webp',
    imageAlt: 'The entrance gate of Sai Sankalp Nursery and Primary School',
    place: 'Arasankazhani & Semmenchery, Chennai',
  },
  contribute: {
    eyebrow: 'How we contribute',
    titleLead: 'Showing up,',
    titleAccent: 'in more ways than one.',
    items: [
      { title: 'Making education accessible', text: 'WhiteBlue supports tuition costs for about 30% of Sai Sankalp’s students, helping reduce financial barriers to learning.', stat: '30%', statLabel: 'of students supported', tone: 'blue', icon: 'book' },
      { title: 'Sharing our time', text: 'Our employees volunteer at the school, teaching, sharing knowledge and encouraging curiosity through meaningful interactions.', stat: '1:1', statLabel: 'time with the children', tone: 'yellow', icon: 'hands' },
    ],
  },
  journey: {
    eyebrow: 'A shared journey',
    titleLead: 'Learning goes',
    titleAccent: 'both ways.',
    text: 'We believe giving back is about more than what we contribute. It’s about showing up, sharing experiences and learning from one another. Through our time with the children, we hope to nurture curiosity, inspire confidence and build meaningful connections.',
    image: IMG + 'school-team.webp',
    imageAlt: 'WhiteBlue team members with teachers at Sai Sankalp School',
    words: ['Curiosity', 'Confidence', 'Connection'],
  },
  cta: {
    titleLead: 'More opportunities.',
    titleAccent: 'Brighter tomorrows.',
    lead: 'We believe in giving back. If you’d like to support Sai Sankalp School or volunteer with us, we’d love to hear from you.',
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
    lead: 'We operate across India, the UAE and the USA, bringing AI, cloud and data expertise to businesses in every market we serve.',
    stats: [
      { value: '3', label: 'Countries' },
      { value: '6', label: 'Cities' },
      { value: '150+', label: 'People' },
    ],
  },
  regions: [
    { id: 'india', name: 'India', flag: '🇮🇳', cities: 'Chennai · Bangalore · Hyderabad', tagline: 'Headquarters and global delivery', image: IMG + 'team-group.webp', imageAlt: 'The WhiteBlue team in India' },
    { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', cities: 'Dubai', tagline: 'AI partner in the city of the future', image: IMG + 'uae-museum.webp', imageAlt: 'The Museum of the Future in Dubai' },
    { id: 'usa', name: 'United States', flag: '🇺🇸', cities: 'California · Austin', tagline: 'Innovating, disrupting and transforming industries', image: IMG + 'usa-hero.webp', imageAlt: 'The Golden Gate Bridge in San Francisco' },
  ] as Region[],
  india: {
    titleLead: 'Where it',
    titleAccent: 'all began.',
    text: 'WhiteBlue was founded in Chennai in 2020. Our teams in Chennai, Bangalore and Hyderabad lead global delivery across AI, cloud, data and automation, and build our products: InsureLiv, Dobby, QuickQode and FieldZapp.',
    points: ['Global delivery centers for every engagement.', 'Home of our product engineering teams.', 'ISO 27001 certified security practices.'],
  },
  uae: {
    titleLead: 'Revolutionizing businesses in',
    titleAccent: 'the city of the future.',
    intro: [
      'Dubai is not just a city. It’s a global hub of innovation, pushing boundaries with initiatives like the world’s first Ministry of Artificial Intelligence.',
      'This visionary approach puts Dubai at the forefront of the AI revolution, and WhiteBlue is proud to partner with businesses here, delivering tailored solutions with measurable ROI and tangible business impact.',
    ],
    footprintTitle: 'Our Middle Eastern footprint',
    footprint: [
      { title: 'Insurance', text: 'Enhancing financial strategies with AI-driven finance consulting and endorsements.' },
      { title: 'Port operations', text: 'Streamlining efficiency with real-time finance dashboards for precise decisions.' },
      { title: 'Sustainability', text: 'Using AI and predictive analytics to boost lead conversion and customer experience.' },
      { title: 'SMEs', text: 'Empowering growth with tailored digital solutions for unique business needs.' },
    ],
    solutionsTitle: 'Empowering businesses with AI and cloud solutions',
    solutions: [
      'Generative AI for impactful decision-making.',
      'Robotic process automation (RPA) for operational efficiency.',
      'End-to-end data architecture built for agility and insight.',
      'Digital transformation aligned with each client’s needs.',
      'AI-powered agents acting as specialized copilots across divisions.',
    ],
    gallery: [
      { image: IMG + 'uae-burj.webp', alt: 'Burj Al Arab on the Dubai coastline' },
      { image: IMG + 'uae-frame.webp', alt: 'The Dubai Frame' },
      { image: IMG + 'uae-ai.webp', alt: 'A humanoid robot shaking hands with an Emirati businessman' },
    ],
    advisorsTitle: 'Regional advisors, Middle East',
    closing: 'As the world prepares for Industry 5.0, with seamless collaboration between people and machines, Dubai is leading the charge, and we help businesses here embrace rapid transformation through AI-driven strategy, automation and cloud.',
  },
  usa: {
    titleLead: 'Innovating, disrupting and',
    titleAccent: 'transforming industries.',
    intro: 'At WhiteBlue, we’re not just another IT solutions provider. We’re here to challenge the norm and build the unique. Our expansion into the United States reflects our commitment to cutting-edge AI, cloud and data solutions for forward-thinking businesses.',
    pillars: [
      { title: 'Industry expertise', image: IMG + 'usa-1.webp', points: ['Experts in banking and financial services, insurance, supply chain (ports and logistics) and hi-tech.', 'Proven delivery for credit unions, ports and semiconductor customers.', 'Digital, data and AI transformation that lasts.'] },
      { title: 'Customer-centric innovation', image: IMG + 'usa-2.webp', points: ['Business-first technology with clear ROI.', 'Digital channels and automation that cut cycle times.', 'AI-driven insights for smarter decisions.'] },
      { title: 'Commitment to customer success', image: IMG + 'usa-3.webp', points: ['Business needs first, not just technology.', 'Partnerships that build scalable, future-ready ecosystems.', 'Solutions tailored for innovation and growth.'] },
      { title: 'Future-ready tech', image: IMG + 'usa-4.webp', points: ['AI, automation and cloud that future-proof the business.', 'Scalable architectures for long-term success.', 'Predictive analytics for data-driven decisions.'] },
    ],
  },
  cta: {
    titleLead: 'Take the next step toward your',
    titleAccent: 'AI-first enterprise.',
    lead: 'Wherever you are, our teams in India, the UAE and the USA are ready to help.',
    primary: { label: 'Request a call', href: ABOUT_LINKS.contact },
    secondary: { label: 'Explore our services', href: ABOUT_LINKS.services },
  },
};
