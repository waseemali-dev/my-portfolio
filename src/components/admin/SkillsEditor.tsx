import React, { useState } from "react";
import { Code, Trash2, Edit, Plus, Save, X, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface SkillsEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface SkillItem {
  name: string;
  category: string;
  proficiency: number;
}

export default function SkillsEditor({ content, onUpdate }: SkillsEditorProps) {
  const [skills, setSkills] = useState<SkillItem[]>(content.skills || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  // Form states for add/edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Languages & Core");
  const [formProficiency, setFormProficiency] = useState(90);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Languages & Core",
    "CMS & Frameworks",
    "Design & Testing",
    "SEO & Devops"
  ];

  const resetForm = () => {
    setFormName("");
    setFormCategory("Languages & Core");
    setFormProficiency(90);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    const item = skills[index];
    setFormName(item.name);
    setFormCategory(item.category);
    setFormProficiency(item.proficiency);
    setEditingIndex(index);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updatedSkills = skills.filter((_, i) => i !== deleteIndex);
    saveSkills(updatedSkills, "Skill deleted successfully!");
    setDeleteIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setMessage({ type: "error", text: "Skill name is required." });
      return;
    }

    const newSkill: SkillItem = {
      name: formName.trim(),
      category: formCategory,
      proficiency: Number(formProficiency)
    };

    let updatedSkills = [...skills];
    if (editingIndex !== null) {
      updatedSkills[editingIndex] = newSkill;
    } else {
      updatedSkills.push(newSkill);
    }

    saveSkills(updatedSkills, editingIndex !== null ? "Skill updated successfully!" : "Skill added successfully!");
    resetForm();
  };

  const saveSkills = (updatedSkills: SkillItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      skills: updatedSkills
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setSkills(updatedSkills);
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save changes. Please try again." });
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>Manage Skills ({skills.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Add, update, or remove technical skills displayed on the homepage.
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

      {/* Editor / Addition Form */}
      <form onSubmit={handleSubmit} className="p-5 bg-slate-900 border border-slate-800/50 rounded-2xl space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          {editingIndex !== null ? (
            <>
              <Edit className="w-4 h-4 text-cyan-400" />
              <span>Edit Skill: {skills[editingIndex]?.name}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add New Skill</span>
            </>
          )}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skill Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-700"
              placeholder="e.g. React"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Proficiency Slider */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proficiency ({formProficiency}%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="100"
                value={formProficiency}
                onChange={(e) => setFormProficiency(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-1 border border-slate-850 rounded-md shrink-0">
                {formProficiency}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{editingIndex !== null ? "Update Skill" : "Add Skill"}</span>
          </button>
        </div>
      </form>

      {/* Skills list table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs font-bold uppercase bg-slate-900 border-b border-slate-800/80 text-slate-400">
            <tr>
              <th className="px-6 py-3.5 text-left">Skill Name</th>
              <th className="px-6 py-3.5 text-left">Category</th>
              <th className="px-6 py-3.5 text-center">Proficiency</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 bg-slate-950/40">
            {skills.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No skills added yet. Use the form above to add your first skill!
                </td>
              </tr>
            ) : (
              skills.map((skill, index) => (
                <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-white">{skill.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-[11px] font-semibold text-slate-400 border border-slate-800/60">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit skill"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="p-1.5 hover:bg-red-500/15 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete Skill</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the skill <strong>{skills[deleteIndex]?.name}</strong>? This action is immediate but can be reset back to default from the backup tab.
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
