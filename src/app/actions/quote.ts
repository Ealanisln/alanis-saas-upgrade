"use server";

import { sendQuoteEmail, type QuoteEmailData } from "@/lib/email";

interface QuoteFormData {
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

interface QuoteResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Server action to submit a quote request via Resend email
 * This provides a direct email notification without depending on external API
 */
export async function submitQuoteRequest(
  data: QuoteFormData,
): Promise<QuoteResult> {
  // Validation
  if (!data.name?.trim()) {
    return {
      success: false,
      message: "Name is required",
      error: "VALIDATION_ERROR",
    };
  }

  if (!data.email?.trim()) {
    return {
      success: false,
      message: "Email is required",
      error: "VALIDATION_ERROR",
    };
  }

  // Normalize email before validation
  const normalizedEmail = data.email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      success: false,
      message: "Invalid email format",
      error: "VALIDATION_ERROR",
    };
  }

  if (!data.services || data.services.length === 0) {
    return {
      success: false,
      message: "At least one service is required",
      error: "VALIDATION_ERROR",
    };
  }

  try {
    const emailData: QuoteEmailData = {
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone?.trim(),
      company: data.company?.trim(),
      services: data.services,
      totalAmount: data.totalAmount,
      clientType: data.clientType,
      urgency: data.urgency,
      notes: data.notes?.trim(),
    };

    const result = await sendQuoteEmail(emailData);

    if (result.success) {
      return {
        success: true,
        message:
          "Quote request submitted successfully! We will contact you soon.",
      };
    } else {
      console.error("Quote email failed:", result.error);
      return {
        success: false,
        message: "Failed to submit quote request. Please try again.",
        error: result.error,
      };
    }
  } catch (error) {
    console.error("Error submitting quote:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
