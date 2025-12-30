/**
 * Email notification system using Resend
 * @see https://resend.com/docs
 */

import { Resend } from "resend";

// Lazy-initialized Resend client (to avoid build-time errors when API key is not set)
let resendInstance: Resend | null = null;

function getResendClient(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Configuration
const EMAIL_FROM = process.env.EMAIL_FROM || "Alanis Dev <noreply@alanis.dev>";
const EMAIL_TO = process.env.EMAIL_TO || "contact@alanis.dev";

// Types
interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface QuoteEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: Array<{
    name: string;
    price: number;
  }>;
  totalAmount: number;
  clientType: "pyme" | "enterprise";
  urgency: "normal" | "urgent";
  notes?: string;
}

interface CustomerConfirmationData {
  to: string;
  name: string | null;
  service: string;
  amount: number | null;
  sessionId: string;
}

interface InternalNotificationData {
  type: "new_payment" | "payment_failed" | "refund";
  service: string;
  customer: string | null;
  amount: number | null;
  sessionId: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Check if Resend is properly configured
 */
function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Send contact form email
 */
export async function sendContactEmail(
  data: ContactEmailData,
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.warn("Resend API key not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const resend = getResendClient();

    // Send notification to site owner
    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: data.email,
      subject: data.subject || `New contact from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
          </div>
          <p style="color: #666; font-size: 12px;">This message was sent from the contact form at alanis.dev</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending contact email:", error);
      return { success: false, error: error.message };
    }

    // Send confirmation to the user
    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: "Thanks for reaching out! - Alanis Dev",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">Thanks for your message, ${escapeHtml(data.name)}!</h2>
          <p>I've received your message and will get back to you as soon as possible, usually within 24-48 hours.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
          </div>
          <p>In the meantime, feel free to check out my <a href="https://alanis.dev/portfolio" style="color: #4F7AFA;">portfolio</a> or connect with me on social media.</p>
          <p>Best regards,<br><strong>Emmanuel Alanis</strong><br>Full-Stack Developer</p>
        </div>
      `,
    });

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send quote request email
 */
export async function sendQuoteEmail(
  data: QuoteEmailData,
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.warn("Resend API key not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  const servicesHtml = data.services
    .map(
      (s) => `<li>${escapeHtml(s.name)}: $${s.price.toLocaleString()} USD</li>`,
    )
    .join("");

  const urgencyLabel = data.urgency === "urgent" ? "🚀 Urgent" : "Normal";
  const clientTypeLabel =
    data.clientType === "enterprise" ? "Enterprise" : "PYME/Startup";

  try {
    const resend = getResendClient();

    // Send to site owner
    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: data.email,
      subject: `New Quote Request - $${data.totalAmount.toLocaleString()} USD`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">New Quote Request</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Client Information</h3>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
            ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
            <p><strong>Client Type:</strong> ${clientTypeLabel}</p>
            <p><strong>Urgency:</strong> ${urgencyLabel}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Requested Services</h3>
            <ul>${servicesHtml}</ul>
            <p style="font-size: 18px; margin-top: 15px;"><strong>Total: $${data.totalAmount.toLocaleString()} USD</strong></p>
          </div>

          ${
            data.notes
              ? `
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Additional Notes</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.notes)}</div>
          </div>
          `
              : ""
          }

          <p style="color: #666; font-size: 12px;">This quote request was submitted from the calculator at alanis.dev</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending quote email:", error);
      return { success: false, error: error.message };
    }

    // Send confirmation to client
    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: "Your Quote Request - Alanis Dev",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">Thanks for your quote request, ${escapeHtml(data.name)}!</h2>
          <p>I've received your project details and will review them carefully.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Request Summary</h3>
            <ul>${servicesHtml}</ul>
            <p style="font-size: 18px; margin-top: 15px;"><strong>Estimated Total: $${data.totalAmount.toLocaleString()} USD</strong></p>
          </div>

          <p>I'll get back to you within 24-48 hours with a detailed proposal. If you have any questions in the meantime, feel free to reply to this email.</p>

          <p>Best regards,<br><strong>Emmanuel Alanis</strong><br>Full-Stack Developer</p>
        </div>
      `,
    });

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error("Error sending quote email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send confirmation email to customer after payment
 */
export async function sendCustomerConfirmationEmail(
  data: CustomerConfirmationData,
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.warn("Resend API key not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const resend = getResendClient();

    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      subject: `Payment Confirmation - ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">Thank you for your purchase!</h2>
          <p>Hi ${escapeHtml(data.name || "there")},</p>
          <p>We've received your payment for <strong>${escapeHtml(data.service)}</strong>.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> $${((data.amount || 0) / 100).toLocaleString()} USD</p>
            <p><strong>Transaction ID:</strong> ${data.sessionId}</p>
          </div>

          <p>Our team will contact you within 24 hours to start working on your project.</p>

          <p>If you have any questions, please don't hesitate to reach out.</p>

          <p>Best regards,<br><strong>Emmanuel Alanis</strong><br>Full-Stack Developer</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending customer confirmation:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error("Error sending customer confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send internal notification to your team
 */
export async function sendInternalNotification(
  data: InternalNotificationData,
): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.warn("Resend API key not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  const subjectMap = {
    new_payment: `🎉 New Payment - ${data.service}`,
    payment_failed: `⚠️ Payment Failed - ${data.service}`,
    refund: `💰 Refund Processed - ${data.service}`,
  };

  const typeLabel = {
    new_payment: "New Payment Received",
    payment_failed: "Payment Failed",
    refund: "Refund Processed",
  };

  try {
    const resend = getResendClient();

    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: subjectMap[data.type],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F7AFA;">${typeLabel[data.type]}</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Service:</strong> ${escapeHtml(data.service)}</p>
            <p><strong>Customer:</strong> ${escapeHtml(data.customer || "Unknown")}</p>
            <p><strong>Amount:</strong> $${((data.amount || 0) / 100).toLocaleString()} USD</p>
            <p><strong>Session ID:</strong> ${data.sessionId}</p>
          </div>

          <p><a href="https://dashboard.stripe.com" style="color: #4F7AFA;">View in Stripe Dashboard →</a></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending internal notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error("Error sending internal notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Escape HTML to prevent XSS in email templates
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

// Export types for external use
export type {
  ContactEmailData,
  QuoteEmailData,
  CustomerConfirmationData,
  InternalNotificationData,
  EmailResult,
};
