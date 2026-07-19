import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Retrieve filename from req.query or parse it from req.url
  let filename = req.query?.filename;
  
  if (!filename && req.url) {
    // Fallback: Parse filename from URL (e.g. /api/images/my-file.png)
    const urlParts = req.url.split("?")[0].split("/");
    filename = urlParts[urlParts.length - 1];
  }

  if (!filename) {
    return res.status(400).json({ error: "Filename parameter is required." });
  }

  // Prevent directory traversal attacks
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Invalid filename." });
  }

  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    if (fs.existsSync(filePath)) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".jfif"];
      const ext = path.extname(filename).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ error: "Only image files can be deleted." });
      }
      
      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true });
    }
    
    return res.status(404).json({ error: "Image file not found." });
  } catch (err: any) {
    console.error("Error deleting image file in serverless function:", err);
    return res.status(500).json({ error: "Failed to delete image.", details: err.message });
  }
}
