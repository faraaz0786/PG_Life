import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // cache data for 60s = less spinner
      gcTime: 5 * 60_000,         // keep in memory for 5m
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;