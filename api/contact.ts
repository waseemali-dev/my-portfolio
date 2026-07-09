import { Resend } from "resend";
import crypto from "crypto";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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

  // Attempt to send the email using Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || "waseemali1031@gmail.com";

  if (!resendApiKey) {
    console.warn("WARNING: RESEND_API_KEY is not configured in Vercel environment variables.");
    console.log("The email html generated is:");
    console.log(emailHtml);
    return res.status(200).json({
      success: true,
      message: "Form processed successfully (in Demo Mode - printed to server logs)."
    });
  }

  try {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Farm Solution <onboarding@resend.dev>",
      to: recipient,
      subject: `New Portfolio Inquiry Received From: ${fullName}`,
      html: emailHtml,
      replyTo: email,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!"
    });
  } catch (error: any) {
    console.error("Error sending email via Resend in Vercel function:", error);
    return res.status(500).json({
      error: "Failed to send email. Server error.",
      details: error.message || "Unknown Resend error occurred"
    });
  }
}
