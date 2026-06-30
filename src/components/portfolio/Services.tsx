import { useState } from "react";
import {
  Layers,
  Sparkles,
  Timer,
  Database,
  Smartphone,
  Zap,
  Code,
  CheckSquare,
  RefreshCw,
  Globe,
  Mail
} from "lucide-react";
import { motion } from "motion/react";

interface ServicesProps {
  portfolio: any;
}

export function Services({ portfolio }: ServicesProps) {
  const [activeServicesTab, setActiveServicesTab] = useState<"services" | "value">("services");

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

  return (
    <section id="services" className="py-20 md:py-28 bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
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
          <div className="inline-flex p-1 bg-white/5 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/60 shadow-xs backdrop-blur-md">
            <button
              onClick={() => setActiveServicesTab("services")}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeServicesTab === "services"
                  ? "bg-slate-100 dark:bg-slate-950 text-cyan-500 dark:text-cyan-400 shadow-xs border border-slate-200/40 dark:border-slate-800/40"
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
                  ? "bg-slate-100 dark:bg-slate-950 text-cyan-500 dark:text-cyan-400 shadow-xs border border-slate-200/40 dark:border-slate-800/40"
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
          <motion.div 
            key="services"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            {(portfolio.services || []).map((service: any) => {
              // Custom tags depending on the service id
              const tags: string[] = 
                service.id === "hubspot-cms" ? ["HubL", "HubDB", "Drag & Drop", "CRM Forms"] :
                service.id === "frontend" ? ["React.js", "TypeScript", "Tailwind CSS", "GSAP"] :
                service.id === "wordpress" ? ["PHP Core", "ACF Blocks", "Custom Themes", "Security"] :
                service.id === "email-template" ? ["MJML / HTML", "Litmus Tested", "HubSpot Email"] :
                service.id === "workflow-automation" ? ["Zapier Automation", "Webhooks API", "Lead Scoring"] :
                service.id === "performance-optimization" ? ["Core Web Vitals", "GTmetrix Audit", "Asset Tuning"] :
                ["CMS Dev", "Front-End", "API Setup"];

              return (
                <div
                  key={service.id}
                  className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3 w-fit rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 border border-cyan-500/20 dark:border-cyan-500/10 shadow-2xs">
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

                  {/* Micro Technology Tags naturally distributed */}
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-100/10 dark:border-slate-850/30">
                    {tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/10 select-none cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="value"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            {[
              {
                title: "8+ Years Practical Experience",
                description: "Over eight years of proven history working directly inside global developer-agency pipelines, building responsive elements that convert traffic.",
                icon: <Timer className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "HubSpot & Frontend Authority",
                description: "Certified expert in HubSpot CMS markup (HubL), database tools (HubDB), and front-end development. Seamlessly connecting CRM forms with custom UI designs.",
                icon: <Database className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "Pixel-Perfect Responsive Layout",
                description: "Rigorous attention to detail. Figma, Adobe XD, and Photoshop layouts translated to live responsive pages with zero structural deviation.",
                icon: <Smartphone className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "SEO & Core Web Vitals Focus",
                description: "Optimized script execution, lazy loading, and asset tuning to consistently push Lighthouse, GTmetrix, and PageSpeed metrics to green.",
                icon: <Zap className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "Clean, Extensible Code",
                description: "No sloppy shortcuts. Semantic HTML, reusable SCSS modules, and documented HubSpot HubL code that other developers love to inherit.",
                icon: <Code className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "Proactive Delivery & Updates",
                description: "Clear communication milestones, reliable Slack availability, and proactive troubleshooting. I pride myself on punctuality and transparent deadlines.",
                icon: <CheckSquare className="w-6 h-6 text-cyan-500" />
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5">
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
          </motion.div>
        )}

      </div>
    </section>
  );
}
