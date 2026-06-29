import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { FileJson, Download, Upload, RefreshCw, AlertTriangle, FileUp, Copy, Check } from "lucide-react";
import { getPortfolioContent, exportPortfolioContent, importPortfolioContent, resetPortfolioContent } from "../../utils/contentStorage";

interface JsonImportExportProps {
  onUpdate: (updatedContent: any) => void;
}

export default function JsonImportExport({ onUpdate }: JsonImportExportProps) {
  const [jsonString, setJsonString] = useState(JSON.stringify(getPortfolioContent(), null, 2));
  const [message, setMessage] = useState({ type: "", text: "" });
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    setMessage({ type: "", text: "" });
    const success = exportPortfolioContent();
    if (success) {
      setMessage({ type: "success", text: "Portfolio JSON exported successfully. Check your browser downloads!" });
    } else {
      setMessage({ type: "error", text: "Failed to export JSON file. Please try again." });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processImport = (rawContent: string) => {
    setMessage({ type: "", text: "" });
    const res = importPortfolioContent(rawContent);
    if (res.success) {
      const refreshedContent = getPortfolioContent();
      onUpdate(refreshedContent);
      setJsonString(JSON.stringify(refreshedContent, null, 2));
      setMessage({ type: "success", text: "JSON import was successful! Your public website is now synchronized." });
    } else {
      setMessage({ type: "error", text: `Import failed: ${res.error}` });
    }
  };

  const handleManualImportSubmit = () => {
    processImport(jsonString);
  };

  // Drag and Drop Handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "Please upload a valid .json file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        processImport(text);
      }
    };
    reader.onerror = () => {
      setMessage({ type: "error", text: "Error reading uploaded file." });
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleResetConfirm = () => {
    resetPortfolioContent();
    const refreshed = getPortfolioContent();
    onUpdate(refreshed);
    setJsonString(JSON.stringify(refreshed, null, 2));
    setMessage({ type: "success", text: "Portfolio restored to default hardcoded configurations!" });
    setShowResetConfirm(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileJson className="w-5 h-5 text-cyan-400" />
            <span>JSON Backup, Import & Reset</span>
          </h3>
          <p className="text-xs text-slate-400">
            Export a backup file, import structured JSON, or reset back to default settings.
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

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Quick Actions & Upload Area */}
        <div className="space-y-6">
          
          {/* Export card */}
          <div className="p-5 bg-slate-900 border border-slate-800/60 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Content Backup</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Downloads a formatted `.json` file containing your current portfolio configuration. You can save this file securely, or use it to replace the hardcoded content inside the project repository manually.
            </p>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup File</span>
            </button>
          </div>

          {/* Upload Drag and Drop zone */}
          <div
            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-3 transition-colors ${
              dragActive
                ? "border-cyan-400 bg-cyan-500/5 text-cyan-300"
                : "border-slate-800 hover:border-slate-700 text-slate-400 bg-slate-900/40"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850">
              <FileUp className="w-6 h-6 text-slate-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Drag & drop your backup .json file</p>
              <p className="text-[11px] text-slate-500">or click to browse from explorer</p>
            </div>
            <button
              type="button"
              onClick={triggerFileSelect}
              className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Select JSON File
            </button>
          </div>

          {/* Revert / Reset Button */}
          <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Reset Portfolio Content</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clears all modifications saved in this browser and reverts the website instantly to the original default hardcoded configurations. This cannot be undone unless you have a backup downloaded!
            </p>
            {showResetConfirm ? (
              <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                <button
                  onClick={handleResetConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Yes, Revert Content
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>
            )}
          </div>

        </div>

        {/* Right column: Raw Code editor copy/paste paste zone */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Raw JSON Sandbox Data
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Copy JSON Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            className="flex-1 min-h-[360px] p-4 bg-slate-900 border border-slate-850 rounded-2xl font-mono text-xs text-slate-300 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            spellCheck="false"
          />
          <button
            onClick={handleManualImportSubmit}
            className="w-full py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 text-cyan-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Apply Raw JSON Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
}
