import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM;

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!fromAddress) {
    throw new Error("RESEND_FROM is not set");
  }

  return resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
    text,
  });
}
