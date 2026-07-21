import { useState, FormEvent } from "react";
import { Save } from "lucide-react";
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
    <form onSubmit={handleSave} className="space-y-6">
      <h3 className="text-xl font-bold text-white">Footer Settings</h3>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Copyright Text</label>
        <input
          type="text"
          value={footer.copyrightText}
          onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
        />
      </div>
      <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-cyan-500 rounded-xl text-sm font-bold text-slate-950">
        <Save className="w-4 h-4" /> Save Footer
      </button>
      {message.text && <p className={message.type === "success" ? "text-emerald-400" : "text-red-400"}>{message.text}</p>}
    </form>
  );
}
