"use server";

import type { Stripe } from "stripe";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/lib/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(unitAmount: number,): Promise<void> {
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Alanis Web Dev",
              description: `Charging you`,
            },
            unit_amount: formatAmountForStripe(unitAmount, CURRENCY),
          },
        },
      ],
      mode: "payment",
      success_url: `${headers().get(
        "origin",
      )}/purchase/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get("origin")}/purchase`,
    });

    redirect(checkoutSession.url)

}

export async function createPaymentIntent(
  data: FormData,
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get("customDonation") as string),
        CURRENCY,
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  return { client_secret: paymentIntent.client_secret as string };
}
