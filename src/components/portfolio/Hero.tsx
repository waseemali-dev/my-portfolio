import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../common/Button";

// @ts-ignore
import aiAutomation from "../../assets/images/ai-automation-wordpress-shopify-wix-react-hubspot-development-services.png";

interface HeroProps {
  portfolio: any;
  countStats: {
    years: number;
    projects: number;
    clients: number;
    lighthouse: number;
  };
  getProjectImage: (imgUrlOrKey: string) => string;
}

export function Hero({ portfolio, countStats, getProjectImage }: HeroProps) {
  return (
    <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-center lg:text-left mx-auto lg:mx-0 max-w-[600px] lg:max-w-none" 
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
              <span>{portfolio.hero?.badge || "Digital Experience Developer"}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-[8.5vw] min-[380px]:text-[8vw] min-[450px]:text-[7.5vw] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.2rem] font-black tracking-tighter leading-[1.12] text-slate-900 dark:text-white" id="hero-headline">
              {(() => {
                const headline = portfolio.hero?.headline || "";
                
                // Remove any prefix with Waseem Ali and pipes/dashes
                let cleanHeadline = headline
                  .replace(/^Waseem\s+Ali\s*\|\s*/i, "")
                  .replace(/^Waseem\s+Ali\s*-\s*/i, "")
                  .replace(/Waseem\s+Ali/gi, "")
                  .trim();

                // Style 'Building Digital Experiences That Convert & Scale' beautifully (only on exact match to allow custom user edits)
                if (cleanHeadline.toLowerCase().trim() === "building digital experiences that convert & scale") {
                  return (
                    <span className="block text-center lg:text-left leading-[1.12]">
                      <span className="block whitespace-nowrap">Building</span>
                      <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-black whitespace-nowrap">
                        Digital Experiences
                      </span>
                      <span className="block whitespace-nowrap">
                        That{" "}
                        <span className="inline-block bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent font-black">
                          Convert &amp; Scale
                        </span>
                      </span>
                    </span>
                  );
                }

                // If it is the default headline or has the key phrases, style it gorgeously
                if (cleanHeadline.includes("High-Converting Websites") && cleanHeadline.includes("Automation Systems")) {
                  return (
                    <span className="block tracking-tight text-center lg:text-left">
                      Building{" "}
                      <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-black pr-1">
                        High-Converting Websites
                      </span>{" "}
                      &amp;{" "}
                      <span className="inline-block bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent font-black">
                        Automation Systems
                      </span>{" "}
                      <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-200 mt-4 tracking-normal">
                        for Modern Businesses
                      </span>
                    </span>
                  );
                }

                // If it has pipe symbol, use it for split styling
                if (cleanHeadline.includes("|")) {
                  const [part1, part2] = cleanHeadline.split("|");
                  return (
                    <span className="block text-center lg:text-left">
                      <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pb-2 text-4xl sm:text-5xl lg:text-6xl">
                        {part1.trim()}
                      </span>
                      <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-200 mt-2">
                        {part2.trim()}
                      </span>
                    </span>
                  );
                }

                // Fallback: Style general tech words dynamically if found
                const wordsToHighlight = ["Websites", "Automation", "CMS", "React", "AI-powered", "High-Converting", "Modern", "Businesses", "Developer"];
                const wordsRegex = new RegExp(`\\b(${wordsToHighlight.join("|")})\\b`, "gi");
                const parts = cleanHeadline.split(wordsRegex);
                
                if (parts.length > 1) {
                  return (
                    <span className="block text-center lg:text-left">
                      {parts.map((part, index) => {
                        const isMatch = wordsToHighlight.some(w => w.toLowerCase() === part.toLowerCase());
                        if (isMatch) {
                          return (
                            <span 
                              key={index} 
                              className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent font-black"
                            >
                              {part}
                            </span>
                          );
                        }
                        return <span key={index}>{part}</span>;
                      })}
                    </span>
                  );
                }

                // If no special words, render with a beautiful subtle gradient
                return (
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent text-center lg:text-left block">
                    {cleanHeadline}
                  </span>
                );
              })()}
            </h1>

            {/* Intro Paragraph */}
            <p className="text-lg text-slate-900 dark:text-white max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {portfolio.hero?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto mx-auto lg:mx-0">
              <Button
                text={portfolio.hero?.portfolioText || "View Projects"}
                href={portfolio.hero?.portfolioLink || "#portfolio"}
                style={portfolio.hero?.portfolioStyle || "secondary"}
              />
            </div>

          </motion.div>

          {/* Right Image Column */}
          <motion.div 
            className="lg:col-span-6 relative flex items-center justify-center w-full" 
            id="hero-graphic"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Ambient background glow behind the expertise graphic */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 blur-3xl rounded-full scale-90 opacity-70 z-0 animate-pulse" />
            
            <img
              src={aiAutomation}
              alt="Waseem Ali - AI Automation & Web Development Expertise"
              className="relative z-10 w-full max-w-[580px] lg:max-w-full h-auto object-contain mx-auto transition-all duration-500 hover:scale-[1.03] drop-shadow-[0_10px_30px_rgba(6,182,212,0.15)]"
              width="600"
              height="450"
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
