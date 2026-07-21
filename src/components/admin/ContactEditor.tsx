import { useState, FormEvent } from "react";
import { Mail, Save, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface ContactEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

export default function ContactEditor({ content, onUpdate }: ContactEditorProps) {
  const [formData, setFormData] = useState({
    badge: content.contact?.badge || "",
    heading: content.contact?.heading || "",
    description: content.contact?.description || "",
    email: content.contact?.email || "",
    phone: content.contact?.phone || "",
    ctaTitle: content.contact?.ctaTitle || "",
    ctaDescription: content.contact?.ctaDescription || "",
    ctaButton1Text: content.contact?.ctaButton1Text || "Hire Me Now",
    ctaButton1Link: content.contact?.ctaButton1Link || "#contact",
    ctaButton2Text: content.contact?.ctaButton2Text || "Discuss Your Project",
    ctaButton2Link: content.contact?.ctaButton2Link || "#contact"
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!formData.email || !formData.heading) {
      setMessage({ type: "error", text: "Contact Heading and Email are required." });
      setLoading(false);
      return;
    }

    const updated = {
      ...content,
      contact: {
        ...content.contact,
        ...formData
      }
    };

    setTimeout(() => {
      const success = savePortfolioContent(updated);
      if (success) {
        onUpdate(updated);
        setMessage({ type: "success", text: "Contact details updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save contact details. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Edit Contact Section</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize Waseem's public email address, phone, contact prompts, and call-to-action headers.
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
              placeholder="Contact"
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
              placeholder="Let's Build Something Awesome!"
            />
          </div>

          {/* Slogan Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Contact pitch copy..."
            />
          </div>

          {/* Public Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Public Contact Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="waseemdev99@gmail.com"
            />
          </div>

          {/* Public Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Public Contact Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="+92 312 4567890"
            />
          </div>

          {/* CTA Banner Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              CTA Banner Title
            </label>
            <input
              type="text"
              value={formData.ctaTitle}
              onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Ready to scale your CMS implementation?"
            />
          </div>

          {/* CTA Banner Slogan */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              CTA Banner Slogan
            </label>
            <textarea
              rows={2}
              value={formData.ctaDescription}
              onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Banner copy..."
            />
          </div>

          {/* Primary CTA Button Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Button Text
            </label>
            <input
              type="text"
              value={formData.ctaButton1Text}
              onChange={(e) => setFormData({ ...formData, ctaButton1Text: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Hire Me Now"
            />
          </div>

          {/* Primary CTA Button Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Button Link
            </label>
            <input
              type="text"
              value={formData.ctaButton1Link}
              onChange={(e) => setFormData({ ...formData, ctaButton1Link: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="#contact"
            />
          </div>

          {/* Secondary CTA Button Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={formData.ctaButton2Text}
              onChange={(e) => setFormData({ ...formData, ctaButton2Text: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Discuss Your Project"
            />
          </div>

          {/* Secondary CTA Button Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secondary Button Link
            </label>
            <input
              type="text"
              value={formData.ctaButton2Link}
              onChange={(e) => setFormData({ ...formData, ctaButton2Link: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="#contact"
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
            <span>Save Contact Info</span>
          </button>
        </div>
      </form>
    </div>
  );
}
