"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a query client with sensible defaults
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}