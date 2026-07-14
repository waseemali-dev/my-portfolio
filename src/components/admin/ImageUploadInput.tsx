import React, { useState, useRef, DragEvent } from "react";
import { Upload, FileImage, RefreshCw, AlertCircle, CheckCircle, Folder, Trash2 } from "lucide-react";

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

  // Media Library state
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [existingImages, setExistingImages] = useState<{ filename: string; url: string; size: number; createdAt: number }[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  const fetchExistingImages = async () => {
    setIsLoadingExisting(true);
    try {
      const res = await fetch("/api/images");
      if (res.ok) {
        const data = await res.json();
        setExistingImages(data);
      }
    } catch (err) {
      console.warn("Failed to load existing images:", err);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleDeleteImage = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent choosing the image when deleting
    if (!confirm(`Are you sure you want to delete "${filename}" permanently?`)) return;
    try {
      const res = await fetch(`/api/images/${filename}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Refresh list
        fetchExistingImages();
        // If the deleted image was currently selected, clear it
        if (value === `/uploads/${filename}`) {
          onChange("");
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete image.");
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Error deleting image file.");
    }
  };

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

    // Helper to compress image file using canvas
    const compressImage = (imageFile: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<File> => {
      return new Promise((resolve) => {
        if (imageFile.type === "image/svg+xml") {
          resolve(imageFile);
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
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
              resolve(imageFile);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], imageFile.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  if (compressedFile.size < imageFile.size) {
                    resolve(compressedFile);
                  } else {
                    resolve(imageFile);
                  }
                } else {
                  resolve(imageFile);
                }
              },
              "image/jpeg",
              quality
            );
          };
          img.onerror = () => resolve(imageFile);
        };
        reader.onerror = () => resolve(imageFile);
      });
    };

    // Helper to convert file to Base64 Data URL
    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
    } catch (compressErr) {
      console.warn("Client-side image compression failed, using original file:", compressErr);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Handle 404 or non-JSON responses gracefully (common on serverless platforms like Vercel)
      if (response.status === 404 || !response.headers.get("content-type")?.includes("application/json")) {
        console.warn("Upload API is not available or returned 404 (possibly running on serverless Vercel). Falling back to client-side Base64 encoding.");
        const base64Url = await convertToBase64(fileToUpload);
        onChange(base64Url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        onChange(data.url);
        setUploadSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        // If upload endpoint explicitly failed, also fall back to Base64 so the user is not blocked!
        console.warn("Server upload failed, falling back to client-side Base64 encoding:", data.error);
        const base64Url = await convertToBase64(fileToUpload);
        onChange(base64Url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.warn("Network error during upload, falling back to client-side Base64 encoding:", err);
      try {
        const base64Url = await convertToBase64(fileToUpload);
        onChange(base64Url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (base64Err) {
        console.error("Base64 conversion failed:", base64Err);
        setUploadError("Failed to upload image and Base64 conversion failed.");
      }
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const nextState = !showMediaLibrary;
              setShowMediaLibrary(nextState);
              if (nextState) {
                fetchExistingImages();
              }
            }}
            className={`font-semibold transition-all flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-[11px] ${
              showMediaLibrary 
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold" 
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            {showMediaLibrary ? "Hide Uploaded Folder" : "Choose from Uploaded Folder"}
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-slate-500 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            {showUrlInput ? "Hide custom URL input" : "Or use custom image URL"}
          </button>
        </div>

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

      {/* Uploaded Images Folder View */}
      {showMediaLibrary && (
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 space-y-3 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Uploaded Images Folder
              </h4>
            </div>
            <button
              type="button"
              onClick={fetchExistingImages}
              className="text-[10px] font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded border border-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingExisting ? "animate-spin" : ""}`} />
              Refresh Folder
            </button>
          </div>

          {isLoadingExisting ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs">Scanning uploads folder...</span>
            </div>
          ) : existingImages.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <FileImage className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-semibold">No images found in the uploads folder.</p>
              <p className="text-[10px] text-slate-600 mt-1">Upload a new image above to populate this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
              {existingImages.map((img) => {
                const isSelected = value === img.url;
                return (
                  <div
                    key={img.filename}
                    onClick={() => {
                      onChange(img.url);
                    }}
                    className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/10 shadow-[0_0_10px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900"
                    }`}
                    title={img.filename}
                  >
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                      referrerPolicy="no-referrer"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteImage(img.filename, e)}
                      className="absolute top-1 right-1 p-1.5 rounded-md bg-slate-950/80 text-slate-400 hover:text-red-400 hover:bg-slate-950 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Selected Indicator Badge */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-950/30 flex items-center justify-center">
                        <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                          <CheckCircle className="w-3 h-3 text-slate-950 stroke-[3]" />
                          Selected
                        </span>
                      </div>
                    )}

                    {/* Filename hover overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-slate-950/20 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                      <p className="text-[9px] font-medium text-slate-200 truncate leading-none">
                        {img.filename}
                      </p>
                      <p className="text-[8px] font-mono text-slate-400 mt-0.5 leading-none">
                        {Math.round(img.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
