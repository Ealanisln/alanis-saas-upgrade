"use client";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/lib/utils/stripe-helpers";
import { Button } from "../ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";

interface Props {
  amount: number;
  name?: string;
}

const StripeButton = ({ amount, name }: Props) => {
  const handleCheckout = async () => {
    const unitAmount = formatAmountForStripe(amount, CURRENCY);
    await createCheckoutSession(unitAmount, name);
  };

  return (
    <div>
      <Button className="w-full rounded-xl text-white" onClick={handleCheckout}>
        Pay with Stripe
      </Button>
    </div>
  );
};

export default StripeButton;
