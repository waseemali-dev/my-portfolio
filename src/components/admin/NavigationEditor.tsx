import { useState, FormEvent } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";
import ImageUploadInput from "./ImageUploadInput";

export default function NavigationEditor({ portfolio }: { portfolio: any }) {
  const [nav, setNav] = useState(portfolio.navigation || []);
  const [headerConfig, setHeaderConfig] = useState({
    logoType: portfolio.header?.logoType || "image",
    logoImageUrl: portfolio.header?.logoImageUrl || "/src/assets/images/waseem-dev.png",
    logoText: portfolio.header?.logoText || "Waseem",
    logoSpan: portfolio.header?.logoSpan || ".dev",
    faviconUrl: portfolio.header?.faviconUrl || "/src/assets/images/waseem-dev.png",
    ctaText: portfolio.header?.ctaText || "Hire Me",
    ctaLink: portfolio.header?.ctaLink || "#contact"
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updatedPortfolio = { ...portfolio, navigation: nav, header: headerConfig };
    if (savePortfolioContent(updatedPortfolio)) {
      setMessage({ type: "success", text: "Header & Navigation updated successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to save." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white">Header & Logo Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo Type</label>
            <select
              value={headerConfig.logoType}
              onChange={(e) => setHeaderConfig({ ...headerConfig, logoType: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="image">Image Logo</option>
              <option value="text">SVG/Text Logo</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo Text (Fallback)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={headerConfig.logoText}
                onChange={(e) => setHeaderConfig({ ...headerConfig, logoText: e.target.value })}
                placeholder="Waseem"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={headerConfig.logoSpan}
                onChange={(e) => setHeaderConfig({ ...headerConfig, logoSpan: e.target.value })}
                placeholder=".dev"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo Image</label>
            <ImageUploadInput
              label="Logo Image"
              value={headerConfig.logoImageUrl}
              onChange={(val) => setHeaderConfig({ ...headerConfig, logoImageUrl: val })}
              placeholder="e.g. /src/assets/images/waseem-dev.png"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Favicon Image</label>
            <ImageUploadInput
              label="Favicon Image"
              value={headerConfig.faviconUrl}
              onChange={(val) => setHeaderConfig({ ...headerConfig, faviconUrl: val })}
              placeholder="e.g. /src/assets/images/waseem-dev.png"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CTA Button Text</label>
            <input
              type="text"
              value={headerConfig.ctaText}
              onChange={(e) => setHeaderConfig({ ...headerConfig, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CTA Button Link</label>
            <input
              type="text"
              value={headerConfig.ctaLink}
              onChange={(e) => setHeaderConfig({ ...headerConfig, ctaLink: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white">Navigation Links</h3>
        <div className="space-y-4">
          {nav.map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const newNav = [...nav];
                  newNav[index].label = e.target.value;
                  setNav(newNav);
                }}
                placeholder="Label"
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const newNav = [...nav];
                  newNav[index].url = e.target.value;
                  setNav(newNav);
                }}
                placeholder="URL"
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setNav(nav.filter((_: any, i: number) => i !== index))}
                className="p-2 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setNav([...nav, { label: "", url: "" }])}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold text-white hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-xl text-sm font-bold text-slate-950">
        <Save className="w-4 h-4" /> Save Header & Navigation
      </button>

      {message.text && <p className={message.type === "success" ? "text-emerald-400" : "text-red-400"}>{message.text}</p>}
    </form>
  );
}
