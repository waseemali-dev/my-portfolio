import { useState, FormEvent } from "react";
import { Sparkles, Save, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface HeroEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

export default function HeroEditor({ content, onUpdate }: HeroEditorProps) {
  const [formData, setFormData] = useState({
    badge: content.hero?.badge || "",
    name: content.hero?.name || "",
    title: content.hero?.title || "",
    headline: content.hero?.headline || "",
    description: content.hero?.description || "",
    ctaText: content.hero?.ctaText || "",
    ctaLink: content.hero?.ctaLink || "",
    portfolioText: content.hero?.portfolioText || "",
    portfolioLink: content.hero?.portfolioLink || "",
    avatarUrl: content.hero?.avatarUrl || ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    // Validation
    if (!formData.name || !formData.title || !formData.headline || !formData.description) {
      setMessage({ type: "error", text: "Please fill out all required fields." });
      setLoading(false);
      return;
    }

    const updated = {
      ...content,
      hero: {
        ...content.hero,
        ...formData
      }
    };

    setTimeout(() => {
      const success = savePortfolioContent(updated);
      if (success) {
        onUpdate(updated);
        setMessage({ type: "success", text: "Hero section updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save Hero section content. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Edit Hero Section</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize Waseem's landing banner, slogans, buttons, and graphics.
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
          {/* Badge */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Badge Slogan
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. HubSpot Certified CMS Developer"
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Waseem Ali"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Professional Role/Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. Front-End & HubSpot CMS Developer"
            />
          </div>

          {/* Main Headline */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Main Landing Headline <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600 resize-none"
              placeholder="Coded banner layout text..."
            />
          </div>

          {/* Intro Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hero Slogan / Intro Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Short bio shown in the upper section of the homepage..."
            />
          </div>

          {/* Profile image URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile Avatar Image URL / Local Asset Path
            </label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Paste custom image URL, or leave blank to keep original"
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Button Text (CTA)
            </label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Hire Me Now"
            />
          </div>

          {/* CTA Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Button Link Target
            </label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="#contact"
            />
          </div>

          {/* Portfolio Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={formData.portfolioText}
              onChange={(e) => setFormData({ ...formData, portfolioText: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="View Portfolio"
            />
          </div>

          {/* Portfolio Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secondary Button Link Target
            </label>
            <input
              type="text"
              value={formData.portfolioLink}
              onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="#portfolio"
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
            <span>Save Hero Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
