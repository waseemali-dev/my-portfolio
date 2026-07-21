import { useState, useEffect } from "react";
import { Menu, LogOut, ArrowLeft, RefreshCw, LayoutDashboard, AlertTriangle, X } from "lucide-react";
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
import NavigationEditor from "../components/admin/NavigationEditor";
import FooterEditor from "../components/admin/FooterEditor";
import Settings from "../components/admin/Settings";
import JsonImportExport from "../components/admin/JsonImportExport";
import FAQEditor from "../components/admin/FAQEditor";
import SEOEditor from "../components/admin/SEOEditor";
import MediaLibrary from "../components/admin/MediaLibrary";
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
  const [syncError, setSyncError] = useState<string | null>(null);

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

    const handleSyncFailed = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSyncError(customEvent.detail || "Firestore synchronization failed.");
    };

    const handleSyncSuccess = () => {
      setSyncError(null);
    };

    window.addEventListener("portfolio_content_updated", handlePortfolioUpdated);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_sync_failed", handleSyncFailed);
    window.addEventListener("portfolio_sync_success", handleSyncSuccess);

    // Asynchronously fetch latest content from the server
    const syncWithServer = async () => {
      try {
        const res = await fetch(`/api/portfolio-content?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const serverContent = await res.json();
          if (serverContent && typeof serverContent === "object" && serverContent.hero) {
            const localContent = getPortfolioContent();
            const serverTime = serverContent.lastUpdated || 0;
            const localTime = localContent?.lastUpdated || 0;

            if (serverTime > localTime) {
              localStorage.setItem("portfolio_content", JSON.stringify(serverContent));
              setContent(serverContent);
              console.log("Dashboard loaded newer content from server.");
              setSyncError(null);
            } else if (localTime > serverTime) {
              console.log("Dashboard: Local content is newer than server. Uploading to server to sync...");
              const syncRes = await fetch("/api/portfolio-content", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(localContent),
              });
              if (!syncRes.ok) {
                const errData = await syncRes.json().catch(() => ({}));
                const errMsg = errData.error || `Server returned error status ${syncRes.status}`;
                setSyncError(errMsg);
              } else {
                setSyncError(null);
              }
            } else {
              console.log("Dashboard and server content are already in sync.");
              setSyncError(null);
            }
          } else {
            // Server returned null/invalid, auto-sync client's current content to initialize server
            const clientContent = getPortfolioContent();
            if (clientContent) {
              console.log("Dashboard: Initializing server with current portfolio content...");
              const initRes = await fetch("/api/portfolio-content", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(clientContent),
              });
              if (!initRes.ok) {
                const errData = await initRes.json().catch(() => ({}));
                setSyncError(errData.error || "Failed to initialize server content.");
              } else {
                setSyncError(null);
              }
            }
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          setSyncError(errData.error || "Failed to retrieve configuration from server.");
        }
      } catch (err) {
        console.warn("Failed to sync portfolio content with server on dashboard mount:", err);
      }
    };
    syncWithServer();

    return () => {
      window.removeEventListener("portfolio_content_updated", handlePortfolioUpdated);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_sync_failed", handleSyncFailed);
      window.removeEventListener("portfolio_sync_success", handleSyncSuccess);
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
      case "media":
        return <MediaLibrary />;
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
      case "navigation":
        return <NavigationEditor portfolio={content} />;
      case "footer":
        return <FooterEditor portfolio={content} />;
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
      : activeTab === "media"
      ? "Uploaded Images Folder"
      : activeTab === "faqs"
      ? "Frequently Asked Questions"
      : activeTab === "seo"
      ? "SEO Meta Settings"
      : activeTab === "socials"
      ? "Social Links"
      : activeTab === "navigation"
      ? "Navigation Links"
      : activeTab === "footer"
      ? "Footer Settings"
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
            {syncError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm text-red-300">Cloud Sync Warning</h4>
                  <p className="text-xs text-red-400/90 leading-relaxed">
                    {syncError}
                  </p>
                  <p className="text-[11px] text-red-400/70 pt-1 leading-normal">
                    Tip: Since Vercel runs in a serverless, read-only environment, local filesystem saves are temporary. To make changes permanent across reloads and visible on your live site, you must configure Firestore. Ensure your Firestore Security Rules allow public reads/writes to the path <code className="bg-red-950/40 px-1 py-0.5 rounded text-red-300">configs/portfolio</code> (using your API Key).
                  </p>
                </div>
                <button
                  onClick={() => setSyncError(null)}
                  className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                  title="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
