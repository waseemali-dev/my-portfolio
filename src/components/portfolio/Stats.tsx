import { useEffect, useState, ReactNode } from "react";
import { motion } from "motion/react";
import { Award, CheckCircle2, Users, Layers } from "lucide-react";

interface StatItemProps {
  key?: any;
  value: number;
  suffix: string;
  label: string;
  icon: ReactNode;
  duration?: number;
}

function AnimatedStatCard({ value, suffix, label, icon, duration = 1500 }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group p-6 sm:p-8 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.02)] transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon Wrapper */}
      <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Number Display */}
      <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cyan-400 tracking-tight font-sans">
        {displayValue}
        <span className="text-cyan-300 font-extrabold">{suffix}</span>
      </h3>

      {/* Label */}
      <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
        {label}
      </p>
    </motion.div>
  );
}

interface StatsProps {
  portfolio: any;
}

export function Stats({ portfolio }: StatsProps) {
  const about = portfolio?.about || {};
  const statsData = [
    {
      value: Number(about.yearsOfExperience) || 8,
      suffix: "+",
      label: "Years Experience",
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      value: Number(about.projectsCompleted) || 200,
      suffix: "+",
      label: "Projects Completed",
      icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      value: Number(about.happyClients) || 75,
      suffix: "+",
      label: "Happy Clients",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      value: parseInt(about.responsiveLayouts) || 100,
      suffix: "%",
      label: "Responsive Layouts",
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  return (
    <section id="stats" className="relative py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header/Line (Subtle matching container) */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-12" />

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {statsData.map((stat, idx) => (
            <AnimatedStatCard
              key={idx}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
        
        {/* Footer subtle separator */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mt-12" />

      </div>
    </section>
  );
}
