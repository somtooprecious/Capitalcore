import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@capitalcore.com";
  const transport = getTransport();

  if (!transport) {
    console.info("[email] SMTP not configured — logged only:", { to, subject });
    return { sent: false, logged: true };
  }

  await transport.sendMail({ from, to, subject, html, text: text ?? html.replace(/<[^>]+>/g, "") });
  return { sent: true, logged: false };
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  return sendEmail({
    to,
    subject: "Welcome to CapitalCore AI",
    html: `<p>Hi ${name ?? "there"},</p><p>Your CapitalCore AI account is ready. Sign in to explore markets, daily tasks, and your dashboard.</p>`,
  });
}

export async function sendDepositEmail(to: string, amount: number, reference: string) {
  return sendEmail({
    to,
    subject: "Deposit received — CapitalCore AI",
    html: `<p>We recorded a deposit of <strong>$${amount.toFixed(2)}</strong>.</p><p>Reference: <code>${reference}</code></p>`,
  });
}

export async function sendWithdrawalEmail(to: string, amount: number, status: string) {
  return sendEmail({
    to,
    subject: `Withdrawal ${status.toLowerCase()} — CapitalCore AI`,
    html: `<p>Your withdrawal of <strong>$${amount.toFixed(2)}</strong> is now <strong>${status}</strong>.</p>`,
  });
}

export async function sendTradeEmail(to: string, symbol: string, side: string, status: string) {
  return sendEmail({
    to,
    subject: `Trade ${status.toLowerCase()} — ${symbol}`,
    html: `<p>Your <strong>${side}</strong> order for <strong>${symbol}</strong> is <strong>${status}</strong>.</p>`,
  });
}
