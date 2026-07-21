import React, { useState } from "react";
import { MessageSquare, Trash2, Edit, Plus, Save, X, RefreshCw } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface FAQEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQEditor({ content, onUpdate }: FAQEditorProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(content.faqs || []);
  const [header, setHeader] = useState({
    badge: content.faqsHeader?.badge || "FAQ Directory",
    title: content.faqsHeader?.title || "Frequently Asked Questions",
    description: content.faqsHeader?.description || "Get answers to deployment timelines, HubSpot configurations, and agency scaling questions."
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleHeaderSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFAQList(faqs, "FAQ section header updated!");
  };

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    const item = faqs[index];
    setQuestion(item.question);
    setAnswer(item.answer);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = faqs.filter((_, i) => i !== deleteIndex);
    saveFAQList(updated, "FAQ entry removed successfully!");
    setDeleteIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setMessage({ type: "error", text: "Question and Answer are required fields." });
      return;
    }

    const newItem: FAQItem = {
      question: question.trim(),
      answer: answer.trim()
    };

    let updatedList = [...faqs];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    saveFAQList(updatedList, editingIndex !== null ? "FAQ updated successfully!" : "FAQ added successfully!");
    resetForm();
  };

  const saveFAQList = (updatedList: FAQItem[], successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      faqs: updatedList,
      faqsHeader: header
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        setFaqs(updatedList);
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save FAQ modifications. Please try again." });
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
            <span>Frequently Asked Questions ({faqs.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Provide concise, informative answers to common agency, developer, and service-level queries.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
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
              placeholder="e.g. FAQ Directory"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Section Title / Heading</label>
            <input
              type="text"
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Frequently Asked Questions"
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

      {/* Editing block */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              {editingIndex !== null ? (
                <>
                  <Edit className="w-4 h-4 text-cyan-400" />
                  <span>Edit FAQ Entry</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Add New Question</span>
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

          <div className="space-y-6">
            {/* Question */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Question Text *</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="What type of projects do you take?"
              />
            </div>

            {/* Answer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Detailed Answer *</label>
              <textarea
                rows={4}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 leading-relaxed"
                placeholder="I specialize in custom HubSpot themes..."
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
              <span>{editingIndex !== null ? "Apply Changes" : "Save Question"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Listing */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
            No FAQ entries listed yet. Click on "Add FAQ" to start.
          </div>
        ) : (
          faqs.map((item, index) => (
            <div
              key={index}
              className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-1.5 text-left flex-1">
                <h4 className="font-bold text-white text-base">{item.question}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.answer}</p>
              </div>

              <div className="flex gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-3 py-1.5 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-850"
                >
                  Edit FAQ
                </button>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="p-2 hover:bg-red-500/15 rounded-xl text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete FAQ Entry</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete this FAQ entry?
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
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
