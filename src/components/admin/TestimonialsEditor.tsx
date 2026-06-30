import React, { useState } from "react";
import { MessageSquare, Trash2, Edit, Plus, Save, X, RefreshCw, Star } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface TestimonialsEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface TestimonialItem {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatarUrl: string;
  platform?: string;
  platformIconUrl?: string;
}

export default function TestimonialsEditor({ content, onUpdate }: TestimonialsEditorProps) {
  const [reviews, setReviews] = useState<TestimonialItem[]>(content.testimonials || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [platformIconUrl, setPlatformIconUrl] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setText("");
    setRating(5);
    setAvatarUrl("");
    setPlatform("");
    setPlatformIconUrl("");
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    const item = reviews[index];
    setName(item.name);
    setText(item.text);
    setRating(item.rating || 5);
    setAvatarUrl(item.avatarUrl || "");
    setPlatform(item.platform || "");
    setPlatformIconUrl(item.platformIconUrl || "");
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = reviews.filter((_, i) => i !== deleteIndex);
    saveReviewsList(updated, "Testimonial removed successfully!");
    setDeleteIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setMessage({ type: "error", text: "Client Name and Review text are required." });
      return;
    }

    const targetId = editingIndex !== null
      ? reviews[editingIndex].id
      : "t-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newReview: TestimonialItem = {
      id: targetId,
      name: name.trim(),
      text: text.trim(),
      rating: Number(rating),
      avatarUrl: avatarUrl.trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      platform: platform.trim(),
      platformIconUrl: platformIconUrl.trim()
    };

    let updatedList = [...reviews];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newReview;
    } else {
      updatedList.push(newReview);
    }

    saveReviewsList(updatedList, editingIndex !== null ? "Testimonial updated successfully!" : "Testimonial published!");
    resetForm();
  };

  const saveReviewsList = (updatedList: TestimonialItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      testimonials: updatedList
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setReviews(updatedList);
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save testimonials. Please try again." });
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
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Client Testimonials ({reviews.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Publish feedback, establish star recommendations, and upload client avatar links.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
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

      {/* Editor Pane */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              {editingIndex !== null ? (
                <>
                  <Edit className="w-4 h-4 text-cyan-400" />
                  <span>Edit Feedback from {reviews[editingIndex]?.name}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Publish New Review</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Client Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Gabriel Marguglio"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Avatar Image URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            {/* Star Rating select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Star Recommendation</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 cursor-pointer"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            {/* Platform Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Platform Name</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Fiverr or Upwork"
              />
            </div>

            {/* Platform Icon URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Platform Icon URL (Fiverr / Upwork Icon)</label>
              <input
                type="text"
                value={platformIconUrl}
                onChange={(e) => setPlatformIconUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png"
              />
            </div>

            {/* Text review */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Review Feedback Copy *</label>
              <textarea
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Waseem is an exceptional and highly skilled HubSpot CMS developer who delivered..."
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
              <span>{editingIndex !== null ? "Apply Changes" : "Publish Review"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
            No testimonials on catalog yet. Click "Add Testimonial" to write one.
          </div>
        ) : (
          reviews.map((rev, index) => (
            <div
              key={index}
              className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 transition-all text-left"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating || 5 }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit review"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="p-1 hover:bg-red-500/15 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed italic">"{rev.text}"</p>
              </div>

              {/* Client meta card */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-850/60">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-850 overflow-hidden shrink-0">
                  <img src={rev.avatarUrl} alt={rev.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs">{rev.name}</h5>
                  <p className="text-[10px] text-slate-500">
                    {rev.platform ? `Source: ${rev.platform}` : "Fiverr Client"}
                  </p>
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
            <h4 className="font-bold text-lg text-white">Delete Testimonial</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete review feedback from <strong>{reviews[deleteIndex]?.name}</strong>?
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
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
