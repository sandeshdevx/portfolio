export type ProjectLinkKind = 'github' | 'demo';

export interface ProjectLink {
  kind: ProjectLinkKind;
  label: string;
  url: string;
}

export interface ProjectImage {
  src: string;
  mobileSrc?: string;
  alt: string;
  mobileAlt?: string;
  caption: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  image?: ProjectImage;
  evidenceNote?: string;
  boundary?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export type JourneyType = 'Education' | 'Certification';

export interface JourneyEntry {
  type: JourneyType;
  period: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface SocialLink {
  label: string;
  display: string;
  href: string;
  platform: 'github' | 'linkedin';
}

/**
 * PUBLIC CONTENT EDITING POINT
 * ----------------------------
 * Update the contact block below as links become available.
 * Empty values are intentionally hidden across the public website.
 */
const contact = {
  email: '',
  github: 'https://github.com/sandeshdevx',
  githubLabel: 'sandeshdevx',
  linkedin: 'https://www.linkedin.com/in/medichelma-sandesh-02628133a/',
  resume: '',
};

const identity = {
  name: 'Sandesh',
  monogram: 'S',
  role: 'Computer Science Student / Developer',
  discipline: 'Computer Science & Engineering',
  college: 'New Horizon College of Engineering',
  intro:
    'I build full-stack applications and applied-AI tools, focusing on clear interfaces, reliable systems and practical engineering.',
  heroStatement: {
    lead: 'I build',
    accent: 'full-stack web software',
    tail: 'and applied-AI tools with clarity, privacy and real use in mind.',
  },
  availability: 'Open to internship and early-career opportunities.',
  interests: [
    'Full-stack web development',
    'Applied AI & retrieval',
    'Privacy-first systems',
    'Accessible interfaces',
  ],
  about: [
    "I'm a computer science student interested in building practical software at the intersection of software engineering and applied AI. I enjoy developing full-stack applications, experimenting with language models, and turning ideas into functional products.",
    'Most of my work sits in full-stack web development and applied AI. I have built projects with Java, Python and JavaScript, worked with Flask, SQLite and MySQL, and explored local language models, retrieval and LangChain. I am most interested in tools that make complex information easier to use.',
    "I am still early in my career, so I would rather let the work speak than overstate it. I care about privacy, accessibility, careful implementation and software that is honest about what it does.",
  ],
  approach: [
    {
      title: 'Start with the real problem',
      body: 'I try to understand who the system serves and what it actually needs before choosing a stack or an interface.',
    },
    {
      title: 'Make privacy structural',
      body: 'When a project handles sensitive information, the architecture should carry that responsibility, not just the policy copy.',
    },
    {
      title: 'Leave things legible',
      body: 'Clear structure, readable code and honest interfaces are part of the product, especially when someone else has to maintain them.',
    },
  ],
};

const projects: Project[] = [
  {
    id: 'zenith',
    name: 'Zenith',
    tagline: 'Anonymous support, with a route to a human.',
    category: 'Applied AI / Mental health support',
    summary:
      'A privacy-first student wellness platform that combines streamed AI conversations, implicit screening and a counsellor handoff without requiring an account.',
    problem:
      'Students often need support at the moment they need it most, but many digital tools ask them to create an account and leave a permanent record first. The product needed to feel immediate and private while still keeping a clear path to a real person.',
    approach:
      'Zenith uses anonymous, short-lived sessions and local model inference for conversation and screening signals. A separate risk layer can escalate to a counsellor dashboard and a Jitsi handoff, while session data is designed to expire shortly after use.',
    outcome:
      'Implemented as a typed monorepo spanning a React PWA, Fastify API, background worker, counsellor dashboard and Python inference service. Shared contracts keep the realtime and REST paths aligned.',
    highlights: [
      'Anonymous sessions with automatic expiry',
      'Streamed multilingual conversation',
      'Implicit PHQ-9 and GAD-7 screening signals',
      'Risk-aware counsellor handoff',
      'Local model inference with Ollama',
      'Crisis and helpline fallbacks',
    ],
    stack: ['React', 'TypeScript', 'Fastify', 'PostgreSQL', 'Ollama', 'Llama 3.2'],
    links: [
      {
        kind: 'github',
        label: 'GitHub repository',
        url: 'https://github.com/sandeshdevx/zenith',
      },
    ],
    image: {
      src: '/work/zenith-interface.webp',
      mobileSrc: '/work/zenith-mobile.webp',
      alt: 'Zenith landing page in light mode, showing its support message, conversation button and three privacy and care feature panels.',
      mobileAlt: 'Zenith landing page on a narrow mobile screen, with the support message and a talk-to-someone action.',
      caption: 'Actual interface, captured from the local build.',
    },
    boundary:
      'Zenith is a support tool, not a diagnostic tool. It does not provide medical diagnoses or replace a qualified professional.',
  },
  {
    id: 'smart-health-tracker',
    name: 'Smart Health Tracker',
    tagline: 'Personal health records, made legible.',
    category: 'Full-stack web / Personal data',
    summary:
      'A web-based health tracking application that enables users to record information, monitor trends and see their health-related data as clear visual evidence.',
    problem:
      'Personal health records are often scattered across notes and disconnected tools. A useful tracker needs to make routine logging quick and turn accumulated entries into a readable picture.',
    approach:
      'Built with Flask and SQLite, the application connects authenticated records with a dashboard layer that turns health logs into charts and portable exports for the people who need them.',
    outcome:
      'Delivered a private full-stack application covering authenticated access, routine logging, dashboard charts, and CSV and PDF export.',
    highlights: [
      'User authentication',
      'Health record logging',
      'Analytics dashboard',
      'Chart-based visualisations',
      'CSV and PDF exports',
    ],
    stack: ['Python', 'Flask', 'SQLite', 'Chart.js'],
    links: [],
    evidenceNote:
      'No public repository or interface capture is available for this project. The presentation uses only the documented product scope.',
  },
  {
    id: 'curionest',
    name: 'CampusPool',
    tagline: 'Smart Campus Carpooling Platform',
    category: 'Full-stack web / Student life',
    summary:
      'A collaborative full-stack campus carpooling platform developed by a team of four engineers. I primarily contributed frontend engineering for eight screens and 15+ REST API integrations.',
    problem:
      'Students often need reliable transportation between classes, activities, and off-campus locations, but existing options are fragmented, inflexible, and lack real-time coordination.',
    approach:
      'Developed eight frontend screens including ride search, offer-a-ride, inbox, carbon wallet and subscription pools. Integrated 15 REST endpoints through a typed API client for rides, messaging, carbon wallet, trust score and pools. Implemented JWT authentication and protected routes. Added form validation using React Hook Form and Zod. Implemented an always-visible SOS emergency button. The project team won VibeThon 2026.',
    outcome:
      'Delivered a responsive React application with ride-matching functionality, messaging, carbon tracking, and subscription management. Individual contribution: all frontend screens, API client, authentication, form validation, and the SOS emergency button. Team achievement: VibeThon 2026 winner.',
    highlights: [
      'Eight frontend screens implemented',
      '15+ REST API integrations',
      'JWT authentication and protected routes',
      'React Hook Form with Zod validation',
      'Always-visible SOS emergency button',
      'VibeThon 2026 winner',
    ],
    stack: ['Next.js 14 (App Router)', 'TypeScript', 'Tailwind CSS', 'React Hook Form', 'Zod', 'JWT', 'Spring Boot', 'MySQL'],
    links: [
      {
        kind: 'github',
        label: 'GitHub repository',
        url: 'https://github.com/sandeshdevx/ecoride',
      },
    ],

    boundary:
      'This was a team project. My individual contribution is highlighted above. The project won VibeThon 2026.',
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: 'Core Programming',
    items: ['Java', 'Python', 'JavaScript'],
  },
  {
    title: 'Backend & APIs',
    items: ['Node.js', 'Express.js', 'Flask', 'REST APIs'],
  },
  {
    title: 'Frontend Engineering',
    items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    title: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'AI / Generative AI',
    items: ['LLM fundamentals', 'RAG concepts', 'Embeddings', 'Ollama'],
  },
  {
    title: 'Engineering Fundamentals & Tools',
    items: ['OOP', 'Data Structures & Algorithms', 'Authentication', 'Git and GitHub', 'Postman', 'Visual Studio Code'],
  },
];

const socialLinks: SocialLink[] = [
  contact.github
    ? {
      label: 'GitHub',
      display: contact.githubLabel || 'GitHub',
      href: contact.github,
      platform: 'github',
    }
    : null,
  contact.linkedin
    ? {
      label: 'LinkedIn',
      display: 'LinkedIn',
      href: contact.linkedin,
      platform: 'linkedin',
    }
    : null,
].filter((link): link is SocialLink => link !== null);

const journey: JourneyEntry[] = [
  {
    type: 'Education',
    period: 'Present',
    title: 'B.E. Computer Science and Engineering',
    subtitle: identity.college,
    description:
      'Coursework across software engineering, databases, web systems and applied computing, alongside self-directed work on complete products.',
  },
  {
    type: 'Certification',
    period: '2025',
    title: 'OCI 2025 Certified Generative AI Professional',
    subtitle: 'Oracle Cloud Infrastructure',
    description:
      'A professional certification focused on generative AI foundations and applied practice.',
  },
  {
    type: 'Certification',
    period: '2025',
    title: 'OCI 2025 Certified Foundations Associate',
    subtitle: 'Oracle Cloud Infrastructure',
    description:
      'A foundational certification covering core cloud computing concepts.',
  },
];

export const portfolio = {
  identity,
  contact,
  socialLinks,
  projects,
  skillGroups,
  journey,
  education: {
    degree: 'B.E. Computer Science and Engineering',
    institution: identity.college,
  },
certifications: [
    {
      name: 'OCI 2025 Certified Generative AI Professional',
      issuer: 'Oracle Cloud Infrastructure',
      verificationUrl:
        'https://catalog-education.oracle.com/ords/certview/sharebadge?id=C4E31D235692CE14A94D28AF9F5AE10263DA0BBB281885BE0FF89290DEEA1C12',
    },
    {
      name: 'OCI 2025 Certified Foundations Associate',
      issuer: 'Oracle Cloud Infrastructure',
      verificationUrl:
        'https://catalog-education.oracle.com/ords/certview/sharebadge?id=D66EEEDA273DAB3304370F57E5D6CF2BDC73C62855BEB0B7FC6BAA93A82BF381',
    },
    {
      name: 'Cloud Computing',
      issuer: 'NPTEL',
      verificationUrl:
        'https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS107S25260099110658142',
    },
  ],
achievements: [
    {
      name: 'Winner — VibeThon 2026',
      issuer: 'IEEE Computer Society, NHCE Student Branch',
      year: 2026,
      verificationUrl:
        'https://credsverse.com/credentials/fb6da3a4-b5e9-4d56-b82c-f838b101accb?preview=1',
    },
  ],

  seo: {
    siteName: 'Sandesh — Developer Portfolio',
    title: 'Sandesh — Computer Science Student & Developer',
    description:
      'Portfolio of Sandesh, a Computer Science student building full-stack web applications and applied-AI tools. Explore selected projects, technical skills and education.',
    locale: 'en_IN',
    themeColor: '#0a0b09',
    ogImage: '/og.png',
  },
  navigation: [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'Projects', href: '/#projects', id: 'projects' },
    { label: 'Technical Expertise', href: '/#skills', id: 'skills' },
    { label: 'Certifications & Recognition', href: '/#journey', id: 'journey' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ],
};

export const hasEmail = contact.email.trim().length > 0;
export const hasLinkedIn = contact.linkedin.trim().length > 0;
export const hasResume = contact.resume.trim().length > 0;
export const hasSocialLinks = socialLinks.length > 0;

export const mailtoHref = hasEmail
  ? `mailto:${contact.email}?subject=${encodeURIComponent('A conversation about your work')}`
  : '';

export const resumeHref = hasResume ? contact.resume : '';

export const getYear = () => new Date().getFullYear();
