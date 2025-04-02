"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react"; // Good practice to include these here too

export function Providers({ children }: { children: React.ReactNode }) {
  // Hydration safety for the Provider itself is also good practice
  const [mounted, setMounted] = useState(false);
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
    <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}