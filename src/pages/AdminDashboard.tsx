import { useState, useEffect } from "react";
import { Menu, LogOut, ArrowLeft, RefreshCw, LayoutDashboard } from "lucide-react";
import AdminSidebar, { AdminTab } from "../components/admin/AdminSidebar";
import DashboardHome from "../components/admin/DashboardHome";
import HeroEditor from "../components/admin/HeroEditor";
import AboutEditor from "../components/admin/AboutEditor";
import ServicesEditor from "../components/admin/ServicesEditor";
import ProjectsEditor from "../components/admin/ProjectsEditor";
import ExperienceEditor from "../components/admin/ExperienceEditor";
import TestimonialsEditor from "../components/admin/TestimonialsEditor";
import ContactEditor from "../components/admin/ContactEditor";
import SocialLinksEditor from "../components/admin/SocialLinksEditor";
import Settings from "../components/admin/Settings";
import JsonImportExport from "../components/admin/JsonImportExport";
import FAQEditor from "../components/admin/FAQEditor";
import SEOEditor from "../components/admin/SEOEditor";
import { getPortfolioContent } from "../utils/contentStorage";
import { logoutAdmin } from "../utils/authStorage";

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

export default function AdminDashboard({ onLogout, onBackToSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Load dynamic content from localStorage or defaults on mount
    setContent(getPortfolioContent());

    const handlePortfolioUpdated = () => {
      setContent(getPortfolioContent());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_content") {
        setContent(getPortfolioContent());
      }
    };

    window.addEventListener("portfolio_content_updated", handlePortfolioUpdated);
    window.addEventListener("storage", handleStorageChange);

    // Asynchronously fetch latest content from the server
    const syncWithServer = async () => {
      try {
        const res = await fetch("/api/portfolio-content");
        if (res.ok) {
          const serverContent = await res.json();
          if (serverContent && typeof serverContent === "object" && serverContent.hero) {
            localStorage.setItem("portfolio_content", JSON.stringify(serverContent));
            setContent(serverContent);
          }
        }
      } catch (err) {
        console.warn("Failed to sync portfolio content with server on dashboard mount:", err);
      }
    };
    syncWithServer();

    return () => {
      window.removeEventListener("portfolio_content_updated", handlePortfolioUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleUpdate = (updatedContent: any) => {
    setContent(updatedContent);
  };

  const handleSignOut = () => {
    logoutAdmin();
    onLogout();
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading configurations...</p>
        </div>
      </div>
    );
  }

  // Render correct tab view dynamically
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardHome content={content} setActiveTab={setActiveTab} />;
      case "hero":
        return <HeroEditor content={content} onUpdate={handleUpdate} />;
      case "about":
        return <AboutEditor content={content} onUpdate={handleUpdate} />;
      case "services":
        return <ServicesEditor content={content} onUpdate={handleUpdate} />;
      case "projects":
        return <ProjectsEditor content={content} onUpdate={handleUpdate} />;
      case "experience":
        return <ExperienceEditor content={content} onUpdate={handleUpdate} />;
      case "testimonials":
        return <TestimonialsEditor content={content} onUpdate={handleUpdate} />;
      case "faqs":
        return <FAQEditor content={content} onUpdate={handleUpdate} />;
      case "contact":
        return <ContactEditor content={content} onUpdate={handleUpdate} />;
      case "socials":
        return <SocialLinksEditor content={content} onUpdate={handleUpdate} />;
      case "seo":
        return <SEOEditor content={content} onUpdate={handleUpdate} />;
      case "settings":
        return <Settings />;
      case "backup":
        return <JsonImportExport onUpdate={handleUpdate} />;
      default:
        return <DashboardHome content={content} setActiveTab={setActiveTab} />;
    }
  };

  // Capitalize active tab for display
  const tabLabel =
    activeTab === "overview"
      ? "Dashboard Home"
      : activeTab === "faqs"
      ? "Frequently Asked Questions"
      : activeTab === "seo"
      ? "SEO Meta Settings"
      : activeTab === "socials"
      ? "Social Links"
      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleSignOut}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-6 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg lg:hidden cursor-pointer"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              <span className="hidden sm:inline text-slate-500 font-medium">Workspace /</span>
              <span>{tabLabel}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>
          </div>
        </header>

        {/* Workspace body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
