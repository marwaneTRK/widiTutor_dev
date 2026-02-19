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

const buildVerificationEmailTemplate = ({ verificationUrl, logoUrl }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
    <style>
      body {
        margin: 0;
        padding: 20px 10px;
        background: #f4f7f2;
        font-family: "Segoe UI", Arial, Helvetica, sans-serif;
        color: #1f2937;
      }
      .container {
        max-width: 620px;
        margin: 0 auto;
      }
      .card {
        background: #ffffff;
        border-radius: 18px;
        padding: 34px 28px;
        border: 1px solid #e7f4df;
        box-shadow: 0 16px 40px rgba(23, 37, 84, 0.08);
      }
      .logo {
        text-align: center;
        margin-bottom: 16px;
      }
      .logo img {
        width: 148px;
        height: auto;
      }
      h1 {
        margin: 0 0 10px;
        text-align: center;
        font-size: 28px;
        line-height: 1.25;
      }
      p {
        margin: 0 0 14px;
        text-align: center;
        line-height: 1.7;
        color: #4b5563;
      }
      .button-wrap {
        text-align: center;
        margin: 26px 0 16px;
      }
      .button {
        display: inline-block;
        background: #5DD62C;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
        font-size: 15px;
        padding: 14px 28px;
        border-radius: 12px;
        box-shadow: 0 10px 24px rgba(93, 214, 44, 0.35);
      }
      .fallback {
        text-align: left;
        background: #f9fafb;
        border: 1px dashed #d1d5db;
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
          padding: 24px 16px;
        }
        h1 {
          font-size: 23px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="logo">
          <img src="${logoUrl}" alt="WidiTutor logo" />
        </div>
        <h1>Verify Your Email</h1>
        <p>Welcome to WidiTutor. Confirm your email to activate your account and continue your learning journey securely.</p>
        <div class="button-wrap">
          <a class="button" href="${verificationUrl}" target="_blank" rel="noopener noreferrer">Verify Email</a>
        </div>
        <p>If the button does not work, use this link:</p>
        <div class="fallback">${verificationUrl}</div>
        <div class="footer">This link expires in 1 hour for your security.</div>
      </div>
    </div>
  </body>
</html>
`;

const sendVerificationEmail = async ({ to, verificationUrl, logoUrl }) => {
  const html = buildVerificationEmailTemplate({ verificationUrl, logoUrl });
  await sendEmail({ to, subject: "Verify your email address", html });
};

const buildResetPasswordEmailTemplate = ({ resetUrl, logoUrl }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
    <style>
      body {
        margin: 0;
        padding: 20px 10px;
        background: #f4f7f2;
        font-family: "Segoe UI", Arial, Helvetica, sans-serif;
        color: #1f2937;
      }
      .container {
        max-width: 620px;
        margin: 0 auto;
      }
      .card {
        background: #ffffff;
        border-radius: 18px;
        padding: 34px 28px;
        border: 1px solid #e7f4df;
        box-shadow: 0 16px 40px rgba(23, 37, 84, 0.08);
      }
      .logo {
        text-align: center;
        margin-bottom: 16px;
      }
      .logo img {
        width: 148px;
        height: auto;
      }
      h1 {
        margin: 0 0 10px;
        text-align: center;
        font-size: 28px;
        line-height: 1.25;
      }
      p {
        margin: 0 0 14px;
        text-align: center;
        line-height: 1.7;
        color: #4b5563;
      }
      .button-wrap {
        text-align: center;
        margin: 26px 0 16px;
      }
      .button {
        display: inline-block;
        background: #5DD62C;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
        font-size: 15px;
        padding: 14px 28px;
        border-radius: 12px;
        box-shadow: 0 10px 24px rgba(93, 214, 44, 0.35);
      }
      .fallback {
        text-align: left;
        background: #f9fafb;
        border: 1px dashed #d1d5db;
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
          padding: 24px 16px;
        }
        h1 {
          font-size: 23px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="logo">
          <img src="${logoUrl}" alt="WidiTutor logo" />
        </div>
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the button below to set a new one.</p>
        <div class="button-wrap">
          <a class="button" href="${resetUrl}" target="_blank" rel="noopener noreferrer">Reset Password</a>
        </div>
        <p>If the button does not work, use this link:</p>
        <div class="fallback">${resetUrl}</div>
        <div class="footer">This link expires in 1 hour. If you did not request this, you can ignore this email.</div>
      </div>
    </div>
  </body>
</html>
`;

const sendResetPasswordEmail = async ({ to, resetUrl, logoUrl }) => {
  const html = buildResetPasswordEmailTemplate({ resetUrl, logoUrl });
  await sendEmail({ to, subject: "Reset your password", html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  buildVerificationEmailTemplate,
  sendResetPasswordEmail,
  buildResetPasswordEmailTemplate,
};
