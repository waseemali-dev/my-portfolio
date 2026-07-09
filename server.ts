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

      // Return the relative URL of the uploaded image
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, url: fileUrl });
    });
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
