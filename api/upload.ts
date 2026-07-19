import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the local uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to match UI
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|ico|jfif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isImageMime = file.mimetype && (file.mimetype.startsWith("image/") || allowedTypes.test(file.mimetype));
    if (extname || isImageMime) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp, svg)"));
    }
  },
});

// Helper to run express-style middleware in serverless handlers
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("file"));
    
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err: any) {
    console.error("Upload error in serverless function:", err);
    return res.status(400).json({ error: err.message || "Failed to upload file." });
  }
}

// Disable default bodyParser so multer can handle the raw multipart stream
export const config = {
  api: {
    bodyParser: false,
  },
};
