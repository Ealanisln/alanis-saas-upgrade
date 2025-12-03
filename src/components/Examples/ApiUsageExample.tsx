"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { useQuotes } from "@/hooks/useQuotes";
import { QuoteRequest } from "@/types/calculator/service-calculator.types";

/**
 * Example component demonstrating the new API client usage
 * This shows both the direct API client usage and the React Query hooks
 */
export const ApiUsageExample: React.FC = () => {
  const [page, setPage] = useState(1);
  const [emailData, setEmailData] = useState({
    to: [""],
    subject: "",
    content: "",
  });

  // Using the useQuotes hook with React Query
  const { quotes, pagination, loading, creating, error, createQuote, refetch } =
    useQuotes({ page, limit: 10 });

  // Using the direct API client
  const { client, mutations } = useApi();
  const { useSendEmail } = mutations;
  const sendEmailMutation = useSendEmail();

  // Example quote creation
  const handleCreateQuote = async () => {
    const exampleQuote: QuoteRequest = {
      services: [
        {
          categoryId: "web-development",
          optionId: "basic-website",
          quantity: 1,
        },
      ],
      clientType: "pyme",
      urgency: "normal",
      clientInfo: {
        name: "Juan Pérez",
        email: "juan@example.com",
        company: "Empresa Ejemplo",
        phone: "+34 123 456 789",
      },
      projectDetails: {
        description: "Sitio web corporativo básico",
        requirements: [
          "Diseño responsive",
          "Formulario de contacto",
          "Integración con redes sociales",
        ],
      },
    };

    try {
      await createQuote(exampleQuote);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error creating quote:", err);
    }
  };

  // Example email sending
  const handleSendEmail = async () => {
    if (!emailData.to[0] || !emailData.subject || !emailData.content) {
      alert("Please fill all email fields");
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({
        to: emailData.to.filter((email) => email.trim() !== ""),
        subject: emailData.subject,
        content: emailData.content,
      });
      setEmailData({ to: [""], subject: "", content: "" });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sending email:", err);
    }
  };

  // Example direct API client usage
  const handleDirectApiCall = async () => {
    try {
      // Direct API call example
      await client.get("/quotes");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Direct API error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="mb-8 text-center text-3xl font-bold">
        API Client Usage Examples
      </h1>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-4">
          <p className="text-red-600">Error: {error}</p>
        </Card>
      )}

      {/* Quotes Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Quotes Management</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={handleCreateQuote}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creating ? "Creating..." : "Create Example Quote"}
            </Button>

            <Button
              onClick={() => refetch()}
              disabled={loading}
              variant="outline"
            >
              {loading ? "Loading..." : "Refresh Quotes"}
            </Button>

            <Button onClick={handleDirectApiCall} variant="outline">
              Direct API Call
            </Button>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* Quotes List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Quotes ({quotes.length}) {loading && "(Loading...)"}
            </h3>
            {quotes.map((quote) => (
              <div key={quote.id} className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {quote.clientInfo?.name || "No name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {quote.clientInfo?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: $
                      {quote.calculation?.total?.toLocaleString() ||
                        quote.total?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Email Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Email Sending</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email-to"
              className="mb-1 block text-sm font-medium"
            >
              To:
            </label>
            <input
              id="email-to"
              type="email"
              value={emailData.to[0]}
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  to: [e.target.value],
                }))
              }
              className="w-full rounded-md border p-2"
              placeholder="recipient@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="email-subject"
              className="mb-1 block text-sm font-medium"
            >
              Subject:
            </label>
            <input
              id="email-subject"
              type="text"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              className="w-full rounded-md border p-2"
              placeholder="Email subject"
            />
          </div>

          <div>
            <label
              htmlFor="email-content"
              className="mb-1 block text-sm font-medium"
            >
              Content:
            </label>
            <textarea
              id="email-content"
              value={emailData.content}
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="h-32 w-full rounded-md border p-2"
              placeholder="Email content"
            />
          </div>

          <Button
            onClick={handleSendEmail}
            disabled={sendEmailMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
          </Button>

          {sendEmailMutation.error && (
            <p className="text-sm text-red-600">
              Error: {sendEmailMutation.error.message}
            </p>
          )}

          {sendEmailMutation.isSuccess && (
            <p className="text-sm text-green-600">Email sent successfully!</p>
          )}
        </div>
      </Card>

      {/* Code Examples */}
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Code Examples</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-medium">
              Using React Query Hooks:
            </h3>
            <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
              {`// Using the useQuotes hook
const { quotes, loading, createQuote } = useQuotes();

// Create a quote
await createQuote(quoteData);

// Data is automatically cached and synchronized`}
            </pre>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">
              Using Direct API Client:
            </h3>
            <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
              {`// Using the API client directly
const { client } = useApi();

// Make API calls
const response = await client.get('/quotes');
const newQuote = await client.post('/quotes', data);`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};
