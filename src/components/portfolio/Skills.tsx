import { motion } from "motion/react";
import { Cpu, Layout, Eye, Settings } from "lucide-react";

interface SkillsProps {
  portfolio: any;
}

export function Skills({ portfolio }: SkillsProps) {
  const skillsList = portfolio.skills || [];

  // Group skills by category
  const categories = [
    { id: "Languages & Core", label: "Languages & Core", icon: Cpu },
    { id: "CMS & Frameworks", label: "CMS & Frameworks", icon: Layout },
    { id: "Design & Testing", label: "Design & Testing", icon: Eye },
    { id: "SEO & Devops", label: "SEO & Devops", icon: Settings },
  ];

  return (
    <section id="skills" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>01b • Tech Stack</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Skills & <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">Core Tech</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            A specialized overview of technical competencies, design standards, and automation integrations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {categories.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            const catSkills = skillsList.filter((s: any) => s.category === cat.id);

            if (catSkills.length === 0) return null;

            return (
              <motion.div
                key={cat.id}
                className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-100/10 dark:border-slate-800/50 pb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                    {cat.label}
                  </h3>
                </div>

                {/* Skills progress list */}
                <div className="space-y-4">
                  {catSkills.map((skill: any, sIdx: number) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
                        <span className="text-cyan-500 dark:text-cyan-400 font-mono font-bold">
                          {skill.proficiency}%
                        </span>
                      </div>
                      {/* Bar Container */}
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-950/60 rounded-full overflow-hidden border border-slate-200/5 dark:border-slate-800/40">
                        {/* Fill */}
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: sIdx * 0.05 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
