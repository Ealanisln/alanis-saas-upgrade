/**
 * Email notification system using Resend
 * @see https://resend.com/docs
 */

import { Resend } from "resend";

// Lazy-initialized Resend client (to avoid build-time errors when API key is not set)
let resendInstance: Resend | null = null;

function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY || process.env.SEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY or SEND_API_KEY environment variable is not set",
      );
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Configuration
const EMAIL_FROM =
  process.env.EMAIL_FROM || "Alanis Dev <noreply@updates.alanis.dev>";
const EMAIL_TO = process.env.EMAIL_TO || "emmanuel@alanis.dev";

// Supported locales
type SupportedLocale = "en" | "es";

// Types
interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  locale?: SupportedLocale;
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
  clientType: "startup" | "pyme" | "enterprise";
  urgency: "normal" | "express" | "urgent";
  notes?: string;
  locale?: SupportedLocale;
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
  return Boolean(process.env.RESEND_API_KEY || process.env.SEND_API_KEY);
}

/**
 * Get localized content for contact confirmation email
 */
function getContactConfirmationContent(
  locale: SupportedLocale,
  name: string,
  message: string,
): { subject: string; html: string } {
  const content = {
    en: {
      subject: "Thanks for reaching out! - Alanis Dev",
      heading: `Thanks for your message, ${name}!`,
      body: "I've received your message and will get back to you as soon as possible, usually within 24-48 hours.",
      yourMessage: "Your message:",
      meanwhile:
        'In the meantime, feel free to check out my <a href="https://alanis.dev/portfolio" style="color: #4F7AFA;">portfolio</a> or connect with me on social media.',
      regards: "Best regards,",
      role: "Full-Stack Developer",
    },
    es: {
      subject: "¡Gracias por contactarme! - Alanis Dev",
      heading: `¡Gracias por tu mensaje, ${name}!`,
      body: "He recibido tu mensaje y te responderé lo antes posible, normalmente en 24-48 horas.",
      yourMessage: "Tu mensaje:",
      meanwhile:
        'Mientras tanto, puedes visitar mi <a href="https://alanis.dev/es/portfolio" style="color: #4F7AFA;">portafolio</a> o conectar conmigo en redes sociales.',
      regards: "Saludos cordiales,",
      role: "Desarrollador Full-Stack",
    },
  };

  const t = content[locale];

  return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F7AFA;">${t.heading}</h2>
        <p>${t.body}</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>${t.yourMessage}</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
        </div>
        <p>${t.meanwhile}</p>
        <p>${t.regards}<br><strong>Emmanuel Alanis</strong><br>${t.role}</p>
      </div>
    `,
  };
}

/**
 * Get localized content for quote confirmation email
 */
function getQuoteConfirmationContent(
  locale: SupportedLocale,
  name: string,
  servicesHtml: string,
  totalAmount: number,
): { subject: string; html: string } {
  const content = {
    en: {
      subject: "Your Quote Request - Alanis Dev",
      heading: `Thanks for your quote request, ${name}!`,
      body: "I've received your project details and will review them carefully.",
      summary: "Your Request Summary",
      estimatedTotal: "Estimated Total:",
      followUp:
        "I'll get back to you within 24-48 hours with a detailed proposal. If you have any questions in the meantime, feel free to reply to this email.",
      regards: "Best regards,",
      role: "Full-Stack Developer",
    },
    es: {
      subject: "Tu Solicitud de Cotización - Alanis Dev",
      heading: `¡Gracias por tu solicitud de cotización, ${name}!`,
      body: "He recibido los detalles de tu proyecto y los revisaré cuidadosamente.",
      summary: "Resumen de tu Solicitud",
      estimatedTotal: "Total Estimado:",
      followUp:
        "Te responderé en 24-48 horas con una propuesta detallada. Si tienes alguna pregunta mientras tanto, no dudes en responder a este correo.",
      regards: "Saludos cordiales,",
      role: "Desarrollador Full-Stack",
    },
  };

  const t = content[locale];

  return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F7AFA;">${t.heading}</h2>
        <p>${t.body}</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${t.summary}</h3>
          <ul>${servicesHtml}</ul>
          <p style="font-size: 18px; margin-top: 15px;"><strong>${t.estimatedTotal} $${totalAmount.toLocaleString()} USD</strong></p>
        </div>

        <p>${t.followUp}</p>

        <p>${t.regards}<br><strong>Emmanuel Alanis</strong><br>${t.role}</p>
      </div>
    `,
  };
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

    // Send confirmation to the user (localized)
    const locale = data.locale || "en";
    const confirmationContent = getContactConfirmationContent(
      locale,
      escapeHtml(data.name),
      escapeHtml(data.message),
    );

    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: confirmationContent.subject,
      html: confirmationContent.html,
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

  const urgencyLabels = {
    urgent: "🚀 Urgent",
    express: "⚡ Express",
    normal: "Normal",
  };
  const clientTypeLabels = {
    enterprise: "Enterprise",
    pyme: "PYME",
    startup: "Startup",
  };
  const urgencyLabel = urgencyLabels[data.urgency];
  const clientTypeLabel = clientTypeLabels[data.clientType];

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

    // Send confirmation to client (localized)
    const locale = data.locale || "en";
    const quoteConfirmationContent = getQuoteConfirmationContent(
      locale,
      escapeHtml(data.name),
      servicesHtml,
      data.totalAmount,
    );

    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: quoteConfirmationContent.subject,
      html: quoteConfirmationContent.html,
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
