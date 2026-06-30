import { LayoutDashboard, Layers, Code, Briefcase, MessageSquare, ShieldAlert, Sparkles, Database } from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface DashboardHomeProps {
  content: any;
  setActiveTab: (tab: AdminTab) => void;
}

export default function DashboardHome({ content, setActiveTab }: DashboardHomeProps) {
  const stats = [
    {
      label: "Portfolio Projects",
      value: content.projects?.length || 0,
      icon: Layers,
      color: "from-blue-500/10 to-indigo-500/10 text-indigo-400",
      tab: "projects" as AdminTab
    },
    {
      label: "Offered Services",
      value: content.services?.length || 0,
      icon: Briefcase,
      color: "from-fuchsia-500/10 to-pink-500/10 text-fuchsia-400",
      tab: "services" as AdminTab
    },
    {
      label: "Client Reviews",
      value: content.testimonials?.length || 0,
      icon: MessageSquare,
      color: "from-amber-500/10 to-orange-500/10 text-amber-400",
      tab: "testimonials" as AdminTab
    }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800/80 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Systems Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome Back, Waseem!
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Welcome to your personal portfolio workspace. From here, you can instantly modify text, experiences, technologies, services, and live links across your public website.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(stat.tab)}
              className="p-5 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl flex items-center justify-between group transition-all duration-200 cursor-pointer text-left"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                <p className="text-3xl font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Information Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Instructions */}
        <div className="lg:col-span-7 p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            <span>Operational Workflow</span>
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Since your website is a fully-optimized client-side React application with no external database overhead:
          </p>
          <ul className="space-y-3.5 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-cyan-400 font-bold shrink-0">1.</span>
              <span><strong>Instant Changes:</strong> Any saving operation updates your browser's local state immediately. You will see the update in action right away!</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400 font-bold shrink-0">2.</span>
              <span><strong>JSON Portability:</strong> To persist your edited contents permanently across devices or deployment environments (like Vercel), click on the <strong>JSON Import/Export</strong> tab, export your backup, and save it in the repository!</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400 font-bold shrink-0">3.</span>
              <span><strong>Lighthouse Optimization:</strong> Content loaded locally remains incredibly light, helping you maintain Waseem Ali's hallmark <strong>100% PageSpeed & SEO index status</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Security Warning Panel */}
        <div className="lg:col-span-5 p-6 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Security Advisory</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              This admin dashboard is equipped with an elegant browser-level authentication gate utilizing <strong>localStorage sessions</strong>.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              This configuration prevents unauthorized access in typical client-only sessions. For maximum security, never leak your credentials, and utilize the <strong>JSON backup features</strong> to save secure snapshots of your layout.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-500">
            <Database className="w-3.5 h-3.5" />
            <span>Data storage: Browser LocalStorage Cache</span>
          </div>
        </div>

      </div>
    </div>
  );
}
