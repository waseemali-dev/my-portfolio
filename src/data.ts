export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
}

export interface Skill {
  name: string;
  category: "Languages & Core" | "CMS & Frameworks" | "Design & Testing" | "SEO & Devops";
  proficiency: number; // 1-100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: "HubSpot CMS" | "Front-End" | "WordPress";
  liveUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarUrl: string;
  platform?: string;
  platformIconUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const SERVICES: Service[] = [
  {
    id: "hubspot-cms",
    title: "HubSpot CMS Development",
    description: "High-converting custom HubSpot websites, fully editable templates, and reusable drag-and-drop systems.",
    features: [],
    iconName: "HubSpot"
  },
  {
    id: "frontend",
    title: "Front-End Development",
    description: "Translating pixel-perfect Figma designs into responsive, highly-interactive, and maintainable frontend code.",
    features: [],
    iconName: "Code"
  },
  {
    id: "wordpress",
    title: "WordPress Development",
    description: "Lightweight, speed-optimized WordPress themes and flexible Gutenberg/ACF custom block environments.",
    features: [],
    iconName: "Wordpress"
  },
  {
    id: "email-template",
    title: "Email Templates",
    description: "Responsive HTML email templates tested and verified to render flawlessly across all major email clients.",
    features: [],
    iconName: "Mail"
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "Streamlining CRM marketing workflows, smart automation triggers, lead routing, and platform integrations.",
    features: [],
    iconName: "RefreshCw"
  },
  {
    id: "performance-optimization",
    title: "Performance & SEO Optimization",
    description: "Tuning Core Web Vitals, minifying assets, and optimizing layouts to guarantee 99+ Lighthouse performance scores.",
    features: [],
    iconName: "Zap"
  }
];

export const SKILLS: Skill[] = [
  // Languages & Core
  { name: "JavaScript", category: "Languages & Core", proficiency: 94 },
  { name: "TypeScript", category: "Languages & Core", proficiency: 92 },
  { name: "HTML5", category: "Languages & Core", proficiency: 98 },
  { name: "CSS3 / SCSS", category: "Languages & Core", proficiency: 96 },
  { name: "React", category: "Languages & Core", proficiency: 90 },
  { name: "Next.js", category: "Languages & Core", proficiency: 88 },
  
  // CMS & Frameworks
  { name: "HubSpot CMS", category: "CMS & Frameworks", proficiency: 98 },
  { name: "HubL", category: "CMS & Frameworks", proficiency: 98 },
  { name: "WordPress", category: "CMS & Frameworks", proficiency: 92 },
  { name: "Tailwind CSS", category: "CMS & Frameworks", proficiency: 96 },
  { name: "Swiper.js", category: "CMS & Frameworks", proficiency: 90 },
  { name: "GSAP", category: "CMS & Frameworks", proficiency: 85 },
  
  // Design & Testing
  { name: "Email Templates", category: "Design & Testing", proficiency: 95 },
  { name: "Responsive Design", category: "Design & Testing", proficiency: 98 },
  { name: "Web Accessibility", category: "Design & Testing", proficiency: 92 },
  { name: "Lighthouse Optimization", category: "Design & Testing", proficiency: 96 },
  
  // SEO & Devops
  { name: "Marketing Automation", category: "SEO & Devops", proficiency: 90 },
  { name: "Workflow Automation", category: "SEO & Devops", proficiency: 92 },
  { name: "AI Integration", category: "SEO & Devops", proficiency: 88 },
  { name: "Prompt Engineering", category: "SEO & Devops", proficiency: 90 },
  { name: "API Integration", category: "SEO & Devops", proficiency: 86 },
  { name: "Git", category: "SEO & Devops", proficiency: 90 }
];

export const PROJECTS: Project[] = [
  {
    id: "boston-institute-finance",
    title: "Boston Institute Of Finance",
    description: "Complete template pack, interactive learning selectors, and custom HubDB data directories.",
    technologies: ["HubSpot CMS", "HubDB", "HubL", "SEO Optimization"],
    category: "HubSpot CMS",
    liveUrl: "https://www.bostonifi.com"
  },
  {
    id: "remote-technology",
    title: "Remote Technology",
    description: "Front-end refactoring and website translation management system integration with HubSpot workflow automation.",
    technologies: ["HubSpot CMS", "HTML5/CSS3", "JavaScript", "Bootstrap"],
    category: "HubSpot CMS",
    liveUrl: "https://remote.com"
  },
  {
    id: "centersquare",
    title: "Center Square",
    description: "High-converting HubSpot landing pages with interactive server calculators and custom CMS modules.",
    technologies: ["HubSpot CMS", "HubL", "Figma to Code", "jQuery"],
    category: "HubSpot CMS",
    liveUrl: "https://www.csquare.com"
  },
  {
    id: "cypher-learning",
    title: "Cypher Learning",
    description: "Re-engineered a high-performance HubSpot CMS website with dynamic components and reusable HubL templates.",
    technologies: ["HubSpot CMS", "HubL", "JavaScript", "SCSS"],
    category: "HubSpot CMS",
    liveUrl: "https://www.cypherlearning.com"
  },
  {
    id: "nextiny-marketing",
    title: "Nextiny Marketing",
    description: "High-performance WordPress theme enhancements and custom HubSpot HubDB lead generators.",
    technologies: ["WordPress", "ACF", "HubSpot CMS", "Lighthouse Tools"],
    category: "HubSpot CMS",
    liveUrl: "https://www.nextinymarketing.com"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "computan",
    role: "HubSpot CMS Developer",
    company: "Computan",
    location: "Lahore, Pakistan (Hybrid)",
    period: "Jun 2021 to Present",
    description: [
      "Architect and code premium, high-performance HubSpot CMS themes, templates, and reusable drag-and-drop modules.",
      "Develop complex dynamic systems using HubL, HubDB databases, and HubSpot CRM integrations.",
      "Optimize website speed, Core Web Vitals, and technical SEO structure to elevate client performance scores."
    ]
  },
  {
    id: "immentia",
    role: "Front-End Developer",
    company: "Immentia",
    location: "Islamabad, Pakistan (Onsite)",
    period: "Jun 2018 to May 2021",
    description: [
      "Engineered fluid, mobile-first responsive landing pages, corporate websites, and admin dashboards.",
      "Utilized HTML5, CSS3, ES6 JavaScript, jQuery, SCSS, and Tailwind CSS to craft semantic interfaces.",
      "Collaborated with creative designers to translate high-fidelity Figma files into responsive layouts."
    ]
  },
  {
    id: "increate",
    role: "WordPress Developer",
    company: "inCreate Technologies",
    location: "Islamabad, Pakistan (Onsite)",
    period: "Jun 2017 to May 2018",
    description: [
      "Developed custom WordPress themes from scratch using PHP, HTML5, and SCSS.",
      "Created easy-to-manage client backends utilizing Advanced Custom Fields (ACF) and Gutenberg blocks.",
      "Integrated and optimized custom WooCommerce setups for various e-commerce storefronts."
    ]
  }
];

export const EDUCATION: Education = {
  degree: "Bachelor of Science in Computer Science (BSCS)",
  institution: "Federal Urdu University of Arts, Science & Technology",
  period: "Sep 2011 to Sep 2015",
  details: ""
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Gabriel Marguglio",
    role: "CEO",
    company: "Nextiny Marketing",
    text: "Waseem is a world-class developer who understands both code and marketing requirements. His HubSpot CMS modules are exceptionally clean, easy for our team to customize, and load lightning fast. He has been incredibly reliable with delivery and communication.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t2",
    name: "Sarah Jenkins",
    role: "Director of Digital Operations",
    company: "Computan Agency Client",
    text: "We hired Waseem to convert our complex Figma website designs into a HubSpot custom theme. The results were flawless. Every single layout is pixel-perfect, responsive on every device, and our PageSpeed score jumped from 45 to 94. His expertise in HubL is unmatched.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Upwork",
    platformIconUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upwork-icon.png"
  },
  {
    id: "t3",
    name: "Matthew O'Connor",
    role: "Lead Strategist",
    company: "Boston Institute of Finance Partner",
    text: "Working with Waseem has been a game-changer for our web team. He built a complex course directory using HubSpot's HubDB that saved us hundreds of hours. His communication is proactive, he explains technical items simply, and he always meets deadlines.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t4",
    name: "Amara Okoye",
    role: "Founder",
    company: "SaaS Tech Startup",
    text: "Waseem solved a series of complex responsive bugs and speed problems that multiple other freelancers couldn't fix. He rearranged our CSS structure, clean-coded our WordPress ACF blocks, and delivered on time. Outstanding developer!",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Upwork",
    platformIconUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upwork-icon.png"
  },
  {
    id: "t5",
    name: "Jonathan Wright",
    role: "Marketing Director",
    company: "Inbound Solutions",
    text: "Waseem is exceptionally professional and punctual. He restructured our campaign landing pages, optimized HubSpot forms, and significantly reduced script payload. Our leads spiked directly post-launch.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t6",
    name: "Elena Rostova",
    role: "Creative Partner",
    company: "Studio 11 Design",
    text: "Having collaborated with many frontend developers, Waseem stands out for his pixel-perfect accuracy. He respects visual grids, translates Figma transitions gracefully, and is very transparent about schedules.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  }
];

export const FAQS: FAQ[] = [
  {
    question: "What type of websites do you build?",
    answer: "I specialize in high-performance, responsive marketing websites, landing pages, corporate portals, e-commerce stores, and blog platforms. My primary focus is on translating custom designs (Figma, Adobe XD) into lightweight, responsive, and SEO-optimized web experiences."
  },
  {
    question: "Do you work with HubSpot CMS?",
    answer: "Yes, I am a certified HubSpot CMS Expert. I build custom themes, flexible drag-and-drop templates, custom HubL modules, searchable HubDB databases, personalized dynamic content blocks, and fully custom HubSpot landing pages and email templates."
  },
  {
    question: "Can you improve website speed?",
    answer: "Yes. I offer deep performance optimization services. I audit websites using tools like Google PageSpeed Insights, Lighthouse, and GTmetrix, then fix issues by minifying assets, lazy-loading media, removing redundant scripts, implementing caching, and structuring layouts to eliminate Cumulative Layout Shift (CLS)."
  },
  {
    question: "Do you work with WordPress?",
    answer: "Yes. I develop highly customized, responsive WordPress websites. I build lightweight themes, custom blocks powered by Advanced Custom Fields (ACF), and optimize WooCommerce setups, avoiding heavy visual page builders that bloat page speed."
  },
  {
    question: "Are you available for freelance projects?",
    answer: "Yes, I am actively open for freelance and contract opportunities. I partner with design agencies, marketing firms, startups, and established enterprises on platforms like LinkedIn, Upwork, and Fiverr, as well as direct client relationships."
  }
];
