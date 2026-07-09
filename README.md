# Farm Solution - Developer Portfolio & Inquiry System

This project features a modern full-stack developer portfolio with a fully-integrated admin control panel, static content storage, dynamic page previews, image asset uploader, and secure captcha-protected client inquiry system.

## 📧 Email Provider Migration: Resend API

We have fully migrated the contact form inquiry delivery engine from Gmail SMTP (Nodemailer) to **Resend API** to resolve authentication handshake issues (`535-5.7.8 Username and Password not accepted`) and ensure maximum deliverability under cloud server environments.

### Required Environment Variables

To operate the live contact inquiry system on development and production environments (e.g. Vercel, Cloud Run), configure the following keys in your environments:

1. **`RESEND_API_KEY`**: Your unique Resend API authentication token (obtained from your [Resend Dashboard](https://resend.com)).
2. **`NOTIFICATION_EMAIL`**: The destination inbox where incoming portfolio client inquiries are forwarded (e.g., `waseemali1031@gmail.com`).
3. **`CAPTCHA_SECRET`**: A secure cryptographic salt string used to sign and verify form submissions against automatic spam scripts.

*Note: If `RESEND_API_KEY` is not present, the system operates gracefully in **Dev Mode**, printing the fully rendered client email template directly into the server logs for convenient previewing and local testing.*

### Live Form Submission Flow
1. Visitor submits their inquiry via the contact form on the front page.
2. The request answers a cryptographically signed captcha on the client.
3. `/api/contact` verifies the signature, renders a polished, responsive HTML email body, and dispatches it via Resend.
4. The inquiry lands securely in your `NOTIFICATION_EMAIL` inbox instantly.
