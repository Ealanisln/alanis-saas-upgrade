'use client';

import React, { useState } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import { useApi } from '@/hooks/useApi';
import { QuoteRequest } from '@/types/calculator/service-calculator.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Example component demonstrating the new API client usage
 * This shows both the direct API client usage and the React Query hooks
 */
export const ApiUsageExample: React.FC = () => {
  const [page, setPage] = useState(1);
  const [emailData, setEmailData] = useState({
    to: [''],
    subject: '',
    content: ''
  });

  // Using the useQuotes hook with React Query
  const {
    quotes,
    pagination,
    loading,
    creating,
    error,
    createQuote,
    refetch
  } = useQuotes({ page, limit: 10 });

  // Using the direct API client
  const { client, mutations } = useApi();
  const { useSendEmail } = mutations;
  const sendEmailMutation = useSendEmail();

  // Example quote creation
  const handleCreateQuote = async () => {
    const exampleQuote: QuoteRequest = {
      services: [
        {
          categoryId: 'web-development',
          optionId: 'basic-website',
          quantity: 1
        }
      ],
      clientType: 'pyme',
      urgency: 'normal',
      clientInfo: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        company: 'Empresa Ejemplo',
        phone: '+34 123 456 789'
      },
      projectDetails: {
        description: 'Sitio web corporativo básico',
        requirements: [
          'Diseño responsive',
          'Formulario de contacto',
          'Integración con redes sociales'
        ]
      }
    };

    try {
      const result = await createQuote(exampleQuote);
      console.log('Quote created:', result);
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  // Example email sending
  const handleSendEmail = async () => {
    if (!emailData.to[0] || !emailData.subject || !emailData.content) {
      alert('Please fill all email fields');
      return;
    }

    try {
      const result = await sendEmailMutation.mutateAsync({
        to: emailData.to.filter(email => email.trim() !== ''),
        subject: emailData.subject,
        content: emailData.content
      });
      console.log('Email sent:', result);
      setEmailData({ to: [''], subject: '', content: '' });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Example direct API client usage
  const handleDirectApiCall = async () => {
    try {
      // Direct API call example
      const response = await client.get('/quotes');
      console.log('Direct API response:', response);
    } catch (error) {
      console.error('Direct API error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        API Client Usage Examples
      </h1>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">Error: {error}</p>
        </Card>
      )}

      {/* Quotes Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Quotes Management</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleCreateQuote}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creating ? 'Creating...' : 'Create Example Quote'}
            </Button>
            
            <Button 
              onClick={() => refetch()}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Loading...' : 'Refresh Quotes'}
            </Button>

            <Button 
              onClick={handleDirectApiCall}
              variant="outline"
            >
              Direct API Call
            </Button>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex gap-2 items-center">
              <Button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
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
                onClick={() => setPage(p => p + 1)}
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
              Quotes ({quotes.length}) {loading && '(Loading...)'}
            </h3>
            {quotes.map((quote) => (
              <div key={quote.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {quote.clientInfo?.name || 'No name'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {quote.clientInfo?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ${quote.calculation?.total?.toLocaleString() || quote.total?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
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
        <h2 className="text-2xl font-semibold mb-4">Email Sending</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To:</label>
            <input
              type="email"
              value={emailData.to[0]}
              onChange={(e) => setEmailData(prev => ({
                ...prev,
                to: [e.target.value]
              }))}
              className="w-full p-2 border rounded-md"
              placeholder="recipient@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject:</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({
                ...prev,
                subject: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              placeholder="Email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content:</label>
            <textarea
              value={emailData.content}
              onChange={(e) => setEmailData(prev => ({
                ...prev,
                content: e.target.value
              }))}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Email content"
            />
          </div>

          <Button 
            onClick={handleSendEmail}
            disabled={sendEmailMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
          </Button>

          {sendEmailMutation.error && (
            <p className="text-red-600 text-sm">
              Error: {sendEmailMutation.error.message}
            </p>
          )}

          {sendEmailMutation.isSuccess && (
            <p className="text-green-600 text-sm">
              Email sent successfully!
            </p>
          )}
        </div>
      </Card>

      {/* Code Examples */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Using React Query Hooks:</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`// Using the useQuotes hook
const { quotes, loading, createQuote } = useQuotes();

// Create a quote
await createQuote(quoteData);

// Data is automatically cached and synchronized`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Using Direct API Client:</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
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