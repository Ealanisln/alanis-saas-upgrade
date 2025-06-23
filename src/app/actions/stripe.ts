"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Note: Stripe payments are now handled by the external API at api.alanis.dev
// This function is kept for compatibility but should be migrated to use the external API

export async function createCheckoutSession(amount: number, name: string): Promise<void> {
  // Get the origin for redirect URLs
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!origin) {
    throw new Error('Origin header is missing');
  }

  // TODO: Replace with API call to api.alanis.dev for payment processing
  // For now, redirect to plans page as fallback
  console.log('Payment processing moved to external API:', { amount, name });
  
  // Temporary redirect - this should be replaced with actual payment flow via external API
  redirect(`${origin}/planes?payment_required=true&amount=${amount}&service=${encodeURIComponent(name)}`);
}