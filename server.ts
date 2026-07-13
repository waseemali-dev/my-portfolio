import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";

dotenv.config({ override: true });

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp, svg)"));
    }
  },
});

function generateCaptchaChallenge() {
  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 12) + 1;
  const isAddition = Math.random() > 0.5;
  const answer = isAddition ? (num1 + num2) : (num1 + 10 - num2);
  const text = isAddition 
    ? `What is ${num1} + ${num2}?` 
    : `What is ${num1 + 10} - ${num2}?`;
  
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
  const secret = process.env.CAPTCHA_SECRET || "waseem-portfolio-captcha-secret-key-123";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${answer}:${expiresAt}`)
    .digest("hex");
    
  return {
    text,
    token: `${expiresAt}:${signature}`
  };
}

function verifyCaptcha(userAnswer: string, token: string): { success: boolean; error?: string } {
  if (!token || !userAnswer) {
    return { success: false, error: "CAPTCHA token and answer are required." };
  }
  
  const parts = token.split(":");
  if (parts.length !== 2) {
    return { success: false, error: "Invalid CAPTCHA token format." };
  }
  
  const [expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { success: false, error: "CAPTCHA has expired. Please refresh the CAPTCHA." };
  }
  
  const secret = process.env.CAPTCHA_SECRET || "waseem-portfolio-captcha-secret-key-123";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${userAnswer.trim()}:${expiresAtStr}`)
    .digest("hex");
    
  if (signature !== expectedSignature) {
    return { success: false, error: "Incorrect CAPTCHA answer. Please try again." };
  }
  
  return { success: true };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve uploaded images statically
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // API route for image uploads
  app.post("/api/upload", (req, res) => {
    upload.single("file")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message || "Failed to upload file." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded." });
      }

      const filePath = req.file.path;
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = req.file.mimetype;
        const base64Data = fileBuffer.toString("base64");
        const base64Url = `data:${mimeType};base64,${base64Data}`;
        
        // Clean up the uploaded file from disk immediately to keep filesystem stateless
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn("Could not clean up uploaded file from disk:", unlinkErr);
        }

        return res.json({ success: true, url: base64Url });
      } catch (readErr: any) {
        console.error("Error converting uploaded file to base64:", readErr);
        return res.status(500).json({ error: "Failed to process uploaded file.", details: readErr.message });
      }
    });
  });

  // GET API for portfolio content (no-cache headers included to prevent stale responses)
  app.get("/api/portfolio-content", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    const filePath = path.join(process.cwd(), "uploads", "portfolio_content.json");
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, "utf-8");
        return res.json(JSON.parse(data));
      } catch (err) {
        console.error("Error reading portfolio_content.json:", err);
        return res.status(500).json({ error: "Failed to read portfolio content." });
      }
    }
    return res.json(null);
  });

  // POST API to save portfolio content
  app.post("/api/portfolio-content", (req, res) => {
    const filePath = path.join(process.cwd(), "uploads", "portfolio_content.json");
    try {
      const content = req.body;
      if (!content || typeof content !== "object") {
        return res.status(400).json({ error: "Invalid content payload." });
      }
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");

      // Also write directly to the local development workspace source code file to bake the update into future builds
      try {
        const workspacePath = path.join(process.cwd(), "src", "data", "portfolio_content_saved.ts");
        const savedTsContent = `export const SAVED_PORTFOLIO_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
        fs.writeFileSync(workspacePath, savedTsContent, "utf-8");
      } catch (wsErr) {
        console.warn("Could not write portfolio update to development source file (expected in some production environments):", wsErr);
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Error writing portfolio_content.json:", err);
      return res.status(500).json({ error: "Failed to save portfolio content.", details: err.message });
    }
  });

  // DELETE API to remove custom portfolio content and reset to default
  app.delete("/api/portfolio-content", (req, res) => {
    const filePath = path.join(process.cwd(), "uploads", "portfolio_content.json");
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Restore the local development workspace source file back to system defaults
      try {
        const delWorkspacePath = path.join(process.cwd(), "src", "data", "portfolio_content_saved.ts");
        const defaultContent = {
          hero: {
            badge: "HubSpot Certified CMS Developer",
            name: "Waseem Ali",
            title: "Front-End & HubSpot CMS Developer",
            headline: "Waseem Ali | Front-End & HubSpot CMS Developer",
            description: "I build clean, responsive, and high-performing websites using HubSpot CMS, WordPress, automation, and modern front-end technologies.",
            ctaText: "Hire Me Now",
            ctaLink: "#contact",
            portfolioText: "View Portfolio",
            portfolioLink: "#portfolio",
            avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/Profile-update.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyOTY5NzgwODM3LCJpYXQiOjE3ODI5MjY1ODEwNTh9.zJRbqrMF31q9N-vSdC4tYbJCekjNhW3ROUG2yqyTafg&vercel-blob-signature=Ef1wnU3nW-dUOWw3IvastuFLFgbmq2Bi_j8oOr9YsTc"
          },
          about: {
            badge: "01 • About Me",
            heading: "Your Reliable Remote Partner",
            imageUrl: "",
            description: "My goal is simple: build websites that look professional, load quickly, perform well across all devices, and provide a great user experience. I focus on clean code, responsive development, SEO best practices, and long-term maintainability.",
            calloutTitle: "Built for Smooth Collaboration",
            calloutDescription: "I help agencies, startups, and businesses transform designs into clean, responsive websites. I work confidently with Figma files, write maintainable code, communicate clearly throughout the project, and deliver reliable results on time.",
            yearsOfExperience: 8,
            projectsCompleted: 85,
            happyClients: 50,
            responsiveLayouts: "100%",
            location: "Lahore, Pakistan",
            skillsList: ["HubSpot CRM", "SEO Optimization", "UI Implementation"],
            widget1Title: "CMS MASTER",
            widget1Value: "HubSpot Elite",
            widget2Title: "RATING",
            widget2Value: "5.0 ★ Fiverr"
          },
          skills: [
            { name: "JavaScript", category: "Languages & Core", proficiency: 94 },
            { name: "TypeScript", category: "Languages & Core", proficiency: 92 },
            { name: "HTML5", category: "Languages & Core", proficiency: 98 },
            { name: "CSS3 / SCSS", category: "Languages & Core", proficiency: 96 },
            { name: "React", category: "Languages & Core", proficiency: 90 },
            { name: "HubSpot CMS", category: "CMS & Frameworks", proficiency: 98 },
            { name: "HubL", category: "CMS & Frameworks", proficiency: 98 },
            { name: "WordPress", category: "CMS & Frameworks", proficiency: 92 },
            { name: "Tailwind CSS", category: "CMS & Frameworks", proficiency: 96 },
            { name: "Email Templates", category: "Design & Testing", proficiency: 95 },
            { name: "Responsive Design", category: "Design & Testing", proficiency: 98 },
            { name: "Web Accessibility", category: "Design & Testing", proficiency: 92 },
            { name: "Lighthouse Optimization", category: "Design & Testing", proficiency: 96 },
            { name: "Marketing Automation", category: "SEO & Devops", proficiency: 90 },
            { name: "Workflow Automation", category: "SEO & Devops", proficiency: 92 },
            { name: "AI Integration", category: "SEO & Devops", proficiency: 88 },
            { name: "Prompt Engineering", category: "SEO & Devops", proficiency: 90 },
            { name: "API Integration", category: "SEO & Devops", proficiency: 86 },
            { name: "Git", category: "SEO & Devops", proficiency: 90 }
          ],
          services: [
            { id: "hubspot-cms", title: "HubSpot CMS Development", description: "High-converting custom HubSpot websites, fully editable templates, and reusable drag-and-drop systems.", features: [], iconName: "HubSpot" },
            { id: "frontend", title: "Front-End Development", description: "Translating pixel-perfect Figma designs into responsive, highly-interactive, and maintainable frontend code.", features: [], iconName: "Code" },
            { id: "wordpress", title: "WordPress Development", description: "Lightweight, speed-optimized WordPress themes and flexible Gutenberg/ACF custom block environments.", features: [], iconName: "Wordpress" },
            { id: "email-template", title: "Email Templates", description: "Responsive HTML email templates tested and verified to render flawlessly across all major email clients.", features: [], iconName: "Mail" },
            { id: "workflow-automation", title: "Workflow Automation", description: "Streamlining CRM marketing workflows, smart automation triggers, lead routing, and platform integrations.", features: [], iconName: "RefreshCw" },
            { id: "performance-optimization", title: "Performance & SEO Optimization", description: "Tuning Core Web Vitals, minifying assets, and optimizing layouts to guarantee 99+ Lighthouse performance scores.", features: [], iconName: "Zap" }
          ],
          projects: [
            { id: "boston-institute-finance", title: "Boston Institute Of Finance", description: "Complete template pack, interactive learning selectors, and custom HubDB data directories.", technologies: ["HubSpot CMS", "HubDB", "HubL", "SEO Optimization"], category: "HubSpot CMS", liveUrl: "https://www.bostonifi.com", imageUrl: "boston-institute-finance", featured: true },
            { id: "remote-technology", title: "Remote Technology", description: "Front-end refactoring and website translation management system integration with HubSpot workflow automation.", technologies: ["HubSpot CMS", "HTML5/CSS3", "JavaScript", "Bootstrap"], category: "HubSpot CMS", liveUrl: "https://remote.com", imageUrl: "remote-technology", featured: true },
            { id: "centersquare", title: "Center Square", description: "High-converting HubSpot landing pages with interactive server calculators and custom CMS modules.", technologies: ["HubSpot CMS", "HubL", "Figma to Code", "jQuery"], category: "HubSpot CMS", liveUrl: "https://www.csquare.com", imageUrl: "centersquare", featured: true },
            { id: "cypher-learning", title: "Cypher Learning", description: "Re-engineered a high-performance HubSpot CMS website with dynamic components and reusable HubL templates.", technologies: ["HubSpot CMS", "HubL", "JavaScript", "SCSS"], category: "HubSpot CMS", liveUrl: "https://www.cypherlearning.com", imageUrl: "cypher-learning", featured: false },
            { id: "nextiny-marketing", title: "Nextiny Marketing", description: "High-performance WordPress theme enhancements and custom HubSpot HubDB lead generators.", technologies: ["WordPress", "ACF", "HubSpot CMS", "Lighthouse Tools"], category: "HubSpot CMS", liveUrl: "https://www.nextinymarketing.com", imageUrl: "nextiny-marketing", featured: false }
          ],
          experience: [
            { id: "computan", role: "HubSpot CMS Developer", company: "Computan", location: "Lahore, Pakistan (Hybrid)", period: "Jun 2021 to Present", description: [ "Architect and code premium, high-performance HubSpot CMS themes, templates, and reusable drag-and-drop modules.", "Develop complex dynamic systems using HubL, HubDB databases, and HubSpot CRM integrations.", "Optimize website speed, Core Web Vitals, and technical SEO structure to elevate client performance scores." ], current: true },
            { id: "immentia", role: "Front-End Developer", company: "Immentia", location: "Islamabad, Pakistan (Onsite)", period: "Jun 2018 to May 2021", description: [ "Designed and developed responsive web layouts and HTML templates using HTML5, CSS3, Bootstrap, JavaScript, and jQuery, including PSD-to-HTML conversion.", "Customized WordPress themes and landing pages based on client requirements while ensuring W3C standards, responsiveness, and cross-browser compatibility." ], current: false },
            { id: "increate", role: "WordPress Developer", company: "inCreate Technologies", location: "Islamabad, Pakistan (Onsite)", period: "Jun 2017 to May 2018", description: [ "Developed and maintained responsive, SEO-friendly WordPress websites focused on clean design, usability, and performance.", "Customized WordPress themes and integrated plugins to improve website functionality and meet client requirements." ], current: false }
          ],
          education: { degree: "Bachelor of Science in Computer Science (BSCS)", institution: "Federal Urdu University of Arts, Science & Technology", period: "Sep 2011 to Sep 2015", details: "Graduated with focused tracks in Web Architectures, Database Designs, and Software Engineering methodologies." },
          testimonials: [
            { id: "t1", name: "Dan", text: "Waseem did a fantastic job with the file he produced, and we are now working with him to complete additional website updates. I highly recommend him for your web development needs.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t2", name: "Toddtall", text: "Amazing availability. He continued communicating, sometimes even at 2–4 AM his time!", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t3", name: "Rosita", text: "Again, he was my hero! He delivered so quickly. I had a problem with my website, and like a magician, he fixed it again. Thanks, Waseem!", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t4", name: "Testing Simple", text: "I have worked with Waseem quite a few times in the past, and he is an amazing developer who knows WordPress really well. He is cooperative and always ready to assist very quickly. Highly recommended.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t5", name: "Pfundheller", text: "So awesome! I have him do all my website pages. He does an amazing job!", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t6", name: "piripiri001", text: "Waseem has incredible skills and talent when it comes to coding, WordPress websites, and customizations. He is a maestro! He is very kind, humble, and confident. I love working with him.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t7", name: "Mahmood Rastgar", text: "I had a wonderful experience working with Waseem. If anybody is looking for a WordPress expert, I think he is among the best freelancers I have come across.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t8", name: "Jai George", text: "Waseem is the best! He is not only fast but also understands exactly what I need. He delivers work beyond my expectations in a timely manner. I will use him again and recommend him for website design.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t9", name: "moe_550", text: "Amazing website designer! Went beyond the project details and delivered an outstanding website. Thank you so much!", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t10", name: "Micky Morrison", text: "Always a pleasure to work with Waseem. Great work ethic and attention to detail.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" },
            { id: "t11", name: "Taylor", text: "This seller is amazing! I have ordered multiple times, and he always makes sure I get everything I need and more. Excellent service.", rating: 5, avatarUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s", platform: "Fiverr", platformIconUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", sourceUrl: "https://www.fiverr.com/waseemali722" }
          ],
          faqs: [
            { question: "What type of websites do you build?", answer: "I specialize in high-performance, responsive marketing websites, landing pages, corporate portals, e-commerce stores, and blog platforms. My primary focus is on translating custom designs (Figma, Adobe XD) into lightweight, responsive, and SEO-optimized web experiences." },
            { question: "Do you work with HubSpot CMS?", answer: "Yes, I am a certified HubSpot CMS Expert. I build custom themes, flexible drag-and-drop templates, custom HubL modules, searchable HubDB databases, personalized dynamic content blocks, and fully custom HubSpot landing pages and email templates." },
            { question: "Can you improve website speed?", answer: "Yes. I offer deep performance optimization services. I audit websites using tools like Google PageSpeed Insights, Lighthouse, and GTmetrix, then fix issues by minifying assets, lazy-loading media, removing redundant scripts, implementing caching, and structuring layouts to eliminate Cumulative Layout Shift (CLS)." },
            { question: "Do you work with WordPress?", answer: "Yes. I develop highly customized, responsive WordPress websites. I build lightweight themes, custom blocks powered by Advanced Custom Fields (ACF), and optimize WooCommerce setups, avoiding heavy visual page builders that bloat page speed." },
            { question: "Are you available for freelance projects?", answer: "Yes, I am actively open for freelance and contract opportunities. I partner with design agencies, marketing firms, startups, and established enterprises on platforms like LinkedIn, Upwork, and Fiverr, as well as direct client relationships." }
          ],
          contact: {
            badge: "10 • Let's Connect",
            heading: "Initiate a Digital Collaboration",
            description: "Submit the form below, and let's craft modern web solutions matching your goals.",
            infoHeading: "Direct Contact Particulars",
            email: "waseemali1031@gmail.com",
            phone: "+92 304 8687455",
            statusText: "Open for Freelance Projects",
            ctaTitle: "Need a Reliable Front-End or HubSpot CMS Developer for your next project?",
            ctaDescription: "Let's design and engineer high-performance web spaces, optimize PageSpeed, code custom drag-and-drop modules, or migrate your sites smoothly."
          },
          socialLinks: {
            linkedin: "https://linkedin.com/in/waseemali2",
            upwork: "https://www.upwork.com/freelancers/~01c370cb3bec57b1a6",
            fiverr: "https://www.fiverr.com/waseemali722",
            github: "https://github.com/waseemali1031"
          },
          certifications: [
            { id: "hubspot-cms-dev", name: "HubSpot CMS for Developers", authority: "HubSpot Academy", status: "Active & Verified Expert" }
          ],
          seo: {
            title: "Waseem Ali | Front-End & HubSpot CMS Developer Portfolio",
            description: "Certified HubSpot CMS & Front-End Developer. Specialist in building fast, custom HubSpot themes, high-converting WordPress sites, and semantic React frontends.",
            keywords: "HubSpot CMS, Front-End Developer, HubSpot Developer, WordPress Developer, React, Web Performance, Core Web Vitals, Lahore, Pakistan",
            author: "Waseem Ali",
            favicon: "/favicon.ico"
          }
        };

        const defaultTsContent = `export const SAVED_PORTFOLIO_CONTENT = ${JSON.stringify(defaultContent, null, 2)};\n`;
        fs.writeFileSync(delWorkspacePath, defaultTsContent, "utf-8");
      } catch (wsErr) {
        console.warn("Could not reset local development source file:", wsErr);
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting portfolio_content.json:", err);
      return res.status(500).json({ error: "Failed to reset portfolio content.", details: err.message });
    }
  });

  // GET API for captcha challenge
  app.get("/api/captcha", (req, res) => {
    try {
      const challenge = generateCaptchaChallenge();
      res.json(challenge);
    } catch (error: any) {
      console.error("Error generating captcha:", error);
      res.status(500).json({ error: "Failed to generate security verification." });
    }
  });

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    const { fullName, email, projectType, budget, message, captchaToken, captchaAnswer } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: "Full Name and Email are required fields." });
    }

    // Verify CAPTCHA
    const captchaVerification = verifyCaptcha(captchaAnswer, captchaToken);
    if (!captchaVerification.success) {
      return res.status(400).json({ error: captchaVerification.error });
    }

    // Build modern responsive HTML email
    const accentColor = "#06b6d4"; // Cyan accent color
    const formattedBudget = budget && budget.trim() !== "" ? budget : "Not Provided";
    const pkrTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
    }
    .header {
      background-color: #0f172a;
      padding: 32px;
      text-align: center;
      border-bottom: 4px solid ${accentColor};
    }
    .header .subtitle {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: ${accentColor};
      margin: 0 0 6px 0;
    }
    .header h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 32px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .info-table td {
      padding: 14px 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    .label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin: 0 0 4px 0;
    }
    .value {
      font-size: 15px;
      color: #0f172a;
      margin: 0;
      font-weight: 600;
    }
    .value a {
      color: ${accentColor};
      text-decoration: none;
    }
    .badge {
      display: inline-block;
      background-color: #ecfeff;
      color: #0891b2;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #cffafe;
    }
    .message-section {
      margin-top: 28px;
      margin-bottom: 32px;
    }
    .message-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 8px;
    }
    .message-box {
      background-color: #f8fafc;
      border-left: 4px solid ${accentColor};
      border-radius: 0 8px 8px 0;
      padding: 24px;
    }
    .message-text {
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      white-space: pre-wrap;
      font-style: italic;
    }
    .btn-container {
      text-align: center;
      margin-top: 8px;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background-color: ${accentColor};
      color: #ffffff !important;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer p {
      font-size: 12px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer p strong {
      color: #475569;
    }
    .timestamp {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 8px !important;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="subtitle">Client Proposal Portal</p>
        <h1>New Portfolio Inquiry Received</h1>
      </div>
      <div class="content">
        
        <table class="info-table" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding-left: 0;">
              <p class="label">Sender Name</p>
              <p class="value">${fullName}</p>
            </td>
            <td width="50%" style="padding-right: 0;">
              <p class="label">Email Address</p>
              <p class="value">
                <a href="mailto:${email}">${email}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-left: 0; border-bottom: none;">
              <p class="label">Project Type</p>
              <div style="margin-top: 4px;">
                <span class="badge">${projectType || "General Inquiry"}</span>
              </div>
            </td>
            <td style="padding-right: 0; border-bottom: none;">
              <p class="label">Est. Budget</p>
              <p class="value" style="color: #0d9488;">${formattedBudget}</p>
            </td>
          </tr>
        </table>
        
        <div class="message-section">
          <p class="message-label">Project Details & Requirements</p>
          <div class="message-box">
            <p class="message-text">"${message || "No detailed requirements provided."}"</p>
          </div>
        </div>
        
        <div class="btn-container">
          <a href="mailto:${email}?subject=Re: Your Project Inquiry - Waseem Ali" class="btn">Reply to ${fullName}</a>
        </div>
        
      </div>
      <div class="footer">
        <p>This message was sent securely via the contact form on <strong>Waseem Ali's Developer Portfolio</strong>.</p>
        <p class="timestamp">Submission Time: ${pkrTime} (Pakistan Time)</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Attempt to send the email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.NOTIFICATION_EMAIL || "waseemali1031@gmail.com";

    console.log("-----------------------------------------");
    console.log(`Processing contact form submission from ${fullName} (${email}).`);
    console.log(`Recipient Email: ${recipient}`);
    console.log(`Resend API Key configured: ${resendApiKey ? "YES" : "NO"}`);
    
    if (!resendApiKey) {
      console.warn("WARNING: RESEND_API_KEY is not configured in environment secrets.");
      console.log("The email html generated is:");
      console.log(emailHtml);
      console.log("-----------------------------------------");
      return res.status(200).json({
        success: true,
        message: "Form processed successfully (in Dev Mode - printed to server console)."
      });
    }

    try {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: "Farm Solution <onboarding@resend.dev>",
        to: recipient,
        subject: `🚀 Waseem Ali Portfolio - New Inquiry from ${fullName} [${projectType || "General"}]`,
        html: emailHtml,
        replyTo: email,
      });

      console.log(`Email sent successfully via Resend to ${recipient}`);
      console.log("-----------------------------------------");
      return res.status(200).json({
        success: true,
        message: "Your message has been sent successfully!"
      });
    } catch (error: any) {
      console.error("Error sending email via Resend:", error);
      console.log("-----------------------------------------");
      
      return res.status(500).json({
        error: "Failed to send email. Server error.",
        details: error.message || "Unknown Resend error occurred"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with custom headers to prevent browser/CDN caching of index.html
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (path.basename(filePath) === "index.html") {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else {
          // Other static assets (JS, CSS, images, fonts) are hashed/static, safe to cache for performance
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    // Fallback for SPA routing - serve index.html with no-cache headers
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
