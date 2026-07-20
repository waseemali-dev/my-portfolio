import fs from "fs";
import path from "path";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;

// Utility to fetch content from Firestore REST API
async function getFirestoreContent(): Promise<any> {
  if (!PROJECT_ID) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/configs/portfolio${API_KEY ? `?key=${API_KEY}` : ""}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const doc = await res.json();
      const jsonStr = doc.fields?.data?.stringValue;
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
    } else if (res.status === 404) {
      console.log("Firestore CMS: Document not found (returning null).");
      return null;
    } else {
      const errText = await res.text();
      console.error(`Firestore CMS: Fetch error status ${res.status}: ${errText}`);
    }
  } catch (err) {
    console.error("Firestore CMS: Exception during fetch:", err);
  }
  return null;
}

// Utility to save content to Firestore REST API
async function saveFirestoreContent(content: any): Promise<boolean> {
  if (!PROJECT_ID) return false;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/configs/portfolio${API_KEY ? `?key=${API_KEY}` : ""}`;
  try {
    const body = {
      fields: {
        data: {
          stringValue: JSON.stringify(content)
        }
      }
    };
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    if (res.status === 200) {
      console.log("Firestore CMS: Saved content successfully.");
      return true;
    } else {
      const errText = await res.text();
      console.error(`Firestore CMS: Save error status ${res.status}: ${errText}`);
    }
  } catch (err) {
    console.error("Firestore CMS: Exception during save:", err);
  }
  return false;
}

// Utility to delete content from Firestore REST API
async function deleteFirestoreContent(): Promise<boolean> {
  if (!PROJECT_ID) return false;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/configs/portfolio${API_KEY ? `?key=${API_KEY}` : ""}`;
  try {
    const res = await fetch(url, { method: "DELETE" });
    if (res.status === 200) {
      console.log("Firestore CMS: Deleted content successfully.");
      return true;
    } else {
      const errText = await res.text();
      console.error(`Firestore CMS: Delete error status ${res.status}: ${errText}`);
    }
  } catch (err) {
    console.error("Firestore CMS: Exception during delete:", err);
  }
  return false;
}

export default async function handler(req: any, res: any) {
  const filePath = path.join(process.cwd(), "uploads", "portfolio_content.json");

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Set no-cache headers to strictly prevent Vercel Edge caching on API responses
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method === "GET") {
    let data = null;

    // 1. Try to fetch from Firebase Firestore first if configured
    if (PROJECT_ID) {
      console.log("Retrieving CMS portfolio content from Firestore...");
      data = await getFirestoreContent();
    }

    // 2. Fallback to local filesystem if Firestore is not configured or document doesn't exist
    if (!data && fs.existsSync(filePath)) {
      try {
        console.log("Retrieving CMS portfolio content from local filesystem fallback...");
        const localData = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(localData);
      } catch (err: any) {
        console.error("Error reading portfolio_content.json fallback:", err);
      }
    }

    // 3. Robust secondary fallback to src/data/portfolio_content_saved.ts if JSON file is missing
    if (!data) {
      const workspacePath = path.join(process.cwd(), "src", "data", "portfolio_content_saved.ts");
      if (fs.existsSync(workspacePath)) {
        try {
          console.log("Retrieving CMS portfolio content from workspace ts fallback...");
          const tsContent = fs.readFileSync(workspacePath, "utf-8");
          const jsonStart = tsContent.indexOf("{");
          const jsonEnd = tsContent.lastIndexOf("}");
          if (jsonStart !== -1 && jsonEnd !== -1) {
            data = JSON.parse(tsContent.slice(jsonStart, jsonEnd + 1));
          }
        } catch (err: any) {
          console.error("Error parsing portfolio_content_saved.ts fallback:", err);
        }
      }
    }

    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    try {
      const content = req.body;
      if (!content || typeof content !== "object") {
        return res.status(400).json({ error: "Invalid content payload." });
      }

      let firestoreSaved = false;
      // 1. If Firestore is configured, save there first
      if (PROJECT_ID) {
        console.log("Saving CMS portfolio content to Firestore...");
        firestoreSaved = await saveFirestoreContent(content);
        if (!firestoreSaved) {
          return res.status(500).json({
            error: "Firestore save failed. Please verify that your Firestore Security Rules allow public writes to /configs/portfolio, or check your API key / project ID."
          });
        }
      }

      // 2. Always write to local file system as a backup and local dev support
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");

      // 3. Attempt to save directly to local source code files (for local persistence during development)
      try {
        const workspacePath = path.join(process.cwd(), "src", "data", "portfolio_content_saved.ts");
        const savedTsContent = `export const SAVED_PORTFOLIO_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
        fs.writeFileSync(workspacePath, savedTsContent, "utf-8");
      } catch (wsErr) {
        // Ignored on production serverless environments since filesystem is read-only
      }

      return res.status(200).json({ success: true, savedToCloud: firestoreSaved });
    } catch (err: any) {
      console.error("Error writing portfolio content:", err);
      return res.status(500).json({ error: "Failed to save portfolio content.", details: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      let firestoreDeleted = false;
      if (PROJECT_ID) {
        console.log("Deleting CMS portfolio content from Firestore...");
        firestoreDeleted = await deleteFirestoreContent();
      }

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(200).json({ success: true, message: "Custom content removed. Reset to defaults.", deletedFromCloud: firestoreDeleted });
    } catch (err: any) {
      console.error("Error deleting portfolio content:", err);
      return res.status(500).json({ error: "Failed to reset portfolio content.", details: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}

