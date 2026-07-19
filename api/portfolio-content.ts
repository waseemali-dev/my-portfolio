import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  const filePath = path.join(process.cwd(), "uploads", "portfolio_content.json");

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Set no-cache headers
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method === "GET") {
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, "utf-8");
        return res.status(200).json(JSON.parse(data));
      } catch (err: any) {
        console.error("Error reading portfolio_content.json:", err);
        return res.status(500).json({ error: "Failed to read portfolio content." });
      }
    }
    return res.status(200).json(null);
  }

  if (req.method === "POST") {
    try {
      const content = req.body;
      if (!content || typeof content !== "object") {
        return res.status(400).json({ error: "Invalid content payload." });
      }
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");

      // Attempt to save to development workspace source code file
      try {
        const workspacePath = path.join(process.cwd(), "src", "data", "portfolio_content_saved.ts");
        const savedTsContent = `export const SAVED_PORTFOLIO_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
        fs.writeFileSync(workspacePath, savedTsContent, "utf-8");
      } catch (wsErr) {
        console.warn("Could not write portfolio update to development source file:", wsErr);
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Error writing portfolio_content.json:", err);
      return res.status(500).json({ error: "Failed to save portfolio content.", details: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(200).json({ success: true, message: "Custom content removed. Reset to defaults." });
    } catch (err: any) {
      console.error("Error deleting portfolio_content.json:", err);
      return res.status(500).json({ error: "Failed to reset portfolio content.", details: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
