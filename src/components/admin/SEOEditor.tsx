import React, { useState } from "react";
import { Globe, Save, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";
import ImageUploadInput from "./ImageUploadInput";

interface SEOEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

export default function SEOEditor({ content, onUpdate }: SEOEditorProps) {
  const [formData, setFormData] = useState({
    title: content.seo?.title || "Waseem Ali | Front-End & HubSpot CMS Developer Portfolio",
    description: content.seo?.description || "Certified HubSpot CMS & Front-End Developer. Specialist in building fast, custom HubSpot themes, high-converting WordPress sites, and semantic React frontends.",
    keywords: content.seo?.keywords || "HubSpot CMS, Front-End Developer, HubSpot Developer, WordPress Developer, React, Web Performance, Core Web Vitals, Lahore, Pakistan",
    author: content.seo?.author || "Waseem Ali",
    favicon: content.seo?.favicon || "/favicon.ico",
    ogTitle: content.seo?.ogTitle || "",
    ogDescription: content.seo?.ogDescription || "",
    ogImage: content.seo?.ogImage || "",
    socialSharingImage: content.seo?.socialSharingImage || ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      seo: {
        title: formData.title.trim(),
        description: formData.description.trim(),
        keywords: formData.keywords.trim(),
        author: formData.author.trim(),
        favicon: formData.favicon.trim(),
        ogTitle: formData.ogTitle.trim(),
        ogDescription: formData.ogDescription.trim(),
        ogImage: formData.ogImage.trim(),
        socialSharingImage: formData.socialSharingImage.trim()
      }
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        onUpdate(updatedContent);
        setMessage({ type: "success", text: "SEO Metadata & Favicon saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save SEO metadata modifications. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>SEO Metadata Settings</span>
          </h3>
          <p className="text-xs text-slate-400">
            Configure how your portfolio website appears on Google, Bing, social sharing cards, and browser tabs.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Metadata</span>
        </button>
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

      <div className="grid grid-cols-1 gap-6">
        {/* SEO Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">SEO Browser Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
            placeholder="Waseem Ali | Front-End & HubSpot CMS Developer"
          />
          <p className="text-[10px] text-slate-500">Recommended length: 50-60 characters.</p>
        </div>

        {/* Website Favicon */}
        <div className="space-y-1.5">
          <ImageUploadInput
            id="favicon"
            label="Website Favicon"
            value={formData.favicon}
            onChange={(url) => setFormData({ ...formData, favicon: url })}
            placeholder="Paste custom favicon URL or upload below"
          />
          <p className="text-[10px] text-slate-500">Recommended format: Square .ico, .png, or .svg image.</p>
        </div>

        {/* SEO Author */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Author Name *</label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
            placeholder="Waseem Ali"
          />
        </div>

        {/* SEO Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Meta Description *</label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 leading-relaxed"
            placeholder="Certified HubSpot CMS and Front-End Developer with experience building fast, responsive, and SEO-friendly sites..."
          />
          <p className="text-[10px] text-slate-500">Recommended length: 150-160 characters for optimal Google Snippet rendering.</p>
        </div>

        {/* SEO Keywords */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Keywords (Comma-separated)</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
            placeholder="HubSpot CMS, Front-End, HubSpot Developer, React"
          />
        </div>

        {/* OG Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Open Graph Title</label>
          <input
            type="text"
            value={formData.ogTitle}
            onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
            placeholder="Open Graph Title"
          />
        </div>

        {/* OG Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Open Graph Description</label>
          <textarea
            rows={2}
            value={formData.ogDescription}
            onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
            placeholder="Open Graph Description"
          />
        </div>

        {/* OG Image */}
        <div className="space-y-1.5">
          <ImageUploadInput
            id="ogImage"
            label="Open Graph Image"
            value={formData.ogImage}
            onChange={(url) => setFormData({ ...formData, ogImage: url })}
            placeholder="Paste OG image URL or upload below"
          />
        </div>

        {/* Social Sharing Image */}
        <div className="space-y-1.5">
          <ImageUploadInput
            id="socialSharingImage"
            label="Social Sharing Image"
            value={formData.socialSharingImage}
            onChange={(url) => setFormData({ ...formData, socialSharingImage: url })}
            placeholder="Paste social sharing image URL or upload below"
          />
        </div>
      </div>
    </form>
  );
}
