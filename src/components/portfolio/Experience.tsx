import { useState } from "react";
import { Briefcase, MapPin, GraduationCap, Award, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

interface ExperienceProps {
  portfolio: any;
}

export function Experience({ portfolio }: ExperienceProps) {
  // State to track expanded status for each experience card by ID
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="experience" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Work Experience */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-left" 
            id="experience-timeline"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>{portfolio.experienceHeader?.badge || "Work Experience"}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white pt-1 leading-[1.1]">
                {(() => {
                  const title = portfolio.experienceHeader?.title || "Work Experience Timeline";
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
              {portfolio.experienceHeader?.description && (
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                  {portfolio.experienceHeader.description}
                </p>
              )}
            </div>

            {/* Vertical Timeline */}
            <div className="relative border-l-2 border-slate-200/30 dark:border-slate-800/50 pl-6 sm:pl-8 ml-2 space-y-10">
              {(portfolio.experience || []).map((exp: any, idx: number) => {
                return (
                  <motion.div 
                    key={exp.id} 
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    
                    {/* Bullet dot */}
                    <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-950 border-4 border-cyan-500 group-hover:scale-110 transition-all duration-250"></span>
                    
                    {/* Card container */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/30 transition-all duration-300">
                      
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-semibold text-cyan-500 dark:text-cyan-400">
                            {exp.company}
                          </p>
                        </div>
                        <div className="space-y-1 text-left sm:text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800/30 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                            <Briefcase className="w-3 h-3" />
                            {exp.period}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 sm:justify-end">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      {/* Content details toggled by expand/collapse */}
                      <motion.div
                        id={`exp-desc-${exp.id}`}
                        initial={false}
                        animate={{
                          height: expandedIds[exp.id] ? "auto" : 0,
                          opacity: expandedIds[exp.id] ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 text-left">
                          {Array.isArray(exp.description) ? (
                            exp.description.length > 1 ? (
                              <div className="space-y-2">
                                {exp.description.map((item: string, i: number) => (
                                  <p key={i} className="text-slate-300 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                                    {item}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-300 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                                {exp.description[0]}
                              </p>
                            )
                          ) : (
                            <p className="text-slate-300 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                              {exp.description || ""}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Minimal toggle button */}
                      <div className="flex justify-start">
                        <button
                          onClick={() => toggleExpand(exp.id)}
                          aria-expanded={expandedIds[exp.id] || false}
                          aria-controls={`exp-desc-${exp.id}`}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-500 hover:text-cyan-400 font-mono transition-colors outline-none focus:outline-none focus:ring-0 rounded cursor-pointer py-1"
                        >
                          <span>{expandedIds[exp.id] ? "Hide Details" : "View Details"}</span>
                          {expandedIds[exp.id] ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </div>

          </motion.div>

          {/* Right Column: Education & Certification */}
          <div className="lg:col-span-5 space-y-8 text-left" id="education-certifications">
            
            {/* Education section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span>{portfolio.educationHeader?.badge || "Academic Path"}</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white pt-1 leading-[1.1]">
                  {(() => {
                    const title = portfolio.educationHeader?.title || "Education";
                    const words = title.trim().split(/\s+/);
                    if (words.length > 1) {
                      const lastWord = words[words.length - 1];
                      const firstPart = words.slice(0, -1).join(" ");
                      return (
                        <>
                          {firstPart}{" "}
                          <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                            {lastWord}
                          </span>
                        </>
                      );
                    }
                    const mid = Math.floor(title.length / 2);
                    return (
                      <>
                        {title.slice(0, mid)}
                        <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                          {title.slice(mid)}
                        </span>
                      </>
                    );
                  })()}
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] relative overflow-hidden group">
                {/* Decorative academic cap backdrop watermark */}
                <GraduationCap className="absolute -bottom-10 -right-10 w-40 h-40 text-slate-100 dark:text-slate-800/5 pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="p-3 w-fit rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-500">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/10 dark:bg-slate-950/40 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-200/10 dark:border-slate-800/40">
                      {portfolio.education?.period || "Sep 2011 to Sep 2015"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                      {portfolio.education?.degree || "Bachelor of Science in Computer Science (BSCS)"}
                    </h3>
                    <p className="text-sm font-semibold text-cyan-500 dark:text-cyan-400 mt-1">
                      {portfolio.education?.institution || "Federal Urdu University of Arts, Science & Technology"}
                    </p>
                    {portfolio.education?.details && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                        {portfolio.education.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certification section */}
            <motion.div 
              className="space-y-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span>{portfolio.credentialsHeader?.badge || "Credentials"}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white pt-1">
                  {(() => {
                    const title = portfolio.credentialsHeader?.title || "Active Certified Credentials";
                    const words = title.trim().split(/\s+/);
                    if (words.length > 1) {
                      const lastWord = words[words.length - 1];
                      const firstPart = words.slice(0, -1).join(" ");
                      return (
                        <>
                          {firstPart}{" "}
                          <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                            {lastWord}
                          </span>
                        </>
                      );
                    }
                    const mid = Math.floor(title.length / 2);
                    return (
                      <>
                        {title.slice(0, mid)}
                        <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                          {title.slice(mid)}
                        </span>
                      </>
                    );
                  })()}
                </h2>
              </div>

              <div className="space-y-4">
                {(portfolio.certifications || [
                  {
                    id: "hubspot-cms-dev",
                    name: "HubSpot CMS for Developers",
                    authority: "HubSpot Academy",
                    status: "Active & Verified Expert"
                  }
                ]).map((cert: any, index: number) => (
                  <div key={cert.id || index} className="p-5 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/30 dark:border-cyan-500/20 bg-white/5 dark:bg-slate-900/10 backdrop-blur-md flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-slate-950" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-left text-sm sm:text-base">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-left">
                        {cert.authority} • {cert.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
