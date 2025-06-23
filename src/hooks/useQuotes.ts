import { useState, useCallback } from 'react';
import { 
  QuoteRequest, 
  CreateQuoteResponse, 
  ListQuotesResponse,
  QuoteResponse 
} from '@/types/calculator/service-calculator.types';

interface UseQuotesState {
  loading: boolean;
  error: string | null;
  quotes: QuoteResponse[];
  currentQuote: QuoteResponse | null;
}

interface UseQuotesReturn extends UseQuotesState {
  createQuote: (request: QuoteRequest) => Promise<QuoteResponse | null>;
  getQuotes: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientType?: string;
  }) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useQuotes = (): UseQuotesReturn => {
  const [state, setState] = useState<UseQuotesState>({
    loading: false,
    error: null,
    quotes: [],
    currentQuote: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const createQuote = useCallback(async (request: QuoteRequest): Promise<QuoteResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: request.clientInfo?.name,
          clientEmail: request.clientInfo?.email,
          clientCompany: request.clientInfo?.company,
          clientPhone: request.clientInfo?.phone,
          clientType: request.clientType,
          urgency: request.urgency,
          services: request.services,
          // Calculate these values using the quote calculator
          subtotal: 0, // Will be calculated
          discounts: 0,
          taxes: 0,
          total: 0,
          estimatedDelivery: 0,
          totalHours: 0,
          projectDescription: request.projectDetails?.description,
          deadline: request.projectDetails?.deadline?.toISOString(),
          budget: request.projectDetails?.budget,
          requirements: request.projectDetails?.requirements
        })
      });

      const data: CreateQuoteResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error creating quote');
      }

      setState(prev => ({
        ...prev,
        currentQuote: data.data!,
        loading: false
      }));

      return data.data!;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating quote';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  const getQuotes = useCallback(async (params: {
    page?: number;
    limit?: number;
    status?: string;
    clientType?: string;
  } = {}): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.status) searchParams.set('status', params.status);
      if (params.clientType) searchParams.set('clientType', params.clientType);

      const response = await fetch(`/api/quotes?${searchParams.toString()}`);
      const data: ListQuotesResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error fetching quotes');
      }

      setState(prev => ({
        ...prev,
        quotes: data.data || [],
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching quotes';
      setError(errorMessage);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      quotes: [],
      currentQuote: null
    });
  }, []);

  return {
    ...state,
    createQuote,
    getQuotes,
    clearError,
    reset
  };
};
