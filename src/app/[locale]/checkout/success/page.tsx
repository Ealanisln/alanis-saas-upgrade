import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful - Alanis",
  description: "Your payment was processed successfully",
};

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-dark rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-body-color dark:text-gray-300 mb-2">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {session_id && (
          <p className="text-sm text-body-color dark:text-gray-400 mb-6">
            Session ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{session_id}</code>
          </p>
        )}

        <div className="space-y-3 mt-8">
          <p className="text-body-color dark:text-gray-300">
            We'll send you a confirmation email shortly with details about your service.
          </p>

          <p className="text-sm text-body-color dark:text-gray-400">
            Our team will contact you within 24 hours to start working on your project.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center rounded-md border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
