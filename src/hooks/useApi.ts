import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api/client';
import { QuoteRequest, QuoteResponse, EmailRequest } from '@/lib/api/types';

export function useApi() {
  const client = useMemo(() => createApiClient(), []);
  const queryClient = useQueryClient();

  // Queries
  const useQuotes = () => {
    return useQuery({
      queryKey: ['quotes'],
      queryFn: () => client.fetchQuotes(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Mutations
  const useCreateQuote = () => {
    return useMutation({
      mutationFn: (quoteData: QuoteRequest) => client.createQuote(quoteData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
      },
    });
  };

  const useSendEmail = () => {
    return useMutation({
      mutationFn: (emailData: EmailRequest) => client.sendEmail(emailData),
    });
  };

  const useSyncWithInvoiceNinja = () => {
    return useMutation({
      mutationFn: (quoteData: any) => client.syncWithInvoiceNinja(quoteData),
    });
  };

  return {
    client,
    queries: {
      useQuotes,
    },
    mutations: {
      useCreateQuote,
      useSendEmail,
      useSyncWithInvoiceNinja,
    },
  };
}
