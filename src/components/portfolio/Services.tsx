import {
  Layers,
  Database,
  Smartphone,
  Zap,
  Code,
  RefreshCw,
  Globe,
  Mail
} from "lucide-react";

interface ServicesProps {
  portfolio: any;
}

export function Services({ portfolio }: ServicesProps) {
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
            <span>{portfolio.servicesHeader?.badge || "Services & Standards"}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {(() => {
              const title = portfolio.servicesHeader?.title || "Services & Quality Standards";
              const words = title.split(" ");
              if (words.length > 2) {
                const lastTwo = words.slice(-2).join(" ");
                const firstPart = words.slice(0, -2).join(" ");
                return (
                  <>
                    {firstPart}{" "}
                    <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                      {lastTwo}
                    </span>
                  </>
                );
              }
              return title;
            })()}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {portfolio.servicesHeader?.description || "High-impact specialized engineering and strategic implementation designed to scale your web presence and convert traffic."}
          </p>
        </div>

        {/* Content Pane */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
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
        </div>

      </div>
    </section>
  );
}

