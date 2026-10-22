"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="top-right" theme={theme} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          {children}
          <ThemedToaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
