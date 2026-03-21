const emailJsEndpoint = "https://api.emailjs.com/api/v1.0/email/send";
const serviceId = process.env.EMAILJS_SERVICE_ID || "default_service";
const templateId = process.env.EMAILJS_TEMPLATE_ID;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const fromName = process.env.EMAILJS_FROM_NAME || "Awani Hotel And Suites";

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
  if (!templateId) {
    throw new Error("EMAILJS_TEMPLATE_ID is not set");
  }

  if (!publicKey) {
    throw new Error("EMAILJS_PUBLIC_KEY is not set");
  }

  const response = await fetch(emailJsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email: to,
        subject,
        message_html: html,
        message_text: text,
        from_name: fromName,
      },
    }),
  });

  const rawResponse = await response.text();

  if (!response.ok) {
    throw new Error(rawResponse || "EmailJS request failed.");
  }

  return {
    data: {
      id: null,
      provider: "emailjs",
      response: rawResponse || "OK",
    },
  };
}
