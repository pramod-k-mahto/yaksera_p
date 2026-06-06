import nodemailer from "nodemailer";
import ApiError from "./ApiError.js";

// create transporter once
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// optional: verify once at startup (NOT inside function)
transporter
  .verify()
  .then(() => console.log("✅ Mail server ready"))
  .catch((err) => console.error("❌ Mail server error:", err));

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to,
      subject,
      html,
    });

    console.log("📧 Mail sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error sending mail:", err);
    throw new ApiError(400, "error whiling sending mail");
  }
};

export default sendMail;
