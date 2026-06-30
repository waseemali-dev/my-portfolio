import { Sparkles, ArrowRight, Award } from "lucide-react";
import { Logo } from "./Logo";
import { motion } from "motion/react";

interface HeroProps {
  portfolio: any;
  countStats: {
    years: number;
    projects: number;
    clients: number;
    lighthouse: number;
  };
}

export function Hero({ portfolio, countStats }: HeroProps) {
  return (
    <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left" 
            id="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* Trust Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{portfolio.hero?.badge || "HubSpot Certified CMS Developer"}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.25] text-slate-900 dark:text-white" id="hero-headline">
              {(() => {
                const headline = portfolio.hero?.headline || "";
                if (headline.includes("|")) {
                  const [line1, line2] = headline.split("|");
                  const line1Text = line1.trim();
                  const line2Text = line2.trim();
                  return (
                    <span className="block">
                      <span className="block text-cyan-500 dark:text-cyan-400 font-extrabold pb-2">
                        {line1Text}
                      </span>
                      <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                        {line2Text}
                      </span>
                    </span>
                  );
                }
                const target = "Waseem Ali";
                if (headline.includes(target)) {
                  const parts = headline.split(target);
                  return (
                    <>
                      {parts[0]}
                      <span className="text-cyan-500 dark:text-cyan-400 font-extrabold">
                        {target}
                      </span>
                      {parts[1]}
                    </>
                  );
                }
                return headline;
              })()}
            </h1>

            {/* Intro Paragraph */}
            <p className="text-lg text-slate-900 dark:text-white max-w-2xl leading-relaxed">
              {portfolio.hero?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href={portfolio.hero?.ctaLink || "#contact"}
                className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>{portfolio.hero?.ctaText || "Let's Work Together"}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
              <a
                href={portfolio.hero?.portfolioLink || "#portfolio"}
                className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/5 dark:bg-slate-950/20 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-slate-900/60 font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>{portfolio.hero?.portfolioText || "View Projects"}</span>
              </a>
            </div>

            {/* Trust / Technology Badges */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Expert Ecosystem & Platform Support</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "HubSpot CMS",
                  "WordPress",
                  "React",
                  "Shopify",
                  "Webflow",
                  "Automation",
                  "Email Marketing"
                ].map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/60 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/20 dark:hover:border-cyan-500/20 transition-all duration-300 select-none cursor-default"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              {[
                { value: `${countStats.years}+`, label: "Years Experience" },
                { value: `${countStats.projects}+`, label: "Projects Completed" },
                { value: `${countStats.clients}+`, label: "Happy Clients" },
                { value: portfolio.about?.responsiveLayouts || "100%", label: "Responsive Layouts" }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-fuchsia-500 bg-clip-text text-transparent font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </motion.div>

          {/* Right Developer Graphic Column */}
          <motion.div 
            className="lg:col-span-5 relative" 
            id="hero-graphic"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            
            {/* Outer Decorative Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl pointer-events-none -rotate-3 animate-pulse-slow"></div>

            {/* Modern Visual Website Preview Window (No Code) */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              
              {/* Browser-style Header */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                </div>
                {/* Address Bar */}
                <div className="flex-1 max-w-md mx-auto h-6 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-3 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-cyan-500">https://</span>
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
                      <div className="h-3 w-4/5 rounded bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>
                      <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                      <div className="h-2 w-3/4 rounded bg-slate-100 dark:bg-slate-800"></div>
                      <div className="h-5 w-1/2 rounded bg-slate-900 dark:bg-slate-100"></div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-cyan-400/30 to-purple-500/5 dark:from-slate-800/30 dark:to-cyan-500/5 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 min-h-[75px]">
                      <div className="relative w-full h-full flex flex-col justify-between p-1">
                        <div className="flex gap-1 justify-end">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                          <span className="w-2 h-2 rounded-full bg-fuchsia-400"></span>
                        </div>
                        <div className="h-3 w-2/3 rounded bg-cyan-500/10 dark:bg-cyan-500/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Integration / Database connection bar mock */}
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
                      <span className="font-semibold">HubSpot CMS Live Connection</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                      Lighthouse: {countStats.lighthouse}/100
                    </span>
                  </div>
                </div>

                {/* Dynamic Metrics Panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-3xs text-left">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">CMS Templates</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">Reusable & Drag-and-Drop</p>
                    <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-[95%]"></div>
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
              <Award className="w-5 h-5 text-cyan-500 dark:text-cyan-600" />
              <div className="text-left">
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500">Certified</p>
                <p className="text-sm font-bold">HubSpot CMS Dev</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
