import React, { useState } from "react";
import { Code, Trash2, Edit, Plus, Save, X, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface SkillsEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface SkillItem {
  name: string;
  category: "Languages & Core" | "CMS & Frameworks" | "Design & Testing" | "SEO & Devops";
  proficiency: number;
}

export default function SkillsEditor({ content, onUpdate }: SkillsEditorProps) {
  const [skills, setSkills] = useState<SkillItem[]>(content.skills || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Languages & Core" | "CMS & Frameworks" | "Design & Testing" | "SEO & Devops">("Languages & Core");
  const [proficiency, setProficiency] = useState(90);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setCategory("Languages & Core");
    setProficiency(90);
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    const item = skills[index];
    setName(item.name);
    setCategory(item.category);
    setProficiency(item.proficiency || 90);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = skills.filter((_, i) => i !== deleteIndex);
    saveSkillsList(updated, "Skill removed successfully!");
    setDeleteIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: "error", text: "Skill name is required." });
      return;
    }

    const newItem: SkillItem = {
      name: name.trim(),
      category,
      proficiency: Number(proficiency)
    };

    let updatedList = [...skills];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    saveSkillsList(updatedList, editingIndex !== null ? "Skill updated successfully!" : "Skill added successfully!");
    resetForm();
  };

  const saveSkillsList = (updatedList: SkillItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      skills: updatedList
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setSkills(updatedList);
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save skill modifications. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>Tech Stack & Skills ({skills.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Define specific skills, technologies, tools, and their proficiency levels.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        )}
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

      {/* Adding / Editing block */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              {editingIndex !== null ? (
                <>
                  <Edit className="w-4 h-4 text-cyan-400" />
                  <span>Edit Skill: {skills[editingIndex]?.name}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Define New Skill</span>
                </>
              )}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skill name */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Skill / Tech Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="React"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 cursor-pointer"
              >
                <option value="Languages & Core">Languages & Core</option>
                <option value="CMS & Frameworks">CMS & Frameworks</option>
                <option value="Design & Testing">Design & Testing</option>
                <option value="SEO & Devops">SEO & Devops</option>
              </select>
            </div>

            {/* Proficiency slider */}
            <div className="space-y-1.5 md:col-span-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Proficiency *</label>
                <span className="text-xs text-cyan-400 font-mono font-bold">{proficiency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-sm cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingIndex !== null ? "Apply Changes" : "Save Skill"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Listing grouped by category */}
      <div className="space-y-6">
        {skills.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
            No skills listed yet. Click on "Add Skill" to start.
          </div>
        ) : (
          ["Languages & Core", "CMS & Frameworks", "Design & Testing", "SEO & Devops"].map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-1">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {catSkills.map((skill) => {
                    const originalIdx = skills.findIndex((s) => s.name === skill.name && s.category === skill.category);
                    return (
                      <div
                        key={skill.name}
                        className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1 text-left min-w-0 flex-1">
                          <p className="font-bold text-white text-sm truncate">{skill.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-slate-850 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${skill.proficiency}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">{skill.proficiency}%</span>
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEdit(originalIdx)}
                            className="px-2 py-1 hover:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 transition-colors cursor-pointer border border-slate-850"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(originalIdx)}
                            className="p-1.5 hover:bg-red-500/15 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete Skill</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the skill <strong>{skills[deleteIndex]?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white cursor-pointer"
              >
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
