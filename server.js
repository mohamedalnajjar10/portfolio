/**
 * ============================================================================
 * GloryTech Showcase Website - Node.js Server with Nodemailer Email Service
 * Loads environment configuration from .env for secure SMTP credentials.
 * ============================================================================
 */

require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const PORT = parseInt(process.env.PORT || "8085", 10);
const HOST = "0.0.0.0";
const BASE_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

/**
 * Creates Nodemailer Transporter using credentials loaded from .env
 */
function createEmailTransporter() {
  require("dotenv").config({ override: true });
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "mohamedalnajjar204@gmail.com";
  const pass = (process.env.SMTP_PASS || "").trim().replace(/\s+/g, "");

  if (!pass) {
    return null; // Development mode / pending App Password
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Handle incoming contact form POST requests (/api/contact)
 */
async function handleContactForm(req, res) {
  let bodyChunks = [];
  let totalLength = 0;
  const MAX_PAYLOAD_SIZE = 1e6; // 1MB

  req.on("data", (chunk) => {
    totalLength += chunk.length;
    if (totalLength > MAX_PAYLOAD_SIZE) {
      res.writeHead(413, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "Payload too large." }),
      );
      req.destroy();
      return;
    }
    bodyChunks.push(chunk);
  });

  req.on("end", async () => {
    try {
      const rawBody = Buffer.concat(bodyChunks).toString("utf8");
      const data = JSON.parse(rawBody || "{}");

      // 1. Honeypot anti-spam check (if bot filled hidden "website" field)
      if (data.website && data.website.trim() !== "") {
        console.warn(
          "[Anti-Spam] Honeypot field filled. Silently dropping spam submission.",
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "Your request has been sent successfully!",
          }),
        );
        return;
      }

      // 2. Validate required inputs
      const name = (data.name || "").trim();
      const email = (data.email || "").trim();
      const company = (data.company || "").trim();
      const service = (data.service || "").trim();
      const budget = (data.budget || "").trim();
      const message = (data.message || "").trim();

      const EMAIL_REGEX =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

      if (!name || name.length < 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Please provide a valid name (min 2 characters).",
          }),
        );
        return;
      }

      if (!email || !EMAIL_REGEX.test(email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Please provide a valid work email address.",
          }),
        );
        return;
      }

      if (!message || message.length < 10) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              "Please describe your project requirements (min 10 characters).",
          }),
        );
        return;
      }

      // 3. Compose Email Content
      const receiverEmail =
        process.env.CONTACT_RECEIVER_EMAIL || "mohamedalnajjar204@gmail.com";
      const senderEmail =
        process.env.EMAIL_FROM ||
        `"GloryTech Website" <${process.env.SMTP_USER || "mohamedalnajjar204@gmail.com"}>`;
      const submissionDate = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
        dateStyle: "full",
        timeStyle: "medium",
      });

      const emailSubject = `🚀 New Consultation Request: ${name} — ${service || "General Inquiry"}`;

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 24px 32px; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; color: #93c5fd; }
    .content { padding: 32px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .detail-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .detail-table td.label { width: 35%; color: #64748b; font-weight: 600; }
    .detail-table td.value { color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .footer { background: #f1f5f9; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>GloryTech — New Consultation Request</h2>
      <p>Received on ${submissionDate} (Cairo Time)</p>
    </div>
    <div class="content">
      <table class="detail-table">
        <tr>
          <td class="label">Client Name</td>
          <td class="value"><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Company / Org</td>
          <td class="value">${company || "Not Specified"}</td>
        </tr>
        <tr>
          <td class="label">Selected Service</td>
          <td class="value"><span style="color:#2563eb; font-weight:600;">${service || "General Inquiry"}</span></td>
        </tr>
        <tr>
          <td class="label">Estimated Budget</td>
          <td class="value">${budget || "Not Specified"}</td>
        </tr>
      </table>

      <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Project Scope & Requirements:</h4>
      <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
    <div class="footer">
      Sent from GloryTech Showcase Website Contact Form • Direct Reply: <a href="mailto:${email}">${email}</a>
    </div>
  </div>
</body>
</html>
      `;

      const emailText = `
New Consultation Request - GloryTech
------------------------------------------------
Client Name: ${name}
Email: ${email}
Company: ${company || "Not Specified"}
Service: ${service || "General Inquiry"}
Budget: ${budget || "Not Specified"}
Date: ${submissionDate}

Project Scope:
${message}
------------------------------------------------
Reply directly to: ${email}
      `;

      // 4. Send Email via Nodemailer
      const transporter = createEmailTransporter();

      if (!transporter) {
        console.error(
          "[Nodemailer Error] No SMTP credentials provided in .env (SMTP_PASS is required).",
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Email service is not configured. Please check SMTP credentials in .env.",
          }),
        );
        return;
      }

      try {
        await transporter.sendMail({
          from: senderEmail,
          to: receiverEmail,
          replyTo: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });
        console.log(
          `\n[Nodemailer] ✅ Email successfully sent to ${receiverEmail} for request from ${name} (${email})`,
        );

        // 5. Send Success Response to Frontend
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        });
        res.end(
          JSON.stringify({
            success: true,
            message: "Your request has been sent successfully!",
          }),
        );
      } catch (mailError) {
        console.error(
          "[Nodemailer Error] Failed to dispatch email via SMTP:",
          mailError,
        );
        if (mailError.code === "EAUTH") {
          console.error(
            "\n[Nodemailer Auth Hint] Gmail rejected login credentials.",
          );
          console.error(
            "Please generate a 16-character App Password at https://myaccount.google.com/apppasswords and set it in .env under SMTP_PASS.\n",
          );
        }
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Failed to send email via SMTP. Please check server configuration.",
          }),
        );
      }
    } catch (parseError) {
      console.error("[Contact API Error]", parseError);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Invalid JSON request payload.",
        }),
      );
    }
  });
}

/**
 * Main HTTP Server Request Handler
 */
const server = http.createServer((req, res) => {
  // CORS Headers for API flexibility
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split("?")[0];

  // Route: POST /api/contact -> Handle form submission with Nodemailer
  if (
    req.method === "POST" &&
    (urlPath === "/api/contact" || urlPath === "/send-email")
  ) {
    handleContactForm(req, res);
    return;
  }

  // Static File Serving
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, "");

  if (safePath === "/" || safePath === "\\") {
    safePath = "/index.html";
  }

  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(BASE_DIR, "index.html");
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
          res.end("404 Not Found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
        res.end("500 Internal Server Error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log("\n============================================================");
  console.log("   🚀 GloryTech Server with Nodemailer is Live!");
  console.log("============================================================");
  console.log(`   > Local URL:       http://localhost:${PORT}/`);
  console.log(`   > Contact API:     http://localhost:${PORT}/api/contact`);
  console.log(
    `   > Delivery Inbox:  ${process.env.CONTACT_RECEIVER_EMAIL || "mohamedalnajjar204@gmail.com"}`,
  );
  console.log("============================================================\n");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n[Error] Port ${PORT} is already in use. Trying port ${PORT + 1}...`,
    );
    server.listen(PORT + 1, HOST);
  } else {
    console.error("[Server Error]", err);
  }
});
