import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ message: "Name, phone, and message are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Contact Form Submission",
      text: `Name: ${name}\nPhone: ${phone}\n\n${message}`,
    });

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
});

export default router;