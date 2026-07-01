import { CheckSquare, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

// @ts-ignore
import waseemAvatar from "../../assets/images/waseem_profile_new_1782634792957.jpg";

interface AboutProps {
  portfolio: any;
  getProjectImage: (imgUrlOrKey: string) => string;
}

export function About({ portfolio, getProjectImage }: AboutProps) {
  return (
    <section id="about" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Photo/Visual Column */}
          <motion.div 
            className="lg:col-span-5 relative min-h-[480px] flex items-center justify-start" 
            id="about-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500/30 to-fuchsia-500/30 opacity-40 blur-3xl pointer-events-none -translate-y-1/2"></div>
            
            {/* High-Tech Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-25 dark:opacity-30 pointer-events-none max-w-md ml-0 mr-auto h-[440px] rounded-3xl"></div>
            
            <div className="relative w-full max-w-[360px] sm:max-w-[380px] ml-0 mr-auto h-[440px] flex items-center justify-center">
              
              {/* Rotating outer dash/ring */}
              <div className="absolute inset-0 border border-dashed border-cyan-500/30 dark:border-cyan-500/20 rounded-full animate-[spin_80s_linear_infinite] p-4 scale-95 pointer-events-none"></div>
              
              {/* Elegant Profile Portrait Container */}
              <div className="relative w-[310px] h-[390px] rounded-3xl p-1 bg-gradient-to-br from-cyan-500/40 via-transparent to-fuchsia-500/40 dark:from-cyan-500/30 dark:to-fuchsia-500/30 shadow-2xl overflow-visible group">
                
                {/* Outer Glass Ring inside frame */}
                <div className="absolute inset-0.5 rounded-[22px] bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-md -z-10"></div>
                
                {/* Main Image Frame */}
                <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-slate-950">
                  
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                  
                  {/* The Image */}
                  <img
                    src={(() => {
                      const url = portfolio.hero?.avatarUrl;
                      if (url && !url.includes("private.blob.vercel-storage.com")) {
                        return getProjectImage(url);
                      }
                      return "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/Profile-update.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyOTY5NzgwODM3LCJpYXQiOjE3ODI5MjY1ODEwNTh9.zJRbqrMF31q9N-vSdC4tYbJCekjNhW3ROUG2yqyTafg&vercel-blob-signature=Ef1wnU3nW-dUOWw3IvastuFLFgbmq2Bi_j8oOr9YsTc";
                    })()}
                    alt={portfolio.hero?.name || "Waseem Ali"}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Bottom Text/Label on the image for neatness */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md border border-white/10 dark:border-slate-800/60 rounded-2xl p-3 flex items-center justify-between shadow-lg">
                    <div>
                      <h4 className="font-bold text-white text-xs tracking-tight">{portfolio.hero?.name || "Waseem Ali"}</h4>
                      <p className="text-[10px] text-cyan-400 font-medium mt-0.5">{portfolio.hero?.title || "Front-End & HubSpot CMS Developer"}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[9px] font-bold text-slate-300 font-mono">ONLINE</span>
                    </div>
                  </div>

                </div>

                {/* Floating Widget 1: Expert Badge */}
                <motion.div 
                  className="absolute -top-4 -left-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-xl z-20"
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    ★
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase leading-none">CMS MASTER</div>
                    <div className="text-[11px] font-bold text-white mt-0.5 leading-none">HubSpot Elite</div>
                  </div>
                </motion.div>

                {/* Floating Widget 2: Projects Completed */}
                <motion.div 
                  className="absolute -bottom-2 -right-4 bg-slate-950/90 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-xl z-20"
                  initial={{ y: -10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="w-6 h-6 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase leading-none">RATING</div>
                    <div className="text-[11px] font-bold text-white mt-0.5 leading-none">5.0 ★ Fiverr</div>
                  </div>
                </motion.div>

                {/* Corner Frame Accents (Pure Aesthetic CSS details) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-3xl -mt-1.5 -ml-1.5 pointer-events-none opacity-80"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-400 rounded-br-3xl -mb-1.5 -mr-1.5 pointer-events-none opacity-80"></div>

              </div>

            </div>
          </motion.div>

          {/* Right Information Column */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left" 
            id="about-text"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>{portfolio.about?.badge || "01 • About Me"}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white pt-1 leading-[1.1]">
                {(() => {
                  const heading = portfolio.about?.heading || "";
                  const words = heading.split(" ");
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
                  return heading;
                })()}
              </h2>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              {portfolio.about?.description}
            </p>

            {/* Positioning Callout Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5 border border-cyan-500/10 dark:border-cyan-500/5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <CheckSquare className="w-5 h-5 text-cyan-500" />
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
                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <span>Let's talk about your project</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
