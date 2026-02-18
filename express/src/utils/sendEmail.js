const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS are required to send emails.");
  }

  await transporter.sendMail({
    from: `"WidiTutor" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const buildVerificationEmailTemplate = ({ verificationUrl }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
    <style>
      body {
        margin: 0;
        padding: 24px 12px;
        background: #f3f4f6;
        font-family: Arial, Helvetica, sans-serif;
        color: #111827;
      }
      .container {
        max-width: 560px;
        margin: 0 auto;
      }
      .card {
        background: #ffffff;
        border-radius: 14px;
        padding: 28px 24px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
      }
      .logo {
        text-align: center;
        margin-bottom: 18px;
      }
      .logo img {
        width: 120px;
        height: auto;
      }
      h1 {
        margin: 0 0 10px;
        text-align: center;
        font-size: 24px;
        line-height: 1.25;
      }
      p {
        margin: 0 0 14px;
        text-align: center;
        line-height: 1.6;
        color: #4b5563;
      }
      .button-wrap {
        text-align: center;
        margin: 24px 0 16px;
      }
      .button {
        display: inline-block;
        background: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
        padding: 13px 22px;
        border-radius: 10px;
      }
      .fallback {
        text-align: left;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px;
        font-size: 13px;
        color: #374151;
        word-break: break-all;
      }
      .footer {
        margin-top: 18px;
        font-size: 12px;
        text-align: center;
        color: #9ca3af;
      }
      @media (max-width: 600px) {
        .card {
          padding: 22px 16px;
        }
        h1 {
          font-size: 21px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="logo">
          <img src="https://via.placeholder.com/150" alt="WidiTutor logo" />
        </div>
        <h1>Welcome to WidiTutor</h1>
        <p>Thanks for signing up. Please verify your email address to activate your account and start learning.</p>
        <div class="button-wrap">
          <a class="button" href="${verificationUrl}" target="_blank" rel="noopener noreferrer">Verify Email</a>
        </div>
        <p>If the button does not work, copy and paste this link in your browser:</p>
        <div class="fallback">${verificationUrl}</div>
        <div class="footer">This link expires in 1 hour for your security.</div>
      </div>
    </div>
  </body>
</html>
`;

const sendVerificationEmail = async ({ to, verificationUrl }) => {
  const html = buildVerificationEmailTemplate({ verificationUrl });
  await sendEmail({ to, subject: "Verify your email address", html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  buildVerificationEmailTemplate,
};
