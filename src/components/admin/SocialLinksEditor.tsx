import { useState, FormEvent } from "react";
import { Share2, Save, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface SocialLinksEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

export default function SocialLinksEditor({ content, onUpdate }: SocialLinksEditorProps) {
  const [formData, setFormData] = useState({
    github: content.socialLinks?.github || "",
    linkedin: content.socialLinks?.linkedin || "",
    upwork: content.socialLinks?.upwork || "",
    fiverr: content.socialLinks?.fiverr || "",
    email: content.socialLinks?.email || ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    const updated = {
      ...content,
      socialLinks: {
        ...content.socialLinks,
        ...formData
      }
    };

    setTimeout(() => {
      const success = savePortfolioContent(updated);
      if (success) {
        onUpdate(updated);
        setMessage({ type: "success", text: "Social links updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save social links. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <span>Manage Social Links & Marketplaces</span>
          </h3>
          <p className="text-xs text-slate-400">
            Configure direct profile links for LinkedIn, GitHub, Fiverr, Upwork, and contact points.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              GitHub Profile Link
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="https://github.com/waseem-ali"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="https://linkedin.com/in/waseem-ali"
            />
          </div>

          {/* Upwork */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Upwork Profile Link
            </label>
            <input
              type="url"
              value={formData.upwork}
              onChange={(e) => setFormData({ ...formData, upwork: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="https://www.upwork.com/freelancers/~..."
            />
          </div>

          {/* Fiverr */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Fiverr Profile Link
            </label>
            <input
              type="url"
              value={formData.fiverr}
              onChange={(e) => setFormData({ ...formData, fiverr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="https://fiverr.com/waseem_ali"
            />
          </div>

          {/* Contact Email Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Direct Email Link (mailto:)
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="mailto:waseemdev99@gmail.com"
            />
          </div>
        </div>

        {/* Form actions */}
        <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Social Links</span>
          </button>
        </div>
      </form>
    </div>
  );
}
