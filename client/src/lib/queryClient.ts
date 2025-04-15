import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ApiError, fetchWithRetry, processApiResponse } from "./apiErrorHandler";

// Default number of retries for API requests
const DEFAULT_MAX_RETRIES = 3;

/**
 * Helper function to throw appropriate errors for non-OK responses
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      const text = (await res.text()) || res.statusText;
      errorData = { message: text };
    }
    throw new ApiError(
      errorData.message || `${res.status}: ${res.statusText}`,
      res.status,
      errorData
    );
  }
}

/**
 * Enhanced API request function with retry logic and error handling
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<any> {
  try {
    const options: RequestInit = {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    };

    const res = await fetchWithRetry(url, options, maxRetries);
    
    // Parse JSON response if content-type is application/json
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await processApiResponse(res);
    }
    return res;
  } catch (error) {
    console.error(`API Request Failed (${method} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Query function factory for React Query
 */
export function getQueryFn<T>({ 
  on401: unauthorizedBehavior, 
  maxRetries = DEFAULT_MAX_RETRIES 
}: {
  on401: UnauthorizedBehavior;
  maxRetries?: number;
}): QueryFunction<T> {
  return async ({ queryKey }) => {
    try {
      const options: RequestInit = {
        credentials: "include",
      };

      const res = await fetchWithRetry(queryKey[0] as string, options, maxRetries);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null as any;
      }

      const data = await processApiResponse(res);
      return data as T;
    } catch (error) {
      if (error instanceof ApiError && 
          error.status === 401 && 
          unauthorizedBehavior === "returnNull") {
        return null as any;
      }
      
      // Log the error with query details for troubleshooting
      console.error(`Query failed for: ${queryKey[0]}`, error);
      throw error;
    }
  };
}

/**
 * Configure and export the query client with enhanced error handling and retry logic
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn<unknown>({ 
        on401: "throw",
        maxRetries: DEFAULT_MAX_RETRIES
      }),
      refetchInterval: false,
      refetchOnWindowFocus: import.meta.env.PROD ? true : false,
      staleTime: 5 * 60 * 1000, // 5 minutes in production
      retry: (failureCount, error) => {
        // Don't retry for 4xx errors except specific retryable ones
        if (error instanceof ApiError) {
          if (!error.isRetryable) return false;
          // Cap retries at 3
          return failureCount < 3;
        }
        // For network errors, retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error) => {
        // Similar retry logic for mutations
        if (error instanceof ApiError) {
          if (!error.isRetryable) return false;
          return failureCount < 2; 
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => 1000 * 2 ** attemptIndex,
    },
  },
});
