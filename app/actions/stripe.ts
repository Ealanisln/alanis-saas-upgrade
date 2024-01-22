"use server";

import type { Stripe } from "stripe";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/lib/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(amount: number, name: string): Promise<void> {
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name:  "Alanis Web Dev",
              description: name,
            },
            unit_amount: formatAmountForStripe(amount, CURRENCY),
          },
        },
      ],
      mode: "payment",
      success_url: `${headers().get(
        "origin",
      )}/shop/orders/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get("origin")}/plans`,
    });

    redirect(checkoutSession.url)

}
