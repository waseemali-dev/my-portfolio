import { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface PortfolioSectionProps {
  portfolio: any;
  getProjectImage: (imgUrlOrKey: string) => string;
}

export function PortfolioSection({ portfolio, getProjectImage }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [visibleProjectsCount, setVisibleProjectsCount] = useState<number>(3);

  // Reset visible projects count when filter changes
  useEffect(() => {
    setVisibleProjectsCount(3);
  }, [activeFilter]);

  // Filtered projects
  const filteredProjects = activeFilter === "All" 
    ? (portfolio.projects || []) 
    : (portfolio.projects || []).filter((p: any) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-[75px] bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>04 • Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Explore real implementations for global agencies, leading startups, and educational institutes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2" id="portfolio-filters">
          {["All", "HubSpot CMS", "Front-End", "WordPress"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                  : "bg-white/5 dark:bg-slate-900/40 border border-slate-200/15 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div 
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.slice(0, visibleProjectsCount).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Visual Thumbnail Container with 16:9 aspect ratio */}
              <div className="bg-white/5 dark:bg-slate-950/40 border-b border-slate-200/10 dark:border-slate-800/40 relative overflow-hidden flex flex-col">
                {/* Browser top bar mock */}
                <div className="px-4 py-2 bg-slate-200/20 dark:bg-slate-950/60 flex items-center justify-between border-b border-slate-200/10 dark:border-slate-800/40">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[150px] select-none">
                    {project.liveUrl ? project.liveUrl.replace("https://", "") : ""}
                  </span>
                  <div className="w-8"></div>
                </div>
                
                {/* Real Website Screenshot / Thumbnail Container */}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video w-full overflow-hidden group/image block"
                  >
                    {getProjectImage(project.imageUrl || project.id) ? (
                      <img
                        src={getProjectImage(project.imageUrl || project.id)}
                        alt={`${project.title} Thumbnail`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-cyan-500/80 to-slate-950 flex items-center justify-center">
                        <span className="text-white text-xs font-mono">No Image Available</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay with visit icon */}
                    <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-cyan-500 text-slate-950 shadow-lg transform translate-y-2 group-hover/image:translate-y-0 transition-all duration-300 hover:scale-110">
                        <ArrowUpRight className="w-5 h-5 text-slate-950" />
                      </div>
                    </div>

                    {/* Badge Category */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-mono rounded-md bg-slate-950/80 backdrop-blur-sm uppercase font-semibold text-cyan-400 border border-slate-800/50 z-10">
                      {project.category}
                    </span>
                  </a>
                ) : (
                  <div className="relative aspect-video w-full overflow-hidden group/image">
                    {getProjectImage(project.imageUrl || project.id) ? (
                      <img
                        src={getProjectImage(project.imageUrl || project.id)}
                        alt={`${project.title} Thumbnail`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-cyan-500/80 to-slate-950 flex items-center justify-center">
                        <span className="text-white text-xs font-mono">No Image Available</span>
                      </div>
                    )}
                    {/* Badge Category */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-mono rounded-md bg-slate-950/80 backdrop-blur-sm uppercase font-semibold text-cyan-400 border border-slate-800/50 z-10">
                      {project.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                
                <div className="space-y-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h4>
                    </a>
                  ) : (
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>
                  )}

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {project.description.length > 85 
                      ? `${project.description.substring(0, 85)}...` 
                      : project.description}
                  </p>

                  {/* Technologies list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.liveUrl && (
                  <div className="pt-2 flex gap-3 items-center w-full">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-950 font-bold text-[10px] sm:text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Show More Button */}
        {filteredProjects.length > 3 && visibleProjectsCount < filteredProjects.length && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setVisibleProjectsCount((prev) => prev + 3)}
              className="w-full max-w-[220px] px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <span>Show More</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
