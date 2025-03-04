import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2025-01-27.acacia",
  appInfo: {
    name: "Alanis Web Developer",
    url: "https://www.alanis.dev",
  },
});
