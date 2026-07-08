import React, { useState, useRef, DragEvent } from "react";
import { Upload, FileImage, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

interface ImageUploadInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function ImageUploadInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Paste custom image URL or upload directly"
}: ImageUploadInputProps) {
  const [showUrlInput, setShowUrlInput] = useState(() => {
    // If the value is a remote URL (starts with http and not from local uploads), show the URL input on mount
    return value ? value.startsWith("http") && !value.includes("uploads") : false;
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      setUploadSuccess(false);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onChange(data.url);
        setUploadSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(data.error || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Network error. Could not upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        {value && (
          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Image Active
          </span>
        )}
      </div>

      {/* Primary Drag & Drop upload container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileSelect}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          isDragOver
            ? "border-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            : "border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              handleFileChange(files[0]);
            }
          }}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {value ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-900 flex-shrink-0 group shadow-lg">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if URL is invalid or broken
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <FileImage className="w-5 h-5 text-white/85" />
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 text-slate-500 shadow-md">
              <Upload className="w-6 h-6" />
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-slate-200">
              {isUploading ? (
                <span className="flex items-center gap-2 text-cyan-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading image asset...
                </span>
              ) : (
                <>
                  Drag & drop image here, or <span className="text-cyan-400 hover:text-cyan-300 underline">browse files</span>
                </>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, JPEG, WEBP, SVG up to 10MB
            </p>
            {value && !isUploading && (
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[280px] sm:max-w-xs mt-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60 inline-block">
                Path: {value}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions and expandables */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-slate-500 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        >
          {showUrlInput ? "Hide custom URL input" : "Or use custom image URL"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-red-400/80 hover:text-red-400 font-bold transition-colors cursor-pointer"
          >
            Clear Selected Image
          </button>
        )}
      </div>

      {/* Expandable manual URL text input */}
      {showUrlInput && (
        <div className="pt-1.5 transition-all animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-xs font-mono text-slate-100 placeholder:text-slate-600 shadow-inner"
            placeholder={placeholder}
          />
        </div>
      )}

      {/* Status Messages */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Image asset uploaded and selected successfully!</span>
        </div>
      )}
    </div>
  );
}
