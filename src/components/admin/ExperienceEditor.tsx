import React, { useState } from "react";
import { History, Trash2, Edit, Plus, Save, X, RefreshCw, GraduationCap, Award } from "lucide-react";
import { savePortfolioContent } from "../../utils/contentStorage";

interface ExperienceEditorProps {
  content: any;
  onUpdate: (updatedContent: any) => void;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  current?: boolean;
}

interface CertificationItem {
  id: string;
  name: string;
  authority: string;
  status: string;
}

export default function ExperienceEditor({ content, onUpdate }: ExperienceEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"experience" | "education" | "certifications">("experience");

  // EXPERIENCE STATES
  const [items, setItems] = useState<ExperienceItem[]>(content.experience || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Experience Form states
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [period, setPeriod] = useState("");
  const [current, setCurrent] = useState(false);
  const [bulletsRaw, setBulletsRaw] = useState("");

  // EDUCATION STATES
  const [education, setEducation] = useState({
    degree: content.education?.degree || "Bachelor of Science in Computer Science (BSCS)",
    institution: content.education?.institution || "Federal Urdu University of Arts, Science & Technology",
    period: content.education?.period || "Sep 2011 to Sep 2015",
    details: content.education?.details || ""
  });

  // CERTIFICATIONS STATES
  const [certs, setCerts] = useState<CertificationItem[]>(content.certifications || [
    {
      id: "hubspot-cms-dev",
      name: "HubSpot CMS for Developers",
      authority: "HubSpot Academy",
      status: "Active & Verified Expert"
    }
  ]);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [deleteCertIndex, setDeleteCertIndex] = useState<number | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Cert Form states
  const [certName, setCertName] = useState("");
  const [certAuthority, setCertAuthority] = useState("");
  const [certStatus, setCertStatus] = useState("");

  // GENERAL
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // RESET METHODS
  const resetForm = () => {
    setRole("");
    setCompany("");
    setLocation("");
    setPeriod("");
    setCurrent(false);
    setBulletsRaw("");
    setEditingIndex(null);
    setIsAdding(false);
  };

  const resetCertForm = () => {
    setCertName("");
    setCertAuthority("");
    setCertStatus("");
    setEditingCertIndex(null);
    setIsAddingCert(false);
  };

  // EXPERIENCE HANDLERS
  const handleEdit = (index: number) => {
    const item = items[index];
    setRole(item.role);
    setCompany(item.company);
    setLocation(item.location || "");
    setPeriod(item.period);
    setCurrent(!!item.current);
    setBulletsRaw((item.description || []).join("\n"));
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = items.filter((_, i) => i !== deleteIndex);
    saveTimelineData({ experience: updated }, "Experience entry deleted successfully!");
    setItems(updated);
    setDeleteIndex(null);
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim() || !period.trim()) {
      setMessage({ type: "error", text: "Role, Company, and Period are required fields." });
      return;
    }

    const currentId = editingIndex !== null
      ? items[editingIndex].id
      : company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const parsedBullets = bulletsRaw
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b !== "");

    const newItem: ExperienceItem = {
      id: currentId,
      role: role.trim(),
      company: company.trim(),
      location: location.trim(),
      period: period.trim(),
      current,
      description: parsedBullets
    };

    let updatedList = [...items];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    saveTimelineData({ experience: updatedList }, editingIndex !== null ? "Experience updated successfully!" : "Experience added successfully!");
    setItems(updatedList);
    resetForm();
  };

  // EDUCATION SUBMIT
  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!education.degree.trim() || !education.institution.trim() || !education.period.trim()) {
      setMessage({ type: "error", text: "Degree, Institution, and Period are required." });
      return;
    }

    saveTimelineData({ education }, "Education details updated successfully!");
  };

  // CERTIFICATION HANDLERS
  const handleEditCert = (index: number) => {
    const item = certs[index];
    setCertName(item.name);
    setCertAuthority(item.authority);
    setCertStatus(item.status);
    setEditingCertIndex(index);
    setIsAddingCert(true);
  };

  const handleDeleteCertClick = (index: number) => {
    setDeleteCertIndex(index);
  };

  const confirmDeleteCert = () => {
    if (deleteCertIndex === null) return;
    const updated = certs.filter((_, i) => i !== deleteCertIndex);
    saveTimelineData({ certifications: updated }, "Certification deleted successfully!");
    setCerts(updated);
    setDeleteCertIndex(null);
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certAuthority.trim() || !certStatus.trim()) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    const currentId = editingCertIndex !== null
      ? certs[editingCertIndex].id
      : certName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newItem: CertificationItem = {
      id: currentId,
      name: certName.trim(),
      authority: certAuthority.trim(),
      status: certStatus.trim()
    };

    let updatedList = [...certs];
    if (editingCertIndex !== null) {
      updatedList[editingCertIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    saveTimelineData({ certifications: updatedList }, editingCertIndex !== null ? "Certification updated successfully!" : "Certification added successfully!");
    setCerts(updatedList);
    resetCertForm();
  };

  // SAVE CORE METHOD
  const saveTimelineData = (dataBlock: any, successMsg: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updatedContent = {
      ...content,
      ...dataBlock
    };

    setTimeout(() => {
      const success = savePortfolioContent(updatedContent);
      if (success) {
        onUpdate(updatedContent);
        setMessage({ type: "success", text: successMsg });
      } else {
        setMessage({ type: "error", text: "Failed to save updates. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      
      {/* Tab select header */}
      <div className="border-b border-slate-800/80 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Timeline & Academic Management</span>
          </h3>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/60 self-start">
            <button
              onClick={() => { setActiveSubTab("experience"); setMessage({ type: "", text: "" }); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeSubTab === "experience" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
            >
              Experience
            </button>
            <button
              onClick={() => { setActiveSubTab("education"); setMessage({ type: "", text: "" }); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeSubTab === "education" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
            >
              Education
            </button>
            <button
              onClick={() => { setActiveSubTab("certifications"); setMessage({ type: "", text: "" }); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeSubTab === "certifications" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
            >
              Certifications
            </button>
          </div>
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

      {/* RENDER EXPERIENCE TAB */}
      {activeSubTab === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Chronicle your professional work history timeline.
            </p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            )}
          </div>

          {isAdding && (
            <form onSubmit={handleExperienceSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  {editingIndex !== null ? (
                    <>
                      <Edit className="w-4 h-4 text-cyan-400" />
                      <span>Edit Experience at {items[editingIndex]?.company}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Position</span>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Job Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="HubSpot CMS Developer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="Computan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="Lahore, Pakistan (Hybrid)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Period / Term *</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="Jun 2021 to Present"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Responsibilities / Bullet Points (One per line)</label>
                  <textarea
                    rows={5}
                    required
                    value={bulletsRaw}
                    onChange={(e) => setBulletsRaw(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500 font-mono text-xs"
                    placeholder="Architect and code premium templates...&#10;Optimize Core Web Vitals..."
                  />
                </div>

                <div className="flex items-center gap-2 md:col-span-2 py-1">
                  <input
                    type="checkbox"
                    id="current"
                    checked={current}
                    onChange={(e) => setCurrent(e.target.checked)}
                    className="w-4 h-4 bg-slate-950 accent-cyan-400 rounded cursor-pointer"
                  />
                  <label htmlFor="current" className="text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer select-none">
                    I am currently employed in this role
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
                  <span>{editingIndex !== null ? "Apply Changes" : "Save Position"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Experience list */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
                No experiences listed yet. Click on "Add Position" to start.
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-white text-base leading-none">{item.role}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-semibold border border-slate-800/80">
                        {item.company}
                      </span>
                      {item.current && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                          Current Job
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 text-xs text-slate-400 font-medium">
                      <span>📅 {item.period}</span>
                      {item.location && <span>📍 {item.location}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-850 pt-3 md:pt-0 shrink-0">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1.5 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-850"
                    >
                      Edit
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
        </div>
      )}

      {/* RENDER EDUCATION TAB */}
      {activeSubTab === "education" && (
        <form onSubmit={handleEducationSubmit} className="space-y-6">
          <p className="text-xs text-slate-400">
            Define your academic background and formal degree details.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Degree / Certification Title *</label>
              <input
                type="text"
                required
                value={education.degree}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Bachelor of Science in Computer Science (BSCS)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Institution / University *</label>
              <input
                type="text"
                required
                value={education.institution}
                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Federal Urdu University"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Enrollment Term / Period *</label>
              <input
                type="text"
                required
                value={education.period}
                onChange={(e) => setEducation({ ...education, period: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Sep 2011 to Sep 2015"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Additional Details / Highlights (Optional)</label>
              <input
                type="text"
                value={education.details}
                onChange={(e) => setEducation({ ...education, details: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                placeholder="Graduated with Honors, focused on software engineering"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Education</span>
            </button>
          </div>
        </form>
      )}

      {/* RENDER CERTIFICATIONS TAB */}
      {activeSubTab === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Manage your dynamic credentials, licenses, and certified achievements.
            </p>
            {!isAddingCert && (
              <button
                onClick={() => setIsAddingCert(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            )}
          </div>

          {isAddingCert && (
            <form onSubmit={handleCertSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  {editingCertIndex !== null ? (
                    <>
                      <Edit className="w-4 h-4 text-cyan-400" />
                      <span>Edit Certification</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Certification</span>
                    </>
                  )}
                </h4>
                <button
                  type="button"
                  onClick={resetCertForm}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="HubSpot CMS for Developers"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Issuing Authority *</label>
                  <input
                    type="text"
                    required
                    value={certAuthority}
                    onChange={(e) => setCertAuthority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="HubSpot Academy"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Status / Expiry Info *</label>
                  <input
                    type="text"
                    required
                    value={certStatus}
                    onChange={(e) => setCertStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500"
                    placeholder="Active & Verified Expert"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetCertForm}
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
                  <span>{editingCertIndex !== null ? "Apply Changes" : "Save Certification"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Certifications list */}
          <div className="space-y-4">
            {certs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800 rounded-2xl">
                No certifications listed yet. Click on "Add Certification" to start.
              </div>
            ) : (
              certs.map((item, index) => (
                <div
                  key={index}
                  className="p-5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
                >
                  <div className="space-y-1 text-left flex-1">
                    <h4 className="font-bold text-white text-base">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.authority} • {item.status}</p>
                  </div>

                  <div className="flex gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleEditCert(index)}
                      className="px-3 py-1.5 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-850"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCertClick(index)}
                      className="p-2 hover:bg-red-500/15 rounded-xl text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Experience Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete Experience</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete this experience entry at <strong>{items[deleteIndex]?.company}</strong>?
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

      {/* Delete Certification Modal */}
      {deleteCertIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-lg text-white">Delete Certification</h4>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the certification <strong>{certs[deleteCertIndex]?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCertIndex(null)}
                className="px-4 py-2 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCert}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white cursor-pointer"
              >
                Delete Certification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
