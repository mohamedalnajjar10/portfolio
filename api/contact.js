/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions and dispatches emails via Nodemailer
 */

const nodemailer = require("nodemailer");

function createEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "mohamedalnajjar204@gmail.com";
  const pass = (process.env.SMTP_PASS || "").trim().replace(/\s+/g, "");

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // Honeypot anti-spam check
    if (data.website && data.website.trim() !== "") {
      return res.status(200).json({
        success: true,
        message: "Your request has been sent successfully!",
      });
    }

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const company = (data.company || "").trim();
    const service = (data.service || "").trim();
    const budget = (data.budget || "").trim();
    const message = (data.message || "").trim();

    const EMAIL_REGEX =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid name (min 2 characters).",
      });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid work email address.",
      });
    }

    if (!message || message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please describe your project requirements (min 10 characters).",
      });
    }

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

    const transporter = createEmailTransporter();

    if (!transporter) {
      console.error("[Nodemailer Error] No SMTP credentials configured.");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please set SMTP credentials in Vercel Environment Variables.",
      });
    }

    await transporter.sendMail({
      from: senderEmail,
      to: receiverEmail,
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({
      success: true,
      message: "Your request has been sent successfully!",
    });
  } catch (error) {
    console.error("[Nodemailer Error]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to dispatch email via SMTP. Please try again later.",
    });
  }
};
