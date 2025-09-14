const nodemailer = require('nodemailer');

let cached; // reuse between calls

async function getTransporter() {
  if (cached) return cached;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    cached = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return cached;
  }

  // Dev fallback: Ethereal (logs preview URL)
  const testAcc = await nodemailer.createTestAccount();
  cached = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAcc.user, pass: testAcc.pass },
  });
  return cached;
}

async function sendMail({ to, subject, html, text }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'PG-Life <no-reply@pg-life.test>',
    to,
    subject,
    text,
    html,
  });
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log('✉️  Ethereal preview:', preview);
  return { messageId: info.messageId, preview };
}

module.exports = { sendMail };
