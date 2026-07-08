import crypto from "crypto";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const challenge = generateCaptchaChallenge();
    return res.status(200).json(challenge);
  } catch (error: any) {
    console.error("Error generating captcha in serverless:", error);
    return res.status(500).json({ error: "Failed to generate security verification." });
  }
}
