"use client";

import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/react-query/getQueryClient";
import type * as React from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
