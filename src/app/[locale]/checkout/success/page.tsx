import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-dark">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
          Payment Successful!
        </h1>

        <p className="mb-2 text-body-color dark:text-gray-300">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        {session_id && (
          <p className="mb-6 text-sm text-body-color dark:text-gray-400">
            Session ID:{" "}
            <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              {session_id}
            </code>
          </p>
        )}

        <div className="mt-8 space-y-3">
          <p className="text-body-color dark:text-gray-300">
            We'll send you a confirmation email shortly with details about your
            service.
          </p>

          <p className="text-sm text-body-color dark:text-gray-400">
            Our team will contact you within 24 hours to start working on your
            project.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
