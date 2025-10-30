import type { JSX } from "react";
import PrintObject from "@/components/Checkout/PrintObject";

// Mock data structure for checkout session (replace with API call when needed)
interface CheckoutSession {
  id: string;
  customer_details?: {
    name?: string;
  };
  payment_method_types?: string[];
  amount_total?: number;
}

const PlanDetails = async ({
  searchParams,
}: {
  searchParams: { session_id: string };
}): Promise<JSX.Element> => {
  // TODO: Replace with API call to external backend to get session details
  // For now, showing a placeholder structure
  const checkoutSession: CheckoutSession = {
    id: searchParams.session_id || 'placeholder',
    customer_details: {
      name: 'Customer Name'
    },
    payment_method_types: ['card'],
    amount_total: 0
  };

  // In the future, this should be:
  // const checkoutSession = await apiClient.getCheckoutSession(searchParams.session_id);

  return (
    <>
      <div className="w-full">
        <div
          className="wow fadeInUp relative z-10 rounded-sm bg-white px-8 py-10 shadow-three hover:shadow-one dark:bg-gray-dark dark:shadow-two dark:hover:shadow-gray-dark"
          data-wow-delay=".1s"
        >
          <h2 className="pb-8 text-xl font-semibold">Order details </h2>
          <PrintObject content={checkoutSession} />
          <div className="mt-4 text-sm text-gray-500">
            <p>Note: Payment processing is now handled by our external API.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanDetails;
