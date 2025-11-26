/**
 * Email notification system
 * TODO: Integrate with your email service (Resend, SendGrid, etc.)
 */

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

/**
 * Send confirmation email to customer
 */
export async function sendCustomerConfirmationEmail(
  data: CustomerConfirmationData,
) {
  // eslint-disable-next-line no-console
  console.log("📧 Sending confirmation email to:", data.to);

  // TODO: Implement with your email service
  // Example with Resend:
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Alanis <noreply@alanis.dev>',
    to: data.to,
    subject: `Payment Confirmation - ${data.service}`,
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Hi ${data.name},</p>
      <p>We've received your payment for <strong>${data.service}</strong>.</p>
      <p>Amount: $${(data.amount || 0) / 100} USD</p>
      <p>Our team will contact you within 24 hours to start working on your project.</p>
      <p>Transaction ID: ${data.sessionId}</p>
    `
  });
  */

  // For now, just log
  // eslint-disable-next-line no-console
  console.log("Email data:", {
    to: data.to,
    name: data.name,
    service: data.service,
    amount: `$${(data.amount || 0) / 100} USD`,
    sessionId: data.sessionId,
  });

  return { success: true };
}

/**
 * Send internal notification to your team
 */
export async function sendInternalNotification(data: InternalNotificationData) {
  // eslint-disable-next-line no-console
  console.log("🔔 Sending internal notification");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _recipientEmail = process.env.EMAIL_TO || "contact@alanis.dev";

  // TODO: Implement with your email service
  // Example with Resend:
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Payments <payments@alanis.dev>',
    to: recipientEmail,
    subject: `🎉 New Payment Received - ${data.service}`,
    html: `
      <h1>New Payment Received!</h1>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Customer:</strong> ${data.customer}</p>
      <p><strong>Amount:</strong> $${(data.amount || 0) / 100} USD</p>
      <p><strong>Session ID:</strong> ${data.sessionId}</p>
      <p>Check Stripe dashboard for full details.</p>
    `
  });
  */

  // For now, just log
  // eslint-disable-next-line no-console
  console.log("Notification data:", {
    type: data.type,
    service: data.service,
    customer: data.customer,
    amount: `$${(data.amount || 0) / 100} USD`,
  });

  return { success: true };
}
