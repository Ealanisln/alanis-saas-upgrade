"use client";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from "react"; // Good practice to include these here too

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
    // Return null or a loading state until mounted
    // Prevents hydration mismatch for the provider children
    // You might need to adjust your RootLayout if null causes issues
    // e.g., return <html...><body...>{null}</body></html>
     return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}