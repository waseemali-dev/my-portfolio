import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const uploadsDir = path.join(process.cwd(), "uploads");

  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(uploadsDir);
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".jfif"];
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return allowedExtensions.includes(ext);
      })
      .map((file) => {
        const stats = fs.statSync(path.join(uploadsDir, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtimeMs || stats.mtimeMs,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first

    return res.status(200).json(images);
  } catch (err: any) {
    console.error("Error listing images in serverless function:", err);
    return res.status(500).json({ error: "Failed to list images.", details: err.message });
  }
}
