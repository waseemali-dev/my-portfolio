import React, { useState } from "react";
import { Layers, Trash2, Edit, Plus, Save, X, RefreshCw, ArrowUp, ArrowDown, Star, CheckCircle } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";
import ImageUploadInput from "./ImageUploadInput";

import bostonBifImage from "../../assets/images/boston_bif_new_1782634821929.jpg";
import centersquareImage from "../../assets/images/centersquare_new_1782634843010.jpg";
import cypherLearningImage from "../../assets/images/cypher_learning_new_1782634864135.jpg";
import nextinyMarketingImage from "../../assets/images/nextiny_marketing_new_1782634890772.jpg";
import remoteTechImage from "../../assets/images/remote_tech_new_1782634917528.jpg";

const projectImages: Record<string, string> = {
  "boston-institute-finance": bostonBifImage,
  "centersquare": centersquareImage,
  "cypher-learning": cypherLearningImage,
  "nextiny-marketing": nextinyMarketingImage,
  "remote-technology": remoteTechImage,
};

const getProjectImage = (imgUrlOrKey: string) => {
  if (!imgUrlOrKey) return "";
  if (imgUrlOrKey.startsWith("http") || imgUrlOrKey.startsWith("/") || imgUrlOrKey.startsWith("data:")) {
    return imgUrlOrKey;
  }
  return projectImages[imgUrlOrKey] || imgUrlOrKey;
};

interface ProjectsEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  technologies: string[];
  category: "HubSpot CMS" | "Front-End" | "WordPress";
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export default function ProjectsEditor({ content, onUpdate }: ProjectsEditorProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(content.projects || []);
  const [header, setHeader] = useState({
    badge: content.projectsHeader?.badge || "Work",
    title: content.projectsHeader?.title || "Featured Projects",
    description: content.projectsHeader?.description || "Explore real implementations for global agencies, leading startups, and educational institutes."
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleHeaderSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProjectsList(projects, "Projects section header updated!");
  };

  // Helper to compress pre-existing giant base64 images
  const compressBase64Image = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str.startsWith("data:image/") || base64Str.length < 100000) {
        resolve(base64Str);
        return;
      }
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(base64Str);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        if (compressed.length < base64Str.length) {
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  React.useEffect(() => {
    const compressExisting = async () => {
      let changed = false;
      const updatedList = await Promise.all(
        projects.map(async (p) => {
          if (p.imageUrl && p.imageUrl.startsWith("data:image/") && p.imageUrl.length > 100000) {
            try {
              const compressed = await compressBase64Image(p.imageUrl);
              if (compressed.length < p.imageUrl.length) {
                changed = true;
                return { ...p, imageUrl: compressed };
              }
            } catch (err) {
              console.warn("Error compressing pre-existing project image:", p.title, err);
            }
          }
          return p;
        })
      );

      if (changed) {
        const updatedContent = {
          ...content,
          projects: updatedList,
        };
        setProjects(updatedList);
        savePortfolioContent(updatedContent);
        onUpdate(updatedContent);
        console.log("Automatically compressed giant base64 project images to free up storage space.");
      }
    };

    compressExisting();
  }, []);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"HubSpot CMS" | "Front-End" | "WordPress">("HubSpot CMS");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  
  const [techRaw, setTechRaw] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory("HubSpot CMS");
    setLiveUrl("");
    setImageUrl("");
    setFeatured(false);
    setTechRaw("");
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    const p = projects[index];
    setTitle(p.title);
    setCategory(p.category || "HubSpot CMS");
    setLiveUrl(p.liveUrl || "");
    setImageUrl(p.imageUrl || "");
    setFeatured(!!p.featured);
    setTechRaw((p.technologies || []).join(", "));
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = projects.filter((_, i) => i !== deleteIndex);
    saveProjectsList(updated, "Project deleted successfully!");
    setDeleteIndex(null);
  };

  // Reordering functions
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveProjectsList(updated, "Project order updated!");
  };

  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveProjectsList(updated, "Project order updated!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: "error", text: "Project Title is required." });
      return;
    }

    const targetId = editingIndex !== null
      ? projects[editingIndex].id
      : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const parsedTechs = techRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const updatedProject: ProjectItem = {
      id: targetId,
      title: title.trim(),
      category,
      liveUrl: liveUrl.trim(),
      imageUrl: imageUrl.trim(),
      featured,
      technologies: parsedTechs
    };

    let updatedList = [...projects];
    if (editingIndex !== null) {
      updatedList[editingIndex] = updatedProject;
    } else {
      updatedList.push(updatedProject);
    }

    saveProjectsList(updatedList, editingIndex !== null ? "Project updated successfully!" : "Project added successfully!");
    resetForm();
  };

  const saveProjectsList = (updatedList: ProjectItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      projects: updatedList,
      projectsHeader: header
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setProjects(updatedList);
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save portfolio changes. Please try again." });
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
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Manage Projects Portfolio ({projects.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Publish client case studies, configure details, and establish sorting order.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Case Study</span>
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

      {/* Section Header Editor */}
      <form onSubmit={handleHeaderSave} className="p-5 bg-slate-900 border border-slate-800/50 rounded-2xl space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-cyan-400" />
            <span>Section Header Settings</span>
          </span>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Header</span>
          </button>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Section Badge</label>
            <input
              type="text"
              value={header.badge}
              onChange={(e) => setHeader({ ...header, badge: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Work"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Section Title / Heading</label>
            <input
              type="text"
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Featured Projects"
            />
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Section Description / Subtitle</label>
            <textarea
              rows={2}
              value={header.description}
              onChange={(e) => setHeader({ ...header, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
              placeholder="Section subtitle..."
            />
          </div>
        </div>
      </form>

      {/* Editor Form Modal/Pane */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              {editingIndex !== null ? (
                <>
                  <Edit className="w-4 h-4 text-cyan-400" />
                  <span>Edit Project: {projects[editingIndex]?.title}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Create New Project Entry</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Boston Institute Of Finance"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Platform Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 cursor-pointer"
              >
                <option value="HubSpot CMS">HubSpot CMS</option>
                <option value="Front-End">Front-End</option>
                <option value="WordPress">WordPress</option>
              </select>
            </div>

            {/* Live URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Live Preview URL</label>
              <input
                type="text"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="https://www.bostonifi.com"
              />
            </div>

            {/* Image URL with direct upload support */}
            <div className="md:col-span-2">
              <ImageUploadInput
                id="imageUrl"
                label="Project Image Preview"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                placeholder="Paste public image link, or upload below"
              />
            </div>

            {/* Tech Tags */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Technologies Used (Comma separated)
              </label>
              <input
                type="text"
                value={techRaw}
                onChange={(e) => setTechRaw(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="HubSpot CMS, HubDB, HubL, JavaScript, SCSS"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2 md:col-span-2 py-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 bg-slate-950 accent-cyan-400 rounded cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer flex items-center gap-1.5 select-none">
                <Star className={`w-3.5 h-3.5 ${featured ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
                <span>Feature this project in Home sliders / Top selections</span>
              </label>
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
              <span>{editingIndex !== null ? "Apply Changes" : "Publish Project"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List with Sorting Order */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
            No projects added yet. Click on "Add New Case Study" to construct your catalog.
          </div>
        ) : (
          projects.map((proj, index) => (
            <div
              key={index}
              className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Image thumb preview */}
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {proj.imageUrl ? (
                    <img src={getProjectImage(proj.imageUrl)} alt={proj.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Layers className="w-6 h-6 text-slate-700" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-white text-base leading-none">{proj.title}</h4>
                    {proj.featured && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider border border-amber-400/20">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-semibold border border-slate-800/80">
                      {proj.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-lg truncate">{proj.description}</p>
                </div>
              </div>

              {/* Action columns: Reorder & modify */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-850 pt-3 md:pt-0 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move project up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === projects.length - 1}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move project down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1.5 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-850"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="p-2 hover:bg-red-500/15 rounded-xl text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete Project</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <strong>{projects[deleteIndex]?.title}</strong>? All case study data and results will be removed.
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
