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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        {value && (
          <span className="text-[10px] font-medium text-cyan-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Image Selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* URL Input text box */}
        <div className="sm:col-span-2">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
            placeholder={placeholder}
          />
        </div>

        {/* Upload Button */}
        <div>
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="w-full h-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-805 hover:border-slate-700 disabled:bg-slate-950 disabled:border-slate-900 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-300 font-medium transition-all cursor-pointer"
          >
            {isUploading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Upload className="w-4 h-4 text-slate-400" />
            )}
            <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
          </button>
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
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileSelect}
        className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          isDragOver
            ? "border-cyan-400 bg-cyan-500/5"
            : "border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900/50"
        }`}
      >
        <div className="flex items-center gap-3">
          {value ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if URL is invalid or broken
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <FileImage className="w-4 h-4 text-white/80" />
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850">
              <Upload className="w-5 h-5 text-slate-500" />
            </div>
          )}

          <div className="text-left">
            <p className="text-xs font-semibold text-slate-300">
              Drag & drop image here, or <span className="text-cyan-400 underline">browse</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Supports PNG, JPG, JPEG, WEBP, SVG up to 10MB
            </p>
          </div>
        </div>
      </div>

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
          <span>Image uploaded and selected successfully!</span>
        </div>
      )}
    </div>
  );
}
