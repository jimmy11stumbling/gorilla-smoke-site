import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ApiError, fetchWithRetry, processApiResponse } from "./apiErrorHandler";

// Default number of retries for API requests
const DEFAULT_MAX_RETRIES = 3;

/**
 * Helper function to throw appropriate errors for non-OK responses
 * This function ensures proper error objects are created with detailed information
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
      errorData,
      res.url
    );
  }
}

/**
 * Legacy API request function - kept for backwards compatibility
 * This function maintains the original interface while leveraging the enhanced error handling
 * @deprecated Use the enhanced apiRequest from apiErrorHandler.ts instead
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<any> {
  try {
    // Forward to the enhanced implementation in apiErrorHandler.ts
    const options: RequestInit = {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    };

    // Import the enhanced apiRequest from apiErrorHandler
    const { apiRequest: enhancedApiRequest } = await import('./apiErrorHandler');
    
    // Call with appropriate parameters
    return await enhancedApiRequest(url, options, maxRetries);
  } catch (error) {
    console.error(`API Request Failed (${method} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Query function factory for React Query
 * Creates a query function with enhanced error handling and configurable behavior
 * for authentication errors
 */
export function getQueryFn<T>({ 
  on401: unauthorizedBehavior, 
  maxRetries = DEFAULT_MAX_RETRIES,
  timeout = 30000 // Default timeout of 30 seconds
}: {
  on401: UnauthorizedBehavior;
  maxRetries?: number;
  timeout?: number;
}): QueryFunction<T> {
  return async ({ queryKey }) => {
    // Get the URL from the query key
    const url = Array.isArray(queryKey) ? queryKey[0] as string : String(queryKey);
    const startTime = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
    
    try {
      // Setup request options with tracking headers
      const headers = new Headers();
      headers.set('X-Request-ID', requestId);
      headers.set('Accept', 'application/json');
      
      const options: RequestInit = {
        credentials: "include",
        headers
      };

      // Use enhanced fetchWithRetry for better reliability
      const { fetchWithRetry: enhancedFetchWithRetry } = await import('./apiErrorHandler');
      const res = await enhancedFetchWithRetry(url, options, maxRetries, 1000, timeout);

      // Handle 401 according to configuration
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null as any;
      }

      // Use enhanced processApiResponse with better content type detection
      const { processApiResponse: enhancedProcessApiResponse } = await import('./apiErrorHandler');
      const data = await enhancedProcessApiResponse(res);
      
      // Log slow queries for performance monitoring
      const responseTime = Date.now() - startTime;
      if (responseTime > 1000) { // Log queries taking >1s
        console.warn(`Slow query (${responseTime}ms) for: ${url} (Request ID: ${requestId})`);
      }
      
      return data as T;
    } catch (error) {
      // Keep compatibility with unauthorized behavior setting
      if (error instanceof ApiError && 
          error.status === 401 && 
          unauthorizedBehavior === "returnNull") {
        return null as any;
      }
      
      // Enhanced error logging with detailed context
      if (error instanceof ApiError) {
        console.error(`Query failed for: ${url} [Status: ${error.status}]`, {
          error: error.message,
          url,
          requestId,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
          data: error.data
        });
      } else {
        console.error(`Network or unknown error querying: ${url}`, {
          error: String(error),
          requestId,
          duration: Date.now() - startTime
        });
      }
      
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
