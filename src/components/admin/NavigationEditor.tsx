import { useState, FormEvent } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

export default function NavigationEditor({ portfolio }: { portfolio: any }) {
  const [nav, setNav] = useState(portfolio.navigation || []);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updatedPortfolio = { ...portfolio, navigation: nav };
    if (savePortfolioContent(updatedPortfolio)) {
      setMessage({ type: "success", text: "Navigation updated successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to save." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h3 className="text-xl font-bold text-white">Navigation Settings</h3>
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
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
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
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
            />
            <button
              type="button"
              onClick={() => setNav(nav.filter((_: any, i: number) => i !== index))}
              className="p-2 text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setNav([...nav, { label: "", url: "" }])}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold text-white"
      >
        <Plus className="w-4 h-4" /> Add Link
      </button>
      <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-cyan-500 rounded-xl text-sm font-bold text-slate-950">
        <Save className="w-4 h-4" /> Save Navigation
      </button>
      {message.text && <p className={message.type === "success" ? "text-emerald-400" : "text-red-400"}>{message.text}</p>}
    </form>
  );
}
