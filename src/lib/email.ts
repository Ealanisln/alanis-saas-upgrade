/**
 * Contact-form email delivery via Resend.
 * @see https://resend.com/docs
 */

import { Resend } from "resend";

const EMAIL_FROM = process.env.EMAIL_FROM || "Alanis Dev <noreply@alanis.dev>";
const EMAIL_TO = process.env.EMAIL_TO || "emmanuel@alanis.dev";

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  subject: string;
}

/**
 * Sends the contact-form notification to the site owner, with reply-to set
 * to the sender. Returns false (after logging) instead of throwing so the
 * server action can map failures to a localized error.
 */
export async function sendContactEmail(
  data: ContactEmailData,
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Contact email not sent.");
    return false;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: data.email,
      subject: data.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1D4ED8;">New contact form submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
          </div>
          <p style="color: #666; font-size: 12px;">Sent from the contact form at alanis.dev</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending contact email:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending contact email:", error);
    return false;
  }
}

/**
 * Escape HTML to prevent injection in the email template.
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
