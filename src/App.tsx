import { useState, useEffect, FormEvent } from "react";
import {
  Code,
  Layers,
  RefreshCw,
  Globe,
  Mail,
  Smartphone,
  Zap,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  DollarSign,
  Check,
  Sun,
  Moon,
  Linkedin,
  BookOpen,
  MessageSquare,
  Timer,
  CheckSquare,
  Sparkles,
  Database,
  Send,
  ArrowUpRight
} from "lucide-react";

import {
  SERVICES,
  SKILLS,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  TESTIMONIALS,
  FAQS,
  Project,
  Service
} from "./data";

import { FiverrLogo } from "./components/FiverrLogo";
import { UpworkLogo } from "./components/UpworkLogo";

// Admin workspace components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { getPortfolioContent } from "./utils/contentStorage";
import { isAdminLoggedIn } from "./utils/authStorage";

// @ts-ignore
import waseemAvatar from "./assets/images/waseem_profile_new_1782634792957.jpg";
import fiverrIcon from "./assets/images/fiverr-icon.png";
import upworkIcon from "./assets/images/upwork-icon.png";

// Project thumbnails
// @ts-ignore
import bostonBifImage from "./assets/images/boston_bif_new_1782634821929.jpg";
// @ts-ignore
import centersquareImage from "./assets/images/centersquare_new_1782634843010.jpg";
// @ts-ignore
import cypherLearningImage from "./assets/images/cypher_learning_new_1782634864135.jpg";
// @ts-ignore
import nextinyMarketingImage from "./assets/images/nextiny_marketing_new_1782634890772.jpg";
// @ts-ignore
import remoteTechImage from "./assets/images/remote_tech_new_1782634917528.jpg";

const projectImages: Record<string, string> = {
  "boston-institute-finance": bostonBifImage,
  "centersquare": centersquareImage,
  "cypher-learning": cypherLearningImage,
  "nextiny-marketing": nextinyMarketingImage,
  "remote-technology": remoteTechImage,
};

export function Logo({ className = "w-8 h-8", useGradient = true, strokeWidth = 8 }: { className?: string; useGradient?: boolean; strokeWidth?: number }) {
  const gradientId = useGradient ? "logo-grad" : undefined;
  return (
    <svg
      viewBox="0 0 94 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {useGradient && (
        <defs>
          <linearGradient id="logo-grad" x1="16" y1="20" x2="78" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" /> {/* Primary Cyan */}
            <stop offset="100%" stopColor="#67E8F9" /> {/* Accent Light Cyan */}
          </linearGradient>
        </defs>
      )}
      {/* Stroke 1: Left parallel leg of W */}
      <path
        d="M 16.5 20 L 31.5 50"
        stroke={gradientId ? `url(#${gradientId})` : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
      />
      {/* Stroke 2, 3, 4: Connected V and A chevron */}
      <path
        d="M 32.5 20 L 47.5 50 L 62.5 20 L 77.5 50"
        stroke={gradientId ? `url(#${gradientId})` : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default to dark mode for modern SaaS vibe
  });

  // Client Routing state (state-based paths to support static hosting seamlessly)
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminLoggedIn());

  // Dynamic Portfolio Content State
  const [portfolio, setPortfolio] = useState(() => getPortfolioContent());

  // Watch for location path modifications (history pop/push states)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAdminAuth(isAdminLoggedIn());
    };
    window.addEventListener("popstate", handleLocationChange);
    // Custom navigation check
    window.addEventListener("pushstate_nav", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate_nav", handleLocationChange);
    };
  }, []);

  // Listen for admin content changes to trigger immediate re-renders in the public view
  useEffect(() => {
    const handlePortfolioUpdated = () => {
      setPortfolio(getPortfolioContent());
    };
    window.addEventListener("portfolio_content_updated", handlePortfolioUpdated);
    return () => window.removeEventListener("portfolio_content_updated", handlePortfolioUpdated);
  }, []);

  // Custom router helper
  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.dispatchEvent(new Event("pushstate_nav"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Portfolio filter state
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Services and Value Proposition active tab
  const [activeServicesTab, setActiveServicesTab] = useState<"services" | "value">("services");

  // Selected project for Case Study modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Active FAQ accordion indexes
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Animated counters trigger
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [countStats, setCountStats] = useState({
    years: 0,
    projects: 0,
    clients: 0,
    lighthouse: 0
  });

  // Testimonials visible count
  const [visibleReviews, setVisibleReviews] = useState<number>(3);

  // Portfolio projects visible count
  const [visibleProjectsCount, setVisibleProjectsCount] = useState<number>(3);

  // Reset visible projects count when filter changes
  useEffect(() => {
    setVisibleProjectsCount(3);
  }, [activeFilter]);

  // Contact form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "HubSpot CMS Development",
    budget: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle intersection observer to trigger stats counters animation
  useEffect(() => {
    const triggerStatsAnimation = () => {
      if (hasAnimated) return;
      setHasAnimated(true);

      const maxYears = portfolio.about?.yearsOfExperience ?? 8;
      const maxProjects = portfolio.about?.projectsCompleted ?? 175;
      const maxClients = portfolio.about?.happyClients ?? 150;

      const duration = 1800; // ms
      const steps = 60;
      const stepTime = duration / steps;
      let stepCount = 0;

      const timer = setInterval(() => {
        stepCount++;
        
        setCountStats({
          years: Math.min(Math.round((maxYears / steps) * stepCount), maxYears),
          projects: Math.min(Math.round((maxProjects / steps) * stepCount), maxProjects),
          clients: Math.min(Math.round((maxClients / steps) * stepCount), maxClients),
          lighthouse: Math.min(Math.round((99 / steps) * stepCount), 99)
        });

        if (stepCount >= steps) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    // Auto-trigger on mount for robustness, or can be bound to scroll
    const timerDelay = setTimeout(() => {
      triggerStatsAnimation();
    }, 400);

    return () => clearTimeout(timerDelay);
  }, [hasAnimated, portfolio.about]);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formState.name,
          email: formState.email,
          projectType: formState.projectType,
          budget: formState.budget,
          message: formState.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setSubmitError(data.error || "Failed to submit form. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormState({
      name: "",
      email: "",
      projectType: "HubSpot CMS Development",
      budget: "",
      message: ""
    });
    setSubmitError(null);
    setIsSubmitted(false);
  };

  // Filtered projects
  const filteredProjects = activeFilter === "All" 
    ? (portfolio.projects || []) 
    : (portfolio.projects || []).filter((p: any) => p.category === activeFilter);

  // Helper to load project image URLs dynamically
  const getProjectImage = (imgUrlOrKey: string) => {
    if (!imgUrlOrKey) return "";
    if (imgUrlOrKey.startsWith("http") || imgUrlOrKey.startsWith("/") || imgUrlOrKey.startsWith("data:")) {
      return imgUrlOrKey;
    }
    return projectImages[imgUrlOrKey] || imgUrlOrKey;
  };

  // Helper to render dynamic service icons safely
  const renderServiceIcon = (iconName: string) => {
    const cls = "w-6 h-6 text-cyan-500 dark:text-cyan-400";
    switch (iconName) {
      case "HubSpot":
        return <Database className={cls} />;
      case "Layers":
        return <Layers className={cls} />;
      case "RefreshCw":
        return <RefreshCw className={cls} />;
      case "Wordpress":
        return <Globe className={cls} />;
      case "Mail":
        return <Mail className={cls} />;
      case "Code":
        return <Code className={cls} />;
      case "Smartphone":
        return <Smartphone className={cls} />;
      case "Zap":
        return <Zap className={cls} />;
      default:
        return <Code className={cls} />;
    }
  };

  if (currentPath === "/admin-dev") {
    return !isAdminAuth ? (
      <AdminLogin
        onLoginSuccess={() => setIsAdminAuth(true)}
        onBackToSite={() => navigateTo("/")}
      />
    ) : (
      <AdminDashboard
        onLogout={() => setIsAdminAuth(false)}
        onBackToSite={() => navigateTo("/")}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-secondary selection:text-white">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[120px] dark:bg-secondary/5 animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full bg-fuchsia-500/10 blur-[150px] dark:bg-fuchsia-500/5"></div>
      </div>

      {/* 1. STICKY HEADER */}
      <header id="header" className="sticky top-0 z-50 w-full transition-all duration-300 glass-nav shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" id="header-logo" className="flex items-center gap-2 group">
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
            <span className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              Waseem<span className="bg-gradient-to-r from-secondary to-fuchsia-500 bg-clip-text text-transparent">.dev</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Portfolio", href: "#portfolio" },
              { label: "Skills", href: "#skills" },
              { label: "Reviews", href: "#reviews" },
              { label: "FAQs", href: "#faqs" },
              { label: "Contact", href: "#contact" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-secondary dark:hover:text-secondary-light hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Hire Me CTA */}
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-secondary dark:hover:bg-secondary-hover dark:text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              id="header-cta"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Actions / Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle Theme Mobile"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle Navigation Menu"
              id="hamburger-btn"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg" id="mobile-menu">
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {[
                { label: "About", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Skills", href: "#skills" },
                { label: "Reviews", href: "#reviews" },
                { label: "FAQs", href: "#faqs" },
                { label: "Contact", href: "#contact" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-base font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-cyan-500 dark:hover:text-cyan-400"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-3 flex flex-col items-start gap-3">
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full max-w-[220px] text-center py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-xs hover:bg-cyan-400 block"
                >
                  Hire Me Now
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left" id="hero-content">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary dark:text-secondary-light text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>{portfolio.hero?.badge || "HubSpot Certified CMS Developer"}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white" id="hero-headline">
                {portfolio.hero?.headline}
              </h1>

              {/* Intro Paragraph */}
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {portfolio.hero?.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 w-full sm:w-auto">
                <a
                  href={portfolio.hero?.ctaLink || "#contact"}
                  className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <span>{portfolio.hero?.ctaText || "Hire Me Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={portfolio.hero?.portfolioLink || "#portfolio"}
                  className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <span>{portfolio.hero?.portfolioText || "View Portfolio"}</span>
                </a>
              </div>

              {/* Quick Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
                {[
                  { value: `${countStats.years}+`, label: "Years Experience" },
                  { value: `${countStats.projects}+`, label: "Projects Completed" },
                  { value: `${countStats.clients}+`, label: "Happy Clients" },
                  { value: portfolio.about?.responsiveLayouts || "100%", label: "Responsive Layouts" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-secondary to-fuchsia-500 bg-clip-text text-transparent font-mono">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Developer Graphic Column */}
            <div className="lg:col-span-5 relative" id="hero-graphic">
              
              {/* Outer Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-fuchsia-500/20 rounded-3xl blur-2xl pointer-events-none -rotate-3 animate-pulse-slow"></div>

              {/* Modern Visual Website Preview Window (No Code) */}
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                
                {/* Browser-style Header */}
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary-light"></span>
                  </div>
                  {/* Address Bar */}
                  <div className="flex-1 max-w-md mx-auto h-6 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-3 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-secondary">https://</span>
                      <span>waseemdev.vercel.app</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-700">🔒</span>
                  </div>
                </div>

                {/* Live Preview Window Content */}
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/40 space-y-6">
                  
                  {/* Visual Web Layout Mockup */}
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
                    {/* Header bar mock */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Logo className="w-5 h-5" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">waseem.dev</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-12 h-2 rounded bg-slate-100 dark:bg-slate-800"></span>
                        <span className="w-12 h-2 rounded bg-slate-100 dark:bg-slate-800"></span>
                        <span className="w-12 h-2 rounded bg-slate-100 dark:bg-slate-800"></span>
                      </div>
                    </div>

                    {/* Hero section mock */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-2">
                        <div className="h-3 w-4/5 rounded bg-gradient-to-r from-secondary to-fuchsia-500"></div>
                        <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                        <div className="h-2 w-3/4 rounded bg-slate-100 dark:bg-slate-800"></div>
                        <div className="h-5 w-1/2 rounded bg-slate-900 dark:bg-slate-100"></div>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-secondary-light/30 to-purple-500/5 dark:from-slate-800/30 dark:to-secondary/5 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 min-h-[75px]">
                        <div className="relative w-full h-full flex flex-col justify-between p-1">
                          <div className="flex gap-1 justify-end">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-fuchsia-400"></span>
                          </div>
                          <div className="h-3 w-2/3 rounded bg-secondary/10 dark:bg-secondary/20"></div>
                        </div>
                      </div>
                    </div>

                    {/* Integration / Database connection bar mock */}
                    <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-ping"></div>
                        <span className="font-semibold">HubSpot CMS Live Connection</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-light dark:bg-secondary/10 text-secondary dark:text-secondary-light font-bold font-mono">
                        Lighthouse: 100/100
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Metrics Panel */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-3xs text-left">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">CMS Templates</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Reusable & Drag-and-Drop</p>
                      <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full w-[95%]"></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-3xs text-left">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">SEO Engineering</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Core Web Vitals Passed</p>
                      <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-fuchsia-500 rounded-full w-[100%]"></div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Decorative floating stats floating nearby */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white dark:bg-white dark:text-slate-950 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-float border border-slate-800 dark:border-slate-100 z-10">
                <Award className="w-5 h-5 text-secondary dark:text-secondary-hover" />
                <div className="text-left">
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500">Certified</p>
                  <p className="text-sm font-bold">HubSpot CMS Dev</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Photo/Visual Column */}
            <div className="lg:col-span-5 relative" id="about-visual">
              <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950 shadow-md">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-secondary/10 to-fuchsia-500/10 dark:from-secondary/10 dark:to-cyan-950/20 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                  
                  {/* Ambient graphic background inside */}
                  <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl"></div>
                  
                  {/* Interactive Developer avatar representation */}
                  <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden shadow-xl border-2 border-secondary mb-6 scale-110 transition-transform duration-300 group-hover:scale-115">
                    <img
                      src={getProjectImage(portfolio.hero?.avatarUrl) || waseemAvatar}
                      alt={portfolio.hero?.name || "Waseem Ali"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white relative z-10">{portfolio.hero?.name || "Waseem Ali"}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 relative z-10 text-center max-w-[240px]">{portfolio.hero?.title || "Front-End & HubSpot CMS Developer"}</p>
                  <p className="text-[10px] text-secondary font-mono font-medium mt-1.5 relative z-10">{portfolio.about?.location || "Lahore, Pakistan"}</p>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-2 relative z-10">
                    {(portfolio.about?.skillsList || ["HubSpot CRM", "SEO Optimization", "UI Implementation"]).map((skillTag: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] font-semibold">{skillTag}</span>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-7 space-y-6 text-left" id="about-text">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>{portfolio.about?.badge || "01 • About Me"}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white pt-1">
                  {portfolio.about?.heading}
                </h2>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                {portfolio.about?.description}
              </p>

              {/* Positioning Callout Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-secondary/5 to-fuchsia-500/5 border border-secondary/10 dark:border-secondary/5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <CheckSquare className="w-5 h-5 text-secondary" />
                  {portfolio.about?.calloutTitle}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {portfolio.about?.calloutDescription}
                </p>
              </div>

              {/* Contact Button scroll */}
              <div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-secondary-hover dark:text-secondary-light hover:underline"
                >
                  <span>Let's talk about your project</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. SERVICES & STANDARDS (MERGED VALUE PROP & WHAT I DO) */}
      <section id="services" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>02 • Services & Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Professional Services & Quality Standards
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              High-impact specialized engineering and strategic implementation designed to scale your web presence and convert traffic.
            </p>
          </div>

          {/* Interactive Segmented Switcher */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <button
                onClick={() => setActiveServicesTab("services")}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeServicesTab === "services"
                    ? "bg-slate-100 dark:bg-slate-950 text-secondary dark:text-secondary-light shadow-xs border border-slate-200/40 dark:border-slate-800/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Core Services Offered</span>
              </button>
              <button
                onClick={() => setActiveServicesTab("value")}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  activeServicesTab === "value"
                    ? "bg-slate-100 dark:bg-slate-950 text-secondary dark:text-secondary-light shadow-xs border border-slate-200/40 dark:border-slate-800/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Why Partner With Me</span>
              </button>
            </div>
          </div>

          {/* Content Pane */}
          {activeServicesTab === "services" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
              {(portfolio.services || []).map((service: any) => (
                <div
                  key={service.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xs">
                      {renderServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left animate-fadeIn">
              {[
                {
                  title: "8+ Years Practical Experience",
                  description: "Over eight years of proven history working directly inside global developer-agency pipelines, building responsive elements that convert traffic.",
                  icon: <Timer className="w-6 h-6 text-secondary" />
                },
                {
                  title: "HubSpot & Frontend Authority",
                  description: "Certified expert in HubSpot CMS markup (HubL), database tools (HubDB), and front-end development. Seamlessly connecting CRM forms with custom UI designs.",
                  icon: <Database className="w-6 h-6 text-secondary" />
                },
                {
                  title: "Pixel-Perfect Responsive Layout",
                  description: "Rigorous attention to detail. Figma, Adobe XD, and Photoshop layouts translated to live responsive pages with zero structural deviation.",
                  icon: <Smartphone className="w-6 h-6 text-secondary" />
                },
                {
                  title: "SEO & Core Web Vitals Focus",
                  description: "Optimized script execution, lazy loading, and asset tuning to consistently push Lighthouse, GTmetrix, and PageSpeed metrics to green.",
                  icon: <Zap className="w-6 h-6 text-secondary" />
                },
                {
                  title: "Clean, Extensible Code",
                  description: "No sloppy shortcuts. Semantic HTML, reusable SCSS modules, and documented HubSpot HubL code that other developers love to inherit.",
                  icon: <Code className="w-6 h-6 text-secondary" />
                },
                {
                  title: "Proactive Delivery & Updates",
                  description: "Clear communication milestones, reliable Slack availability, and proactive troubleshooting. I pride myself on punctuality and transparent deadlines.",
                  icon: <CheckSquare className="w-6 h-6 text-secondary" />
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 hover:shadow-lg hover:border-secondary/30 dark:hover:border-secondary/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3 w-fit rounded-xl bg-secondary/10 dark:bg-secondary/5">
                      {card.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 6. SKILLS AND TAGS SECTION */}
      <section id="skills" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>03 • Tech Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Skills, Frameworks & Tooling Directory
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              A comprehensive breakdown of my capabilities, development environments, and automation standards.
            </p>
          </div>

          {/* Grouped Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {["Languages & Core", "CMS & Frameworks", "Design & Testing", "SEO & Devops"].map((cat) => {
              const catSkills = (portfolio.skills || []).filter((s: any) => s.category === cat);
              return (
                <div key={cat} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-xs text-secondary dark:text-secondary-light font-mono font-medium">Verified Expert</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {catSkills.map((skill) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm font-medium">
                          <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-secondary to-fuchsia-500 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badges Quicklist */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2">
                    {catSkills.map(s => (
                      <span key={s.name} className="px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        {s.name}
                      </span>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-[75px] bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>04 • Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Featured Projects
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Explore real implementations for global agencies, leading startups, and educational institutes.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2" id="portfolio-filters">
            {["All", "HubSpot CMS", "Front-End", "WordPress"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white dark:bg-secondary dark:text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(0, visibleProjectsCount).map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 overflow-hidden shadow-xs hover:shadow-lg hover:border-secondary/30 transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Visual Thumbnail Container with 16:9 aspect ratio */}
                <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col">
                  {/* Browser top bar mock */}
                  <div className="px-4 py-2 bg-slate-200/50 dark:bg-slate-950/80 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                      <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[150px] select-none">
                      {project.liveUrl ? project.liveUrl.replace("https://", "") : ""}
                    </span>
                    <div className="w-8"></div>
                  </div>
                  
                  {/* Real Website Screenshot / Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden group/image">
                    {getProjectImage(project.imageUrl || project.id) ? (
                      <img
                        src={getProjectImage(project.imageUrl || project.id)}
                        alt={`${project.title} Thumbnail`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-cyan-500/80 to-slate-950 flex items-center justify-center">
                        <span className="text-white text-xs font-mono">No Image Available</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay with visit icon */}
                    <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-cyan-500 text-white shadow-lg transform translate-y-2 group-hover/image:translate-y-0 transition-all duration-300 hover:scale-110">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Badge Category */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-mono rounded-md bg-slate-950/80 backdrop-blur-sm uppercase font-semibold text-cyan-400 border border-slate-800/50 z-10">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
                        {project.client}
                      </span>
                    </div>

                    <h4 
                      onClick={() => setSelectedProject(project)}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {project.metaDescription.length > 90 
                        ? `${project.metaDescription.substring(0, 90)}...` 
                        : project.metaDescription}
                    </p>

                    {/* Technologies list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3 items-center w-full">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-950 font-bold text-[10px] sm:text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Show More Button */}
          {filteredProjects.length > 3 && visibleProjectsCount < filteredProjects.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleProjectsCount((prev) => prev + 3)}
                className="w-full max-w-[220px] px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>Show More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 8. EXPERIENCE TIMELINE & 9. EDUCATION */}
      <section id="experience" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Work Experience */}
            <div className="lg:col-span-7 space-y-8 text-left" id="experience-timeline">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>05 • Work Experience</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
                  Work Experience Timeline
                </h2>
              </div>

              {/* Vertical Timeline */}
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 sm:pl-8 ml-2 space-y-12">
                {(portfolio.experience || []).map((exp: any) => (
                  <div key={exp.id} className="relative group">
                    
                    {/* Bullet dot */}
                    <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-secondary group-hover:bg-secondary group-hover:scale-110 transition-all duration-200"></span>
                    
                    {/* Card container */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-xs hover:border-secondary/20 transition-all duration-200">
                      
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-semibold text-secondary dark:text-secondary-light">
                            {exp.company}
                          </p>
                        </div>
                        <div className="space-y-1 text-left sm:text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                            <Briefcase className="w-3 h-3" />
                            {exp.period}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 sm:justify-end">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed list-disc list-inside">
                        {exp.description.map((desc, dIdx) => (
                          <li key={dIdx} className="pl-1">
                            {desc}
                          </li>
                        ))}
                      </ul>

                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Education & Certification */}
            <div className="lg:col-span-5 space-y-8 text-left" id="education-certifications">
              
              {/* Education section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    <span>06 • Academic Path</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
                    Education
                  </h2>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-xs relative overflow-hidden group">
                  {/* Decorative academic cap backdrop watermark */}
                  <GraduationCap className="absolute -bottom-10 -right-10 w-40 h-40 text-slate-100 dark:text-slate-800/10 pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="p-3 w-fit rounded-xl bg-secondary/10 dark:bg-secondary/5 text-secondary">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                        Sep 2011 to Sep 2015
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                        {EDUCATION.degree}
                      </h3>
                      <p className="text-sm font-semibold text-secondary dark:text-secondary-light mt-1">
                        {EDUCATION.institution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certification section */}
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    <span>07 • Credentials</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                    Active Certified Credentials
                  </h2>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-tr from-secondary/5 to-fuchsia-500/5 border border-secondary/20 dark:border-secondary/10 flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-secondary text-white shadow-md flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      HubSpot CMS for Developers
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      HubSpot Academy • Active & Verified Expert
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS SECTION */}
      <section id="reviews" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>08 • Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              What Clients & Partners Say About Me
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Real endorsements from corporate executives, agency owners, and tech founders globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {(portfolio.testimonials || []).slice(0, visibleReviews).map((review: any) => (
              <div
                key={review.id}
                className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col justify-between shadow-xs hover:border-secondary/20 transition-all duration-200"
              >
                <div className="space-y-4">
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(review.rating || 5)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-600 dark:text-slate-300 italic text-sm sm:text-base leading-relaxed">
                    "{review.text}"
                  </p>

                </div>

                {/* Author Info */}
                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={getProjectImage(review.avatarUrl)} 
                      alt={review.name} 
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-950 rounded-full p-0.5 shadow-sm border border-slate-100 dark:border-slate-850 flex items-center justify-center">
                      {review.platform === "Upwork" || review.id === "t2" || review.id === "t4" ? (
                        <UpworkLogo className="w-4 h-4" />
                      ) : (
                        <FiverrLogo className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {review.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {review.role}, <span className="font-semibold text-slate-600 dark:text-slate-300">{review.company}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {visibleReviews < (portfolio.testimonials || []).length && (
            <div className="flex justify-center pt-4 w-full">
              <button
                onClick={() => setVisibleReviews((prev) => prev + 3)}
                className="w-full max-w-[220px] px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>Load More Reviews</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 12. CTA CONVERSION BANNER */}
      <section className="py-20 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-white relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Need a Reliable Front-End or <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-secondary to-fuchsia-400 bg-clip-text text-transparent">HubSpot CMS Developer</span> for your next project?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Let's design and engineer high-performance web spaces, optimize PageSpeed, code custom drag-and-drop modules, or migrate your sites smoothly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full">
            <a
              href="#contact"
              className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl bg-secondary text-white font-bold hover:bg-secondary-hover shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <span>Hire Me Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-white transition-all cursor-pointer flex items-center justify-center text-center"
            >
              Discuss Your Project
            </a>
          </div>
        </div>
      </section>

      {/* 13. FAQS SECTION */}
      <section id="faqs" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>09 • FAQ Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Get answers to deployment timelines, HubSpot configurations, and agency scaling questions.
            </p>
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            {(portfolio.faqs || FAQS).map((faq: any, index: number) => {
              const isOpen = expandedFAQ === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFAQ(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-secondary dark:text-secondary-light shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                    )}
                  </button>

                  {/* Answer slide */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-slate-200/50 dark:border-slate-800/50" : "max-h-0"
                    }`}
                  >
                    <div className="p-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                      {faq.answer}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 14. CONTACT SECTION */}
      <section id="contact" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        
        {/* Absolute Background Decoration */}
        <div className="absolute top-[30%] left-[5%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/15 border border-secondary/20 dark:border-secondary/10 text-secondary dark:text-secondary-light font-mono text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>{portfolio.contact?.badge || "10 • Let's Connect"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {portfolio.contact?.heading || "Initiate a Digital Collaboration"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              {portfolio.contact?.description || "Submit the form below, and let's craft modern web solutions matching your goals."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-8 text-left" id="contact-info">
              
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-xs space-y-6">
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Direct Contact Particulars
                </h3>

                <div className="space-y-5">
                  
                  {/* Email */}
                  <a 
                    href={`mailto:${portfolio.contact?.email || "waseemali1031@gmail.com"}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-secondary/10 dark:bg-secondary/5 text-secondary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Email Address</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors truncate max-w-[200px] sm:max-w-[280px]">
                        {portfolio.contact?.email || "waseemali1031@gmail.com"}
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a 
                    href={`tel:${(portfolio.contact?.phone || "+923048687455").replace(/\s+/g, "")}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-secondary/10 dark:bg-secondary/5 text-secondary">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Call / Whatsapp</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors">
                        {portfolio.contact?.phone || "+92 304 8687455"}
                      </p>
                    </div>
                  </a>

                  {/* Availability */}
                  <div className="flex items-center gap-4 p-3 rounded-xl">
                    <div className="p-3 rounded-xl bg-secondary/10 dark:bg-secondary/5 text-secondary">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Current Status</p>
                      <p className="text-sm font-bold text-secondary dark:text-secondary-light">
                        Open for Freelance Projects
                      </p>
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start gap-3">
                  {[
                    { label: "LinkedIn", href: portfolio.socialLinks?.linkedin, icon: <Linkedin className="w-5 h-5" /> },
                    { label: "Upwork", href: portfolio.socialLinks?.upwork, icon: <UpworkLogo className="w-5 h-5" /> },
                    { label: "Fiverr", href: portfolio.socialLinks?.fiverr, icon: <FiverrLogo className="w-5 h-5" /> },
                    { label: "GitHub", href: portfolio.socialLinks?.github, icon: <Code className="w-5 h-5" /> }
                  ].filter(soc => soc.href).map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                      aria-label={soc.label}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>

              </div>

              {/* Trust Badge Column Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-secondary/5 to-fuchsia-500/5 border border-secondary/10 dark:border-secondary/5 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  Satisfaction Guarantee
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I believe in transparent collaboration, clean development, and regular progress updates. I ensure your project is implemented accurately, matches the requirements, and is thoroughly tested before delivery.
                </p>
              </div>

            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7" id="contact-form-container">
              
              {!isSubmitted ? (
                <form
                  onSubmit={handleContactSubmit}
                  className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-xs space-y-6 text-left"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Send a Direct Inquiry
                  </h3>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-xs mt-1">{submitError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-name" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="form-name"
                        required
                        placeholder="Gabriel Marguglio"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-light"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="form-email"
                        required
                        placeholder="client@agency.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-light"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Project Type */}
                    <div className="space-y-1.5 relative">
                      <label htmlFor="form-project-type" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                        Project Type
                      </label>
                      <div className="relative">
                        <select
                          id="form-project-type"
                          className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-light cursor-pointer appearance-none"
                          value={formState.projectType}
                          onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                        >
                          <option>HubSpot CMS Development</option>
                          <option>Landing Page Optimization</option>
                          <option>Website Migration / Redesign</option>
                          <option>WordPress / ACF Blocks</option>
                          <option>Email Builder templates</option>
                          <option>Other Custom Front-End Fix</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Budget Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-budget" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                        Approximate Budget
                      </label>
                      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-within:ring-2 focus-within:ring-secondary dark:focus-within:ring-secondary-light transition-all duration-200">
                        <input
                          type="text"
                          id="form-budget"
                          placeholder="e.g. $2,500"
                          className="w-full pl-4 pr-20 py-3 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
                          value={formState.budget}
                          onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-200/50 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                            Est.
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Rough estimate or budget range for matching resources.
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-message" className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Project Details / Message
                    </label>
                    <textarea
                      id="form-message"
                      required
                      rows={4}
                      placeholder="Share high-level requirements, timeline, or current website/Figma URL links..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-light"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center sm:justify-start w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full max-w-[220px] py-4 rounded-xl bg-gradient-to-r from-secondary to-fuchsia-500 text-white font-bold hover:from-secondary-hover hover:to-fuchsia-600 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-md text-center space-y-6">
                  <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-500 w-fit mx-auto">
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Submission Received!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-base leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{formState.name}</strong> Your inquiry was successfully submitted, we will reachout to you shortly.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <footer className="bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800 py-12 md:py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Column 1 Logo details */}
            <div className="md:col-span-5 space-y-4">
              <a href="#home" className="flex items-center gap-2 group">
                <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
                <span className="font-sans font-extrabold text-2xl tracking-tight text-white">
                  Waseem<span className="text-secondary">.dev</span>
                </span>
              </a>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Premium, high-performance Front-End & HubSpot CMS Developer with 8+ years of expertise. Specializing in pixel-perfect designs and custom marketing integrations.
              </p>
            </div>

            {/* Column 2 Navigation */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 font-mono">
                Quick Navigation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                <a href="#home" className="hover:text-secondary-light transition-colors">Home</a>
                <a href="#about" className="hover:text-secondary-light transition-colors">About</a>
                <a href="#services" className="hover:text-secondary-light transition-colors">Services</a>
                <a href="#portfolio" className="hover:text-secondary-light transition-colors">Portfolio</a>
                <a href="#skills" className="hover:text-secondary-light transition-colors">Skills</a>
                <a href="#reviews" className="hover:text-secondary-light transition-colors">Reviews</a>
                <a href="#faqs" className="hover:text-secondary-light transition-colors">FAQs</a>
                <a href="#contact" className="hover:text-secondary-light transition-colors">Contact</a>
              </div>
            </div>

            {/* Column 3 Social Links */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 font-mono">
                Connect on Platforms
              </h4>
              <p className="text-xs text-slate-400">
                Let's discuss freelance pipelines or contract opportunities directly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { label: "LinkedIn", href: portfolio.socialLinks?.linkedin, icon: Linkedin },
                  { label: "Upwork", href: portfolio.socialLinks?.upwork, icon: UpworkLogo },
                  { label: "Fiverr", href: portfolio.socialLinks?.fiverr, icon: FiverrLogo },
                  { label: "GitHub", href: portfolio.socialLinks?.github, icon: Code }
                ].filter(s => s.href).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                    title={s.label}
                  >
                    <s.icon className="w-7 h-7" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Copyright Area */}
          <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
            <p>© {new Date().getFullYear()} Waseem.dev. All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* DETAILED CASE STUDY OVERLAY MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            {/* Blur background overlay */}
            <div 
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity" 
              aria-hidden="true"
            ></div>

            {/* Trick browser alignment centering */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Body Card */}
            <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 dark:border-slate-800">
              
              {/* Header Visual */}
              <div className="p-6 sm:p-8 bg-gradient-to-tr from-slate-950 to-cyan-950 text-white relative flex flex-col justify-between">
                <div className="absolute inset-0 bg-radial-gradient from-secondary/20 to-transparent pointer-events-none"></div>
                
                <div className="flex justify-between items-start z-10">
                  <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-white/10 backdrop-blur-sm uppercase font-bold text-secondary-light">
                    {selectedProject.category} Case Study
                  </span>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 z-10 text-left">
                  <p className="text-xs font-mono text-fuchsia-400 font-bold uppercase tracking-widest">{selectedProject.client}</p>
                  <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Case Study Details Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto text-left leading-relaxed text-slate-600 dark:text-slate-300">
                
                {/* 16:9 Real Thumbnail Image */}
                {getProjectImage(selectedProject.imageUrl || selectedProject.id) && (
                  <div className="rounded-xl overflow-hidden aspect-video border border-slate-200/50 dark:border-slate-800 shadow-sm relative group mb-2">
                    <img 
                      src={getProjectImage(selectedProject.imageUrl || selectedProject.id)} 
                      alt={`${selectedProject.title} Case Study Thumbnail`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Long Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Overview & Background
                  </h4>
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    {selectedProject.longDescription}
                  </p>
                </div>

                {/* Challenge & Solution Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <h5 className="text-xs font-bold text-rose-500 dark:text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      The Challenge
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {selectedProject.challenge}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <h5 className="text-xs font-bold text-secondary dark:text-secondary-light font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      The Solution
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Key Metrics / Outcomes */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Measurable Results
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.results.map((res, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack used */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Technologies Leveraged
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  Ready to achieve similar results?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-secondary hover:bg-secondary-hover text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
