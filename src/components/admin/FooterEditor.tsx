import { useState, FormEvent } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

export default function FooterEditor({ portfolio }: { portfolio: any }) {
  const [footer, setFooter] = useState(portfolio.footer || { copyrightText: "", links: [] });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updatedPortfolio = { ...portfolio, footer };
    if (savePortfolioContent(updatedPortfolio)) {
      setMessage({ type: "success", text: "Footer updated successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to save." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white">Footer Settings</h3>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Copyright Text</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
            placeholder={`© ${new Date().getFullYear()} Waseem Ali. All rights reserved.`}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Footer Links</label>
          {(footer.links || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...(footer.links || [])];
                  newLinks[index].label = e.target.value;
                  setFooter({ ...footer, links: newLinks });
                }}
                placeholder="Label (e.g., Privacy Policy)"
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...(footer.links || [])];
                  newLinks[index].url = e.target.value;
                  setFooter({ ...footer, links: newLinks });
                }}
                placeholder="URL"
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newLinks = (footer.links || []).filter((_: any, i: number) => i !== index);
                  setFooter({ ...footer, links: newLinks });
                }}
                className="p-2 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newLinks = [...(footer.links || []), { label: "", url: "" }];
              setFooter({ ...footer, links: newLinks });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Footer Link
          </button>
        </div>
      </div>

      <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-xl text-sm font-bold text-slate-950">
        <Save className="w-4 h-4" /> Save Footer
      </button>

      {message.text && <p className={message.type === "success" ? "text-emerald-400" : "text-red-400"}>{message.text}</p>}
    </form>
  );
}
