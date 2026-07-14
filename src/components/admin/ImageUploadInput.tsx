import React, { useState, useRef, DragEvent, useEffect } from "react";
import { 
  Upload, 
  FileImage, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Folder, 
  Trash2, 
  Search, 
  Plus, 
  X, 
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";

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
  
  // Media Library state
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [existingImages, setExistingImages] = useState<{ filename: string; url: string; size: number; createdAt: number }[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images from `/api/images`
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

  // Pre-load images count on mount
  useEffect(() => {
    fetchExistingImages();
  }, []);

  // Sync tab choice depending on empty states
  useEffect(() => {
    if (showPicker) {
      fetchExistingImages();
      if (existingImages.length === 0) {
        setActiveTab("upload");
      } else {
        setActiveTab("library");
      }
    }
  }, [showPicker]);

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

      // Handle 404 or non-JSON responses gracefully (common on serverless platforms)
      if (response.status === 404 || !response.headers.get("content-type")?.includes("application/json")) {
        console.warn("Upload API is not available or returned 404. Falling back to client-side Base64 encoding.");
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
        // Refresh library files listing so the new file shows up
        await fetchExistingImages();
        // Switch tab to library so they see it in the list
        setActiveTab("library");
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        console.warn("Server upload failed, falling back to client-side Base64:", data.error);
        const base64Url = await convertToBase64(fileToUpload);
        onChange(base64Url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.warn("Network error during upload, falling back to client-side Base64:", err);
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

  // Filter list of existing images based on search input
  const filteredImages = existingImages.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black uppercase tracking-wider text-slate-300">
          {label}
        </label>
        {value && (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Image Selected
          </span>
        )}
      </div>

      {/* Active Preview Frame & Launcher */}
      <div 
        onClick={() => setShowPicker(!showPicker)}
        className={`group relative rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] bg-slate-950/80 hover:bg-slate-950 hover:border-cyan-500/40 ${
          value ? "border-slate-800" : "border-slate-800 hover:border-slate-700"
        }`}
      >
        {value ? (
          <div className="relative w-full h-44 bg-slate-950 flex items-center justify-center">
            <img
              src={value}
              alt="Active section layout preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If broken URL, hide image and show placeholder
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {/* Absolute layout glassmorphism details bar */}
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-sm p-3 border-t border-slate-850 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Selected Image Path</p>
                <p className="text-xs font-mono text-cyan-400 truncate max-w-xs">{value}</p>
              </div>
              <span className="shrink-0 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-[10px] font-bold group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-slate-400 group-hover:text-cyan-400 transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">No image selected</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Click to browse uploads folder or upload a new image</p>
            </div>
          </div>
        )}
      </div>

      {/* Selector Action Tools */}
      <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const nextState = !showPicker;
              setShowPicker(nextState);
              if (nextState) {
                fetchExistingImages();
              }
            }}
            className={`font-semibold transition-all flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-[11px] ${
              showPicker 
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold" 
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            {showPicker ? "Hide Media Selector" : "Choose / Upload Image"}
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
            className="text-red-400/80 hover:text-red-400 font-bold transition-colors cursor-pointer text-[11px] bg-red-500/5 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/10"
          >
            Clear Image
          </button>
        )}
      </div>

      {/* EXPANSED UNIFIED MEDIA SELECTOR PANEL */}
      {showPicker && (
        <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Tabs header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "library"
                    ? "bg-slate-800 text-cyan-400 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                Browse Media Folder
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded-full font-mono">
                  {existingImages.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-slate-800 text-cyan-400 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Image
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="text-slate-500 hover:text-white p-1 rounded-md bg-slate-950/40 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {/* TAB CONTENT: BROWSE LIBRARY */}
            {activeTab === "library" && (
              <div className="space-y-3">
                {/* Search / Refresh toolbar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search folder..."
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchExistingImages}
                    className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Refresh folder"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingExisting ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {isLoadingExisting ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs">Reading uploads folder...</span>
                  </div>
                ) : existingImages.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 border border-dashed border-slate-900 rounded-xl bg-slate-900/10">
                    <FileImage className="w-10 h-10 mx-auto mb-2 opacity-35 text-slate-400" />
                    <p className="text-xs font-bold text-slate-400">The uploads folder is empty.</p>
                    <p className="text-[10px] text-slate-600 mt-1">Upload a new image using the "Upload New Image" tab!</p>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <p className="text-xs font-bold text-slate-400">No images match your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                    {filteredImages.map((img) => {
                      const isSelected = value === img.url;
                      return (
                        <div
                          key={img.filename}
                          onClick={() => {
                            onChange(img.url);
                          }}
                          className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-950/15 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500"
                              : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
                          }`}
                          title={img.filename}
                        >
                          <img
                            src={img.url}
                            alt={img.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                            referrerPolicy="no-referrer"
                          />

                          {/* Delete Action (absolute) */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteImage(img.filename, e)}
                            className="absolute top-1 right-1 p-1.5 rounded-lg bg-slate-950/90 text-slate-400 hover:text-red-400 hover:bg-slate-950 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800/40"
                            title="Delete file permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Selected Banner */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-cyan-950/20 flex items-center justify-center">
                              <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                                <CheckCircle className="w-3 h-3 text-slate-950 stroke-[3]" />
                                Selected
                              </span>
                            </div>
                          )}

                          {/* Filename and details hover info bar */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 to-slate-950/30 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                            <p className="text-[10px] font-bold text-slate-200 truncate leading-none">
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

            {/* TAB CONTENT: UPLOAD NEW */}
            {activeTab === "upload" && (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[160px] ${
                  isDragOver
                    ? "border-cyan-400 bg-cyan-950/20 scale-[0.99] shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "border-slate-800 hover:border-slate-700 bg-slate-900/20 hover:bg-slate-900/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-white">Uploading to media folder...</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your image is being saved on the server</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 inline-block text-slate-400 mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Drag & drop image file here, or <span className="text-cyan-400 underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Supports JPG, JPEG, PNG, WEBP, GIF, SVG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expandable Manual URL Text Input */}
      {showUrlInput && (
        <div className="pt-1.5 transition-all animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-xs font-mono text-slate-100 placeholder:text-slate-600 rounded-xl shadow-inner"
            placeholder={placeholder}
          />
        </div>
      )}

      {/* Action status toast feedback */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-1">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Image uploaded and saved to Media Folder successfully!</span>
        </div>
      )}
    </div>
  );
}
