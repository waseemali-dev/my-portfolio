import React, { useState, useEffect, useRef, DragEvent } from "react";
import { 
  Folder, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  FileImage, 
  AlertCircle, 
  Search, 
  ExternalLink,
  HardDrive
} from "lucide-react";

interface MediaImage {
  filename: string;
  url: string;
  size: number;
  createdAt: number;
}

export default function MediaLibrary() {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/images");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        let errorMessage = `Server error (${res.status} ${res.statusText})`;
        try {
          const data = await res.json();
          if (data && data.error) {
            errorMessage += `: ${data.error}`;
            if (data.details) errorMessage += ` (${data.details})`;
          }
        } catch (_) {}
        setUploadError(errorMessage);
      }
    } catch (err: any) {
      console.error("Error loading images:", err);
      setUploadError(`Failed to communicate with the server: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCopyUrl = async (url: string, filename: string) => {
    try {
      // Create absolute URL if needed, but local relative path is fine too
      const fullUrl = window.location.origin + url;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedFilename(filename);
      setTimeout(() => setCopiedFilename(null), 2000);
    } catch (err) {
      console.warn("Could not copy URL:", err);
    }
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    // Verify it's an image
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file); // Fixed: changed from "image" to "file" to match backend expectation

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUploadSuccess(true);
          fetchImages();
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          setUploadError(data.error || "File upload failed.");
        }
      } else {
        const data = await res.json();
        setUploadError(data.error || "Failed to upload file.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Network error during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDeleteImage = async (filename: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/images/${filename}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchImages();
      } else {
        const errData = await res.json();
        alert(errData.error || "Could not delete image file.");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("A network error occurred while deleting image.");
    }
  };

  // Drag and Drop event handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const filteredImages = images.filter((img) => 
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute stats
  const totalCount = images.length;
  const totalSizeKB = images.reduce((acc, curr) => acc + curr.size, 0) / 1024;
  const totalSizeFormatted = totalSizeKB > 1024 
    ? `${(totalSizeKB / 1024).toFixed(1)} MB` 
    : `${Math.round(totalSizeKB)} KB`;

  return (
    <div className="space-y-6">
      {/* Overview Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Total Images
            </p>
            <p className="text-xl font-extrabold text-white">{totalCount}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Folder Storage
            </p>
            <p className="text-xl font-extrabold text-white">{totalSizeFormatted}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Direct Upload
              </p>
              <p className="text-xs text-slate-400 font-semibold">Add new assets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
          >
            Upload New
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[160px] ${
          isDragActive
            ? "border-cyan-400 bg-cyan-950/20 scale-[0.99] shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div>
              <p className="text-xs font-bold text-white">Uploading file to server...</p>
              <p className="text-[10px] text-slate-500 mt-1">This will only take a moment</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 bg-slate-900 rounded-2xl border border-slate-800 inline-block text-slate-400 group-hover:text-cyan-400 transition-colors mx-auto`}>
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Drag & drop image file here, or <span className="text-cyan-400 font-extrabold hover:underline">click to browse</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports JPG, PNG, WEBP, GIF, SVG up to 50MB
              </p>
            </div>
          </div>
        )}

        {/* Feedback banners */}
        {uploadError && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 p-2.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Check className="w-4 h-4 shrink-0" />
            <span>Image uploaded successfully and added to folder!</span>
          </div>
        )}
      </div>

      {/* Main folder directory body */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
        {/* Header tools bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>Files List</span>
            <span className="text-xs text-slate-500 normal-case font-normal">({filteredImages.length} found)</span>
          </h3>

          <div className="flex items-center gap-3">
            {/* Search inputs */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images in folder..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Refresh action */}
            <button
              onClick={fetchImages}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Refresh images listing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Loading display */}
        {isLoading && images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs">Reading uploads catalog directory...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-905 rounded-xl bg-slate-900/10">
            <FileImage className="w-12 h-12 text-slate-500 mx-auto opacity-30 mb-3" />
            <p className="text-xs font-bold text-slate-400">No images matched search</p>
            <p className="text-[10px] text-slate-500 mt-1">Try another search term or upload a new file above</p>
          </div>
        ) : (
          /* Grid list of images */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((img) => {
              const isCopied = copiedFilename === img.filename;
              return (
                <div
                  key={img.filename}
                  className="group relative bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail stage */}
                  <div className="aspect-square relative bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-850/50">
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick action buttons on hover overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-2">
                      {/* Copy URL */}
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(img.url, img.filename)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          isCopied 
                            ? "bg-emerald-500 text-slate-950 scale-105 shadow-md" 
                            : "bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-950"
                        }`}
                        title={isCopied ? "URL Copied!" : "Copy URL"}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* View full-screen */}
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-950 transition-all cursor-pointer"
                        title="View Full Screen"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.filename)}
                        className="p-2 rounded-lg bg-slate-950/80 text-slate-400 hover:text-red-400 hover:bg-slate-950 transition-all cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Absolute label of sizes */}
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-mono font-medium text-slate-400 border border-slate-850/50">
                      {Math.round(img.size / 1024)} KB
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-300 truncate leading-tight" title={img.filename}>
                      {img.filename}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-slate-500">
                        {new Date(img.createdAt).toLocaleDateString(undefined, { 
                          month: "short", 
                          day: "numeric", 
                          year: "2-digit" 
                        })}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(img.url, img.filename)}
                        className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                      >
                        {isCopied ? "Copied!" : "Copy URL"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
