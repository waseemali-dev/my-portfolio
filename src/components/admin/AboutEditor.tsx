import { useState, FormEvent } from "react";
import { User, Save, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";
import ImageUploadInput from "./ImageUploadInput";

interface AboutEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

export default function AboutEditor({ content, onUpdate }: AboutEditorProps) {
  const [formData, setFormData] = useState({
    badge: content.about?.badge || "",
    heading: content.about?.heading || "",
    description: content.about?.description || "",
    imageUrl: content.about?.imageUrl || "",
    calloutTitle: content.about?.calloutTitle || "",
    calloutDescription: content.about?.calloutDescription || "",
    yearsOfExperience: content.about?.yearsOfExperience ?? 8,
    projectsCompleted: content.about?.projectsCompleted ?? 85,
    happyClients: content.about?.happyClients ?? 50,
    responsiveLayouts: content.about?.responsiveLayouts || "100%",
    location: content.about?.location || "",
    skillsListRaw: (content.about?.skillsList || []).join(", "),
    widget1Title: content.about?.widget1Title || "CMS MASTER",
    widget1Value: content.about?.widget1Value || "HubSpot Elite",
    widget2Title: content.about?.widget2Title || "RATING",
    widget2Value: content.about?.widget2Value || "5.0 ★ Fiverr"
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!formData.heading || !formData.description) {
      setMessage({ type: "error", text: "Please fill out all required fields." });
      setLoading(false);
      return;
    }

    // Split skills list by comma
    const parsedSkillsList = formData.skillsListRaw
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s !== "");

    const updated = {
      ...content,
      about: {
        ...content.about,
        badge: formData.badge,
        heading: formData.heading,
        description: formData.description,
        imageUrl: formData.imageUrl,
        calloutTitle: formData.calloutTitle,
        calloutDescription: formData.calloutDescription,
        yearsOfExperience: Number(formData.yearsOfExperience),
        projectsCompleted: Number(formData.projectsCompleted),
        happyClients: Number(formData.happyClients),
        responsiveLayouts: formData.responsiveLayouts,
        location: formData.location,
        skillsList: parsedSkillsList,
        widget1Title: formData.widget1Title,
        widget1Value: formData.widget1Value,
        widget2Title: formData.widget2Title,
        widget2Value: formData.widget2Value
      }
    };

    setTimeout(() => {
      const success = savePortfolioContent(updated);
      if (success) {
        onUpdate(updated);
        setMessage({ type: "success", text: "About section updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save About section content. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Edit About Section</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize Waseem's bio description, location details, highlighted strengths, and animated counters.
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
              Badge Identifier
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="About Me"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Geographic Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Lahore, Pakistan"
            />
          </div>

          {/* Heading */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section Heading <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Your Reliable Remote Partner"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Main about paragraph..."
            />
          </div>

          {/* About Image with direct upload support */}
          <div className="md:col-span-2">
            <ImageUploadInput
              id="aboutImageUrl"
              label="About Section Profile Image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              placeholder="Paste custom image URL, or upload below (defaults to Hero avatar if left empty)"
            />
          </div>

          {/* Callout Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Callout Card Title
            </label>
            <input
              type="text"
              value={formData.calloutTitle}
              onChange={(e) => setFormData({ ...formData, calloutTitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Built for Smooth Collaboration"
            />
          </div>

          {/* Callout Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Callout Card Description
            </label>
            <textarea
              rows={3}
              value={formData.calloutDescription}
              onChange={(e) => setFormData({ ...formData, calloutDescription: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Callout narrative..."
            />
          </div>

          {/* Skills List Tag string */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Highlight Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skillsListRaw}
              onChange={(e) => setFormData({ ...formData, skillsListRaw: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. HubSpot CRM, SEO Optimization, UI Implementation"
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Years of Experience (Numeric)
            </label>
            <input
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
            />
          </div>

          {/* Projects Completed */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Projects Completed (Numeric)
            </label>
            <input
              type="number"
              value={formData.projectsCompleted}
              onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
            />
          </div>

          {/* Happy Clients */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Happy Clients (Numeric)
            </label>
            <input
              type="number"
              value={formData.happyClients}
              onChange={(e) => setFormData({ ...formData, happyClients: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
            />
          </div>

          {/* Responsive layouts percentage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Responsive layouts rate
            </label>
            <input
              type="text"
              value={formData.responsiveLayouts}
              onChange={(e) => setFormData({ ...formData, responsiveLayouts: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="100%"
            />
          </div>

          {/* Widget 1 Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Photo Widget 1 Label
            </label>
            <input
              type="text"
              value={formData.widget1Title}
              onChange={(e) => setFormData({ ...formData, widget1Title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. CMS MASTER"
            />
          </div>

          {/* Widget 1 Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Photo Widget 1 Value
            </label>
            <input
              type="text"
              value={formData.widget1Value}
              onChange={(e) => setFormData({ ...formData, widget1Value: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. HubSpot Elite"
            />
          </div>

          {/* Widget 2 Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Photo Widget 2 Label
            </label>
            <input
              type="text"
              value={formData.widget2Title}
              onChange={(e) => setFormData({ ...formData, widget2Title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. RATING"
            />
          </div>

          {/* Widget 2 Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Photo Widget 2 Value
            </label>
            <input
              type="text"
              value={formData.widget2Value}
              onChange={(e) => setFormData({ ...formData, widget2Value: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="e.g. 5.0 ★ Fiverr"
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
            <span>Save About Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
