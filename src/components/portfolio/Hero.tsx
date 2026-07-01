import { Sparkles, ArrowRight } from "lucide-react";
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
            className="lg:col-span-7 space-y-6 text-center lg:text-left mx-auto lg:mx-0 max-w-[600px] lg:max-w-none" 
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
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white" id="hero-headline">
              {(() => {
                const headline = portfolio.hero?.headline || "";
                if (headline.includes("|")) {
                  const [line1, line2] = headline.split("|");
                  const line1Text = line1.trim();
                  const line2Text = line2.trim();
                  return (
                    <span className="block">
                      <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pb-2 text-5xl sm:text-6xl lg:text-7xl leading-tight">
                        {line1Text}
                      </span>
                      <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white/95 tracking-wide mt-1">
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
                      <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-1.5 pb-1">
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
            <p className="text-lg text-slate-900 dark:text-white max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {portfolio.hero?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto mx-auto lg:mx-0">
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

          </motion.div>

          {/* Right Image Column */}
          <motion.div 
            className="lg:col-span-5 relative flex items-center justify-center w-full" 
            id="hero-graphic"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Outer Decorative Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl pointer-events-none -rotate-3 animate-pulse-slow"></div>

            <img
              src="https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/hero-right.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyOTc0ODY0NzA1LCJpYXQiOjE3ODI5MzE2NjUwMTl9.ZnVsj9WvUYmZ4Ihn35IuyQsZCa48eEQCt7Zoyk1XeRI&vercel-blob-signature=xGIvEpRdt0fVwDJzXSBynCOVzaciCknAwmQ_ThhwUlE"
              alt="Portfolio hero preview"
              className="relative z-10 w-full max-w-[500px] lg:max-w-none h-auto object-contain mx-auto transition-transform duration-300"
              fetchPriority="high"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
