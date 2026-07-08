import { useState, useEffect } from "react";

// Admin workspace components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { getPortfolioContent } from "./utils/contentStorage";
import { isAdminLoggedIn } from "./utils/authStorage";

// Modularized Portfolio components
import { Header } from "./components/portfolio/Header";
import { Hero } from "./components/portfolio/Hero";
import { Stats } from "./components/portfolio/Stats";
import { About } from "./components/portfolio/About";
import { Services } from "./components/portfolio/Services";
import { PortfolioSection } from "./components/portfolio/PortfolioSection";
import { Experience } from "./components/portfolio/Experience";
import { Reviews } from "./components/portfolio/Reviews";
import { CTABanner } from "./components/portfolio/CTABanner";
import { FAQs } from "./components/portfolio/FAQs";
import { Contact } from "./components/portfolio/Contact";
import { Footer } from "./components/portfolio/Footer";

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

export default function App() {
  // Theme state - permanently dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    localStorage.removeItem("theme");
  }, []);

  // Client Routing state (state-based paths to support static hosting seamlessly)
  const getInitialPath = () => {
    const p = window.location.pathname;
    const h = window.location.hash;
    const s = window.location.search;
    if (
      p === "/admin-dev" || 
      p === "/admin-dev/" ||
      p.endsWith("/admin-dev") || 
      p.endsWith("/admin-dev/") ||
      h === "#/admin-dev" || 
      h === "#admin-dev" || 
      s.includes("admin-dev")
    ) {
      return "/admin-dev";
    }
    return p;
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminLoggedIn());

  // Dynamic Portfolio Content State
  const [portfolio, setPortfolio] = useState(() => getPortfolioContent());

  // Watch for location path modifications (history pop/push states)
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      const s = window.location.search;
      if (
        p === "/admin-dev" || 
        p === "/admin-dev/" ||
        p.endsWith("/admin-dev") || 
        p.endsWith("/admin-dev/") ||
        h === "#/admin-dev" || 
        h === "#admin-dev" || 
        s.includes("admin-dev")
      ) {
        setCurrentPath("/admin-dev");
      } else {
        setCurrentPath(p);
      }
      setIsAdminAuth(isAdminLoggedIn());
    };
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate_nav", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate_nav", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
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

  // Synchronize SEO Meta Tags dynamically with state-edited properties
  useEffect(() => {
    if (portfolio?.seo) {
      // 1. Update document title
      if (portfolio.seo.title) {
        document.title = portfolio.seo.title;
      }
      
      // 2. Update description meta tag
      if (portfolio.seo.description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', portfolio.seo.description);
        
        // Also update og:description & twitter:description
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', portfolio.seo.description);
        }
        let twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
          twitterDescription.setAttribute('content', portfolio.seo.description);
        }
      }
      
      // 3. Update keywords meta tag
      if (portfolio.seo.keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', portfolio.seo.keywords);
      }
      
      // 4. Update author meta tag
      if (portfolio.seo.author) {
        let metaAuthor = document.querySelector('meta[name="author"]');
        if (!metaAuthor) {
          metaAuthor = document.createElement('meta');
          metaAuthor.setAttribute('name', 'author');
          document.head.appendChild(metaAuthor);
        }
        metaAuthor.setAttribute('content', portfolio.seo.author);
      }

      // 5. Update open graph & twitter titles
      if (portfolio.seo.title) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', portfolio.seo.title);
        }
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
          twitterTitle.setAttribute('content', portfolio.seo.title);
        }
      }

      // 6. Update Favicon dynamically
      if (portfolio.seo.favicon) {
        let linkFavicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
        if (!linkFavicon) {
          linkFavicon = document.createElement('link');
          linkFavicon.setAttribute('rel', 'icon');
          document.head.appendChild(linkFavicon);
        }
        linkFavicon.setAttribute('href', portfolio.seo.favicon);
      }
    }
  }, [portfolio?.seo]);

  // Custom router helper
  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.dispatchEvent(new Event("pushstate_nav"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Animated counters trigger
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [countStats, setCountStats] = useState({
    years: 0,
    projects: 0,
    clients: 0,
    lighthouse: 0
  });

  // Contact form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "HubSpot Website",
    budget: "",
    message: "",
    captchaAnswer: "",
    captchaToken: ""
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);



  // Dynamic SEO meta tags update
  useEffect(() => {
    if (portfolio.seo) {
      document.title = portfolio.seo.title || "Waseem Ali | Front-End & HubSpot CMS Developer";
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", portfolio.seo.description || "");

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", portfolio.seo.keywords || "");

      // Update meta author
      let metaAuthor = document.querySelector('meta[name="author"]');
      if (!metaAuthor) {
        metaAuthor = document.createElement("meta");
        metaAuthor.setAttribute("name", "author");
        document.head.appendChild(metaAuthor);
      }
      metaAuthor.setAttribute("content", portfolio.seo.author || "");
    }
  }, [portfolio.seo]);

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

    const timerDelay = setTimeout(() => {
      triggerStatsAnimation();
    }, 400);

    return () => clearTimeout(timerDelay);
  }, [hasAnimated, portfolio.about]);

  const handleContactSubmit = async (e: any) => {
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
          captchaToken: formState.captchaToken,
          captchaAnswer: formState.captchaAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const detailMsg = data.details ? ` (${data.details})` : "";
        setSubmitError(`${data.error || "Failed to submit form."}${detailMsg}`);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to load project image URLs dynamically
  const getProjectImage = (imgUrlOrKey: string) => {
    if (!imgUrlOrKey) return "";
    if (imgUrlOrKey.startsWith("http") || imgUrlOrKey.startsWith("/") || imgUrlOrKey.startsWith("data:")) {
      return imgUrlOrKey;
    }
    return projectImages[imgUrlOrKey] || imgUrlOrKey;
  };

  if (currentPath === "/admin-dev" || currentPath === "/admin-dev/") {
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
    <div className="min-h-screen font-sans bg-[#000000] text-slate-100 transition-colors duration-300 antialiased selection:bg-cyan-500 selection:text-slate-950 relative">
      
      {/* CONTINUOUS PREMIUM BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle radial glowing spotlights distributed down the page */}
        <div className="absolute top-[2%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full bg-fuchsia-500/[0.03] blur-[140px]"></div>
        <div className="absolute top-[35%] left-[8%] w-[550px] h-[550px] rounded-full bg-cyan-500/[0.03] blur-[130px]"></div>
        <div className="absolute top-[55%] right-[8%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.03] blur-[150px]"></div>
        <div className="absolute top-[75%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.03] blur-[120px]"></div>
        <div className="absolute top-[90%] right-[10%] w-[500px] h-[500px] rounded-full bg-fuchsia-500/[0.03] blur-[130px]"></div>
        
        {/* Fine grid texture with extremely subtle opacity */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
      </div>

      {/* ALL CONTENT LAYERED ABOVE THE BACKGROUND */}
      <div className="relative z-10">
        {/* 1. STICKY HEADER */}
        <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <main id="main-content">
          {/* 2. HERO SECTION */}
          <Hero portfolio={portfolio} countStats={countStats} />

          {/* 3. ABOUT SECTION */}
          <About portfolio={portfolio} getProjectImage={getProjectImage} />

          {/* 2b. STATS SECTION */}
          <Stats portfolio={portfolio} />

          {/* 4. SERVICES SECTION */}
          <Services portfolio={portfolio} />

          {/* 6. PORTFOLIO SECTION */}
          <PortfolioSection portfolio={portfolio} getProjectImage={getProjectImage} />

          {/* 7. EXPERIENCE & EDUCATION TIMELINE */}
          <Experience portfolio={portfolio} />

          {/* 8. CLIENT REVIEWS */}
          <Reviews portfolio={portfolio} getProjectImage={getProjectImage} />

          {/* 9. CALL TO ACTION BANNER */}
          <CTABanner portfolio={portfolio} />

          {/* 10. FAQS ACCORDION */}
          <FAQs portfolio={portfolio} />

          {/* 11. DIRECT INQUIRY CONTACT FORM */}
          <Contact
            portfolio={portfolio}
            formState={formState}
            setFormState={setFormState}
            isSubmitted={isSubmitted}
            isSubmitting={isSubmitting}
            submitError={submitError}
            handleContactSubmit={handleContactSubmit}
          />
        </main>

        {/* 12. FOOTER */}
        <Footer portfolio={portfolio} />
      </div>

    </div>
  );
}
