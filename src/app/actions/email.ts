"use server";

import { sendContactEmail } from "@/lib/email";
import { verifyTurnstileToken } from "@/lib/turnstile";

interface FormInputs {
  name: string;
  email: string;
  message: string;
  locale?: "en" | "es";
}

const sendEmail = async (
  data: FormInputs,
  turnstileToken?: string,
): Promise<string> => {
  // Verify Turnstile token if configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      throw new Error("Please complete the verification");
    }

    const verification = await verifyTurnstileToken(turnstileToken);
    if (!verification.success) {
      throw new Error(verification.error || "Verification failed");
    }
  }

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    throw new Error("All fields are required");
  }

  // Normalize inputs
  const normalizedEmail = data.email.trim().toLowerCase();

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error("Invalid email format");
  }

  try {
    const result = await sendContactEmail({
      name: data.name.trim(),
      email: normalizedEmail,
      message: data.message.trim(),
      subject: `New contact from ${data.name}`,
      locale: data.locale,
    });

    if (result.success) {
      return "Your message has been sent successfully!";
    } else {
      console.error("Email sending failed:", result.error);
      throw new Error("Failed to send message. Please try again later.");
    }
  } catch (error) {
    // Re-throw our own errors (including Turnstile verification errors)
    if (
      error instanceof Error &&
      (error.message === "Failed to send message. Please try again later." ||
        error.message === "Please complete the verification" ||
        error.message.includes("Verification"))
    ) {
      throw error;
    }
    console.error("Error sending contact email:", error);
    throw new Error("An error occurred while sending your message.");
  }
};

export default sendEmail;
