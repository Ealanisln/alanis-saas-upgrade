"use client";
import { useState, useEffect } from "react"; // Good practice to include these here too
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  // Hydration safety for the Provider itself is also good practice
  const [mounted, setMounted] = useState(false);
  
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render children in SSR to prevent hydration mismatch
    // ThemeProvider and QueryClient will hydrate on client side
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}