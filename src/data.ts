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
  description?: string;
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
  
  // CMS & Frameworks
  { name: "HubSpot CMS", category: "CMS & Frameworks", proficiency: 98 },
  { name: "HubL", category: "CMS & Frameworks", proficiency: 98 },
  { name: "WordPress", category: "CMS & Frameworks", proficiency: 92 },
  { name: "Tailwind CSS", category: "CMS & Frameworks", proficiency: 96 },
  
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
  },
  {
    id: "inboundlabs-redesign",
    title: "InboundLabs Agency Portal",
    description: "Custom-coded high-converting HubSpot theme with reusable drag-and-drop modules, CRM triggers, and smart form builders.",
    technologies: ["HubSpot CMS", "HubL", "CRM Integrations", "JavaScript"],
    category: "HubSpot CMS",
    liveUrl: "https://www.inboundlabs.co"
  },
  {
    id: "aptitude-learning-hub",
    title: "Aptitude LMS Portal",
    description: "Interactive learning directory built with HubDB and HubL queries, featuring dynamic filter parameters and multi-language template systems.",
    technologies: ["HubSpot CMS", "HubDB", "HubL", "Multi-Language"],
    category: "HubSpot CMS",
    liveUrl: "https://www.aptitude.com"
  },
  {
    id: "techstars-hubspot",
    title: "Techstars Resource Center",
    description: "A content hub built completely on HubSpot, fully responsive with custom filtering and optimized Core Web Vitals (95+ score).",
    technologies: ["HubSpot CMS", "HubL", "Performance Optimization", "SCSS"],
    category: "HubSpot CMS",
    liveUrl: "https://www.techstars.com"
  },
  {
    id: "elite-digital-wp",
    title: "Elite Digital Corporate Website",
    description: "Lightweight and speed-optimized WordPress theme using Advanced Custom Fields (ACF) custom blocks, structured SEO, and custom post types.",
    technologies: ["WordPress", "ACF Blocks", "PHP", "SEO Optimization"],
    category: "WordPress",
    liveUrl: "https://www.elitedigital.com"
  },
  {
    id: "fintech-global",
    title: "FinTech Global Front-End",
    description: "Responsive, semantic corporate web space built with pixel-perfect Figma-to-code workflow, smooth animations, and optimized asset delivery.",
    technologies: ["Front-End", "HTML5/CSS3", "JavaScript", "Figma to Code"],
    category: "Front-End",
    liveUrl: "https://www.fintechglobal.com"
  },
  {
    id: "saas-landing-platform",
    title: "CloudSaaS Product Landing",
    description: "High-conversion marketing campaign landing pages, dynamic split testing modules, and custom HubSpot form styles.",
    technologies: ["HubSpot CMS", "HubL", "React", "Conversion Optimization"],
    category: "HubSpot CMS",
    liveUrl: "https://www.cloudsaas.io"
  },
  {
    id: "realestate-directory-wp",
    title: "Prime Homes Real Estate Portal",
    description: "Custom WordPress site featuring interactive property filters, custom taxonomy maps, and fast listing load times.",
    technologies: ["WordPress", "Bootstrap", "jQuery", "PHP"],
    category: "WordPress",
    liveUrl: "https://www.primehomes.com"
  },
  {
    id: "ecommerce-growth-kit",
    title: "Shopify to HubSpot Bridge",
    description: "Front-end UI for a web application bridging Shopify checkout Webhooks with HubSpot CRM lead capturing pipelines.",
    technologies: ["Front-End", "TypeScript", "Tailwind CSS", "API Integration"],
    category: "Front-End",
    liveUrl: "https://www.ecommercebridge.com"
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
      "Developed and customized responsive HubSpot CMS websites, landing pages, blogs, email templates, workflows, AI solutions and dynamic modules using HubL, HUBDB HTML, CSS, and JavaScript.",
      "Improved website performance, accessibility, SEO structure, loading speed, and cross-browser compatibility in collaboration with cross-functional teams."
    ]
  },
  {
    id: "immentia",
    role: "Front-End Developer",
    company: "Immentia",
    location: "Islamabad, Pakistan (Onsite)",
    period: "Jun 2018 to May 2021",
    description: [
      "Designed and developed responsive web layouts and HTML templates using HTML5, CSS3, Bootstrap, JavaScript, and jQuery, including PSD-to-HTML conversion.",
"Customized WordPress themes and landing pages based on client requirements while ensuring W3C standards, responsiveness, and cross-browser compatibility."
    ]
  },
  {
    id: "increate",
    role: "WordPress Developer",
    company: "inCreate Technologies",
    location: "Islamabad, Pakistan (Onsite)",
    period: "Jun 2017 to May 2018",
    description: [
     "Developed and maintained responsive, SEO-friendly WordPress websites focused on clean design, usability, and performance.",
" Customized WordPress themes and integrated plugins to improve website functionality and meet client requirements."
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
    name: "Dan",
    text: "Waseem did a fantastic job with the file he produced, and we are now working with him to complete additional website updates. I highly recommend him for your web development needs.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t2",
    name: "Toddtall",
    text: "Amazing availability. He continued communicating, sometimes even at 2–4 AM his time!",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t3",
    name: "Rosita",
    text: "Again, he was my hero! He delivered so quickly. I had a problem with my website, and like a magician, he fixed it again. Thanks, Waseem!",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t4",
    name: "Testing Simple",
    text: "I have worked with Waseem quite a few times in the past, and he is an amazing developer who knows WordPress really well. He is cooperative and always ready to assist very quickly. Highly recommended.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t5",
    name: "Pfundheller",
    text: "So awesome! I have him do all my website pages. He does an amazing job!",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t6",
    name: "piripiri001",
    text: "Waseem has incredible skills and talent when it comes to coding, WordPress websites, and customizations. He is a maestro! He is very kind, humble, and confident. I love working with him.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t7",
    name: "Mahmood Rastgar",
    text: "I had a wonderful experience working with Waseem. If anybody is looking for a WordPress expert, I think he is among the best freelancers I have come across.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t8",
    name: "Jai George",
    text: "Waseem is the best! He is not only fast but also understands exactly what I need. He delivers work beyond my expectations in a timely manner. I will use him again and recommend him for website design.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t9",
    name: "moe_550",
    text: "Amazing website designer! Went beyond the project details and delivered an outstanding website. Thank you so much!",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t10",
    name: "Micky Morrison",
    text: "Always a pleasure to work with Waseem. Great work ethic and attention to detail.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
    platform: "Fiverr",
    platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
  },
  {
    id: "t11",
    name: "Taylor",
    text: "This seller is amazing! I have ordered multiple times, and he always makes sure I get everything I need and more. Excellent service.",
    rating: 5,
    avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s",
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
