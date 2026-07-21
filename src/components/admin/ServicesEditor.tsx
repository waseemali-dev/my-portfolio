import React, { useState } from "react";
import { Briefcase, Trash2, Edit, Plus, Save, X, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface ServicesEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  features: string[];
  iconName: string;
}

export default function ServicesEditor({ content, onUpdate }: ServicesEditorProps) {
  const [services, setServices] = useState<ServiceItem[]>(content.services || []);
  const [header, setHeader] = useState({
    badge: content.servicesHeader?.badge || "Services & Standards",
    title: content.servicesHeader?.title || "Services & Quality Standards",
    description: content.servicesHeader?.description || "High-impact specialized engineering and strategic implementation designed to scale your web presence and convert traffic."
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Form states for add/edit
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formIcon, setFormIcon] = useState("Code");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleHeaderSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      servicesHeader: header
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        onUpdate(updatedContent);
        setMessage({ type: "success", text: "Services section header updated!" });
      } else {
        setMessage({ type: "error", text: "Failed to save section header." });
      }
      setLoading(false);
    }, 300);
  };

  // Available icon aliases mapped back to UI
  const iconOptions = ["HubSpot", "Code", "Wordpress", "Mail", "RefreshCw", "Zap", "Layers", "Globe"];

  const getDefaultTags = (id: string): string[] => {
    if (id === "hubspot-cms") return ["HubL", "HubDB", "Drag & Drop", "CRM Forms"];
    if (id === "frontend") return ["React.js", "TypeScript", "Tailwind CSS", "GSAP"];
    if (id === "wordpress") return ["PHP Core", "ACF Blocks", "Custom Themes", "Security"];
    if (id === "email-template") return ["MJML / HTML", "Litmus Tested", "HubSpot Email"];
    if (id === "workflow-automation") return ["Zapier Automation", "Webhooks API", "Lead Scoring"];
    if (id === "performance-optimization") return ["Core Web Vitals", "GTmetrix Audit", "Asset Tuning"];
    return ["CMS Dev", "Front-End", "API Setup"];
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormTags("");
    setFormIcon("Code");
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    const item = services[index];
    setFormTitle(item.title);
    setFormDescription(item.description);
    const existingTags = item.tags && item.tags.length > 0 ? item.tags : getDefaultTags(item.id);
    setFormTags(existingTags.join(", "));
    setFormIcon(item.iconName || "Code");
    setEditingIndex(index);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updatedServices = services.filter((_, i) => i !== deleteIndex);
    saveServices(updatedServices, "Service deleted successfully!");
    setDeleteIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setMessage({ type: "error", text: "Title and description are required." });
      return;
    }

    const currentId = editingIndex !== null 
      ? services[editingIndex].id 
      : formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const parsedTags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newService: ServiceItem = {
      id: currentId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      tags: parsedTags.length > 0 ? parsedTags : getDefaultTags(currentId),
      features: editingIndex !== null ? services[editingIndex].features : [],
      iconName: formIcon
    };

    let updatedServices = [...services];
    if (editingIndex !== null) {
      updatedServices[editingIndex] = newService;
    } else {
      updatedServices.push(newService);
    }

    saveServices(updatedServices, editingIndex !== null ? "Service updated successfully!" : "Service added successfully!");
    resetForm();
  };

  const saveServices = (updatedServices: ServiceItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      services: updatedServices
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setServices(updatedServices);
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
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Manage Services ({services.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize the list of services and professional specialities offered.
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
              placeholder="e.g. Services & Standards"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Section Title / Heading</label>
            <input
              type="text"
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Services & Quality Standards"
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

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="p-5 bg-slate-900 border border-slate-800/50 rounded-2xl space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          {editingIndex !== null ? (
            <>
              <Edit className="w-4 h-4 text-cyan-400" />
              <span>Edit Service: {services[editingIndex]?.title}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add New Service</span>
            </>
          )}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Title</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-700"
              placeholder="e.g. WooCommerce Customization"
            />
          </div>

          {/* Icon Option */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Icon Accent</label>
            <select
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 cursor-pointer"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Description</label>
            <textarea
              required
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-700"
              placeholder="Provide a detailed, high-level summary of what is involved in this service pack..."
            />
          </div>

          {/* Micro Technology / Skill Tags */}
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technology / Skill Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-700"
              placeholder="e.g. HubL, HubDB, Drag & Drop, CRM Forms"
            />
            <p className="text-[11px] text-slate-500">
              These tags render as highlighted tech pills at the bottom of the service card.
            </p>
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
            <span>{editingIndex !== null ? "Update Service" : "Add Service"}</span>
          </button>
        </div>
      </form>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
            No services declared yet. Use the form above to declare your first service option.
          </div>
        ) : (
          services.map((service, index) => {
            const cardTags = service.tags && service.tags.length > 0 ? service.tags : getDefaultTags(service.id);
            return (
              <div
                key={index}
                className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                      Icon: {service.iconName}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="p-1 hover:bg-red-500/15 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-base">{service.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{service.description}</p>
                  
                  {/* Tag Chips Preview */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/60">
                    {cardTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
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
            <h4 className="font-bold text-lg text-white">Delete Service</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the service <strong>{services[deleteIndex]?.title}</strong>? This will remove it from display.
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
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
