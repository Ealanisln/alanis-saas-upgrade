import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { 
  QuoteRequest, 
  CreateQuoteResponse, 
  ListQuotesResponse,
  QuoteResponse 
} from '@/types/calculator/service-calculator.types';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';

interface UseQuotesOptions {
  page?: number;
  limit?: number;
  status?: string;
  clientType?: string;
}

export const useQuotes = (options: UseQuotesOptions = {}) => {
  const { client, queries, mutations } = useApi();
  const queryClient = useQueryClient();

  // Query for fetching quotes with pagination
  const quotesQuery = useQuery({
    queryKey: ['quotes', options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options.page) searchParams.set('page', options.page.toString());
      if (options.limit) searchParams.set('limit', options.limit.toString());
      if (options.status) searchParams.set('status', options.status);
      if (options.clientType) searchParams.set('clientType', options.clientType);

      const url = `/quotes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      return client.fetchQuotes(options);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });

  // Mutation for creating a new quote
  const createQuoteMutation = useMutation({
    mutationFn: async (request: QuoteRequest): Promise<QuoteResponse> => {
      const response = await client.post<QuoteResponse>('/quotes', {
        clientName: request.clientInfo?.name,
        clientEmail: request.clientInfo?.email,
        clientCompany: request.clientInfo?.company,
        clientPhone: request.clientInfo?.phone,
        clientType: request.clientType,
        urgency: request.urgency,
        services: request.services,
        // Calculate these values using the quote calculator
        subtotal: 0, // Will be calculated by the backend
        discounts: 0,
        taxes: 0,
        total: 0,
        estimatedDelivery: 0,
        totalHours: 0,
        projectDescription: request.projectDetails?.description,
        deadline: request.projectDetails?.deadline?.toISOString(),
        budget: request.projectDetails?.budget,
        requirements: request.projectDetails?.requirements
      });

      if (!response.success) {
        throw new Error(response.message || 'Error creating quote');
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch quotes after successful creation
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  // Mutation for syncing with Invoice Ninja
  const syncWithInvoiceNinjaMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const response = await client.post('/quotes/invoice-ninja', quoteData);
      if (!response.success) {
        throw new Error(response.message || 'Error syncing with Invoice Ninja');
      }
      return response.data;
    },
  });

  return {
    // Data
    quotes: Array.isArray(quotesQuery.data?.data) ? quotesQuery.data.data : [],
    pagination: quotesQuery.data?.pagination,
    
    // Loading states
    loading: quotesQuery.isLoading,
    creating: createQuoteMutation.isPending,
    syncing: syncWithInvoiceNinjaMutation.isPending,
    
    // Error states
    error: quotesQuery.error?.message || 
           createQuoteMutation.error?.message || 
           syncWithInvoiceNinjaMutation.error?.message || 
           null,
    
    // Actions
    createQuote: createQuoteMutation.mutateAsync,
    syncWithInvoiceNinja: syncWithInvoiceNinjaMutation.mutateAsync,
    refetch: quotesQuery.refetch,
    
    // Utility functions
    clearError: () => {
      createQuoteMutation.reset();
      syncWithInvoiceNinjaMutation.reset();
    },
    
    reset: () => {
      queryClient.removeQueries({ queryKey: ['quotes'] });
      createQuoteMutation.reset();
      syncWithInvoiceNinjaMutation.reset();
    }
  };
};

// Legacy support - maintain the old interface for backward compatibility
export const useQuotesLegacy = () => {
  const api = useQuotes();
  
  return {
    loading: api.loading || api.creating,
    error: api.error,
    quotes: api.quotes,
    currentQuote: null, // This would need to be managed separately
    createQuote: api.createQuote,
    getQuotes: async (params = {}) => {
      // This doesn't fit well with the new pattern, but for compatibility
      // Deprecated: Use the reactive queries instead
      if (process.env.NODE_ENV === 'development') {
        console.warn('getQuotes is deprecated. Use the reactive queries instead.');
      }
    },
    clearError: api.clearError,
    reset: api.reset
  };
};
