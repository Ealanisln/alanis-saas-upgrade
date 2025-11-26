"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe, STRIPE_CURRENCY } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout Session
 * @param amount - Amount in smallest currency unit (e.g., cents for USD)
 * @param name - Product/service name
 * @returns Redirects to Stripe Checkout
 */
export async function createCheckoutSession(
  amount: number,
  name: string,
  locale: string = "en",
): Promise<void> {
  // Get the origin for redirect URLs
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!origin) {
    throw new Error("Origin header is missing");
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: STRIPE_CURRENCY,
          product_data: {
            name,
            description: `${name} - Web Development Service`,
          },
          unit_amount: amount, // Amount in cents (e.g., 50000 = $500.00)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/plans?canceled=true`,
    metadata: {
      service_name: name,
      amount: amount.toString(),
    },
  });

  // Redirect to Stripe Checkout
  if (!session.url) {
    throw new Error("Checkout session URL is missing");
  }

  // Note: redirect() throws NEXT_REDIRECT which is expected behavior
  redirect(session.url);
}
