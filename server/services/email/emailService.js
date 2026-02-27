const nodemailer = require("nodemailer");
const {
  buildComplaintCompletedEmailTemplate,
} = require("./templates/complaintCompletedTemplate");

let cachedTransporter = null;

function emailEnabled() {
  return process.env.EMAIL_ENABLED !== "false";
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const provider = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  if (provider === "gmail") {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  if (!host) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
}

async function sendEmail({ to, subject, html, text }) {
  if (!emailEnabled()) {
    return { skipped: true, reason: "EMAIL_ENABLED=false" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { skipped: true, reason: "SMTP is not configured" };
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

async function sendComplaintCompletedEmail(payload) {
  const { to } = payload;
  if (!to) {
    return { skipped: true, reason: "Recipient email missing" };
  }

  const template = buildComplaintCompletedEmailTemplate(payload);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

module.exports = {
  sendEmail,
  sendComplaintCompletedEmail,
};
