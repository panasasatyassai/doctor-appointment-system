const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("MAIL USER:", process.env.GMAIL);
    console.log("PASS EXISTS:", !!process.env.PASS);

    const info = await transporter.sendMail({
      from: `"Doccure Support" <${process.env.GMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error(" Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendMail;
