import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    const { fullName, email, projectType, budget, message } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: "Full Name and Email are required fields." });
    }

    // Build modern responsive HTML email
    const accentColor = "#06b6d4"; // Cyan accent color
    const formattedBudget = budget && budget.trim() !== "" ? budget : "Not Provided";
    
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
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #0f172a;
      padding: 32px;
      text-align: center;
      border-bottom: 3px solid ${accentColor};
    }
    .header h1 {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 32px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-top: 0;
      margin-bottom: 6px;
    }
    .field-value {
      font-size: 16px;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 500;
    }
    .field-value a {
      color: ${accentColor};
      text-decoration: none;
      font-weight: 600;
    }
    .message-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .message-text {
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      white-space: pre-wrap;
    }
    .btn-container {
      text-align: center;
      margin-top: 8px;
    }
    .btn {
      display: inline-block;
      background-color: ${accentColor};
      color: #0f172a !important;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);
      transition: background-color 0.2s;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Portfolio Inquiry Received</h1>
      </div>
      <div class="content">
        
        <p class="section-title">Full Name</p>
        <p class="field-value">${fullName}</p>
        
        <p class="section-title">Email Address</p>
        <p class="field-value">
          <a href="mailto:${email}">${email}</a>
        </p>
        
        <p class="section-title">Project Type</p>
        <p class="field-value">${projectType || "Not Specified"}</p>
        
        <p class="section-title">Approximate Budget</p>
        <p class="field-value">${formattedBudget}</p>
        
        <p class="section-title">Project Details / Message</p>
        <div class="message-box">
          <p class="message-text">${message || "No message content provided."}</p>
        </div>
        
        <div class="btn-container">
          <a href="mailto:${email}" class="btn">Reply to Client</a>
        </div>
        
      </div>
      <div class="footer">
        <p>This inquiry was sent from Waseem Ali's Portfolio website contact form.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Attempt to send the email
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "waseemali1031@gmail.com";
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"Waseem Ali Portfolio" <${smtpUser}>`;

    const recipient = "waseemali1031@gmail.com";

    console.log("-----------------------------------------");
    console.log(`Processing contact form submission from ${fullName} (${email}).`);
    
    if (!smtpPass) {
      console.warn("WARNING: SMTP_PASS is not configured in environment secrets.");
      console.log("The email html generated is:");
      console.log(emailHtml);
      console.log("-----------------------------------------");
      return res.status(200).json({
        success: true,
        message: "Form processed successfully (in Dev Mode - printed to server console)."
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: recipient,
        subject: `New Portfolio Inquiry Received From: ${fullName}`,
        html: emailHtml,
        replyTo: email,
      });

      console.log(`Email sent successfully to ${recipient}`);
      console.log("-----------------------------------------");
      return res.status(200).json({
        success: true,
        message: "Your message has been sent successfully!"
      });
    } catch (error: any) {
      console.error("Error sending email via nodemailer:", error);
      console.log("-----------------------------------------");
      return res.status(500).json({
        error: "Failed to send email. Server error.",
        details: error.message
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
