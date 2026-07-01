import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 bg-transparent text-white relative overflow-hidden">
      
      {/* Soft inner glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Need a Reliable Front-End or <br className="hidden sm:inline" />
          <span className="inline-block bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent pr-1.5 pb-1">HubSpot CMS Developer</span> for your next project?
        </h2>
        <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Let's design and engineer high-performance web spaces, optimize PageSpeed, code custom drag-and-drop modules, or migrate your sites smoothly.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full">
          <a
            href="#contact"
            className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-center"
          >
            <span>Hire Me Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-[220px] max-w-[220px] px-6 py-4 rounded-xl border border-slate-200/10 dark:border-slate-800/80 bg-white/5 dark:bg-slate-950/20 backdrop-blur-sm hover:bg-slate-150 dark:hover:bg-slate-900/60 font-bold text-slate-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer flex items-center justify-center text-center"
          >
            Discuss Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
