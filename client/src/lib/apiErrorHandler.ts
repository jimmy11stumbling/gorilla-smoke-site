// API Error handling utilities

/**
 * Custom error class for API errors with additional metadata
 * Provides detailed information for better error handling and user feedback
 */
export class ApiError extends Error {
  public status: number;
  public data: any;
  public isRetryable: boolean;
  public url?: string;
  public timestamp: Date;
  public requestId?: string;

  constructor(message: string, status: number, data?: any, url?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.url = url;
    this.timestamp = new Date();
    
    // Determine if this error can be retried
    this.isRetryable = status >= 500 || status === 429 || status === 408;
    
    // Extract request ID if available for tracking
    this.requestId = data?.requestId;
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
    
    // Ensure the error stack trace captures this constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
  
  /**
   * Returns a user-friendly error message based on the HTTP status code
   * Useful for displaying error messages in the UI
   */
  getUserFriendlyMessage(): string {
    // Common status code translations for better UX
    const statusMessages: Record<number, string> = {
      400: "The request was invalid. Please check your input and try again.",
      401: "You need to be logged in to access this feature.",
      403: "You don't have permission to access this resource.",
      404: "The requested information could not be found.",
      408: "The request timed out. Please check your connection and try again.",
      409: "There was a conflict with the current state of the resource.",
      422: "The server couldn't process your request. Please check your input.",
      429: "Too many requests. Please try again later.",
      500: "Something went wrong on our end. We're working to fix it.",
      502: "Server is temporarily unavailable. Please try again later.",
      503: "Service is currently unavailable. Please try again later.",
      504: "Server timeout. Please try again later."
    };
    
    return statusMessages[this.status] || this.message;
  }
}

/**
 * Enhanced fetch function with automatic retry capability and error handling
 * Features:
 * - Exponential backoff with jitter for improved resiliency
 * - Request timeout support with AbortController
 * - Detailed logging for debugging
 * - Request ID tracking for monitoring
 * - Retry-After header support for rate limiting
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3, 
  retryDelay = 1000,
  timeout = 30000 // 30 second default timeout
): Promise<Response> {
  let retries = 0;
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  
  // Add request ID and other tracking headers
  const headers = new Headers(options.headers || {});
  headers.set('X-Request-ID', requestId);
  if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  const enhancedOptions = {
    ...options,
    headers
  };
  
  while (true) {
    try {
      // Create an AbortController for this request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Add the signal to our fetch options
      const fetchOptions = {
        ...enhancedOptions,
        signal: controller.signal
      };
      
      // Attempt the fetch
      const response = await fetch(url, fetchOptions);
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // If response is not OK, throw an error
      if (!response.ok) {
        let errorData: any;
        try {
          // Try to parse error response as JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            // If it's not JSON, get text content
            const text = await response.text();
            errorData = { message: text };
          }
        } catch (e) {
          // If parsing fails completely
          errorData = { message: 'Could not parse error response' };
        }
        
        // Add request ID to error data for tracking
        errorData.requestId = requestId;
        
        throw new ApiError(
          errorData?.message || `API error: ${response.status} ${response.statusText}`,
          response.status,
          errorData,
          url
        );
      }
      
      // Log response time for performance monitoring if slow
      const responseTime = Date.now() - startTime;
      if (responseTime > 2000) { // Log slow requests (>2s)
        console.warn(`Slow API request to ${url} - ${responseTime}ms (Request ID: ${requestId})`);
      }
      
      return response;
    } catch (error: any) {
      // Check if this was a timeout abort
      if (error.name === 'AbortError') {
        console.warn(`Request timeout for ${url} after ${timeout}ms (Request ID: ${requestId})`);
        
        if (retries < maxRetries) {
          retries++;
          continue;
        }
        
        throw new ApiError(
          'Request timeout', 
          408, 
          { requestId, timeout },
          url
        );
      }
      
      // For existing ApiError instances
      if (error instanceof ApiError) {
        if (retries >= maxRetries || !error.isRetryable) {
          // Add URL if missing (for backward compatibility)
          if (!error.url) {
            error.url = url;
          }
          throw error;
        }
        
        // For rate limiting (429), use the Retry-After header if available
        if (error.status === 429) {
          const retryAfter = parseInt(error.data?.headers?.['retry-after'] || '0', 10);
          if (retryAfter > 0) {
            const retryMs = retryAfter * 1000;
            console.log(`Rate limited. Retrying after ${retryAfter}s (Request ID: ${requestId})`);
            await new Promise(resolve => setTimeout(resolve, retryMs));
            retries++;
            continue;
          }
        }
      } else if (retries >= maxRetries) {
        // For network errors (not ApiError), retry based on maxRetries
        const totalTime = Date.now() - startTime;
        console.error(`API request to ${url} failed after ${totalTime}ms and ${retries} retries (Request ID: ${requestId})`);
        
        throw new ApiError(
          `Network error: ${error.message || 'Unknown error'}`, 
          0, // Network errors don't have HTTP status codes
          { originalError: String(error), requestId },
          url
        );
      }
      
      // Exponential backoff with jitter for more natural retry pattern
      const jitter = Math.random() * 500; // Random jitter up to 500ms
      const delay = retryDelay * Math.pow(2, retries) + jitter;
      console.log(`Retry ${retries + 1}/${maxRetries} for ${url} after ${Math.round(delay)}ms (Request ID: ${requestId})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

/**
 * Process API response with proper error handling
 * Parses JSON data and handles various response formats
 */
export async function processApiResponse<T = any>(response: Response): Promise<T> {
  const url = response.url;
  let data;
  
  try {
    // Check content type to determine how to parse the response
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Parse as JSON
      data = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      // Handle text responses (convert to object with message)
      const text = await response.text();
      data = { message: text, text };
    } else if (contentType && contentType.includes('application/octet-stream')) {
      // For binary data, just return the response itself
      // The caller will need to handle appropriately
      return response as unknown as T;
    } else {
      // Default to trying JSON
      try {
        data = await response.json();
      } catch (e) {
        // Fall back to text if JSON parsing fails
        const text = await response.text();
        data = { message: text, text };
      }
    }
    
    return data as T;
  } catch (error) {
    // Get the request ID from the headers if available
    const requestId = response.headers.get('X-Request-ID');
    
    console.error('Error processing API response:', error);
    throw new ApiError(
      'Failed to process API response',
      500,
      { 
        originalError: String(error),
        requestId,
        contentType: response.headers.get('content-type')
      },
      url
    );
  }
}

/**
 * Complete API request function with retry, validation, and error handling
 * This is the main function that should be used for all API requests
 * 
 * Features:
 * - Automatic retries with exponential backoff
 * - Detailed error handling with user-friendly messages
 * - Request tracking with IDs
 * - Performance monitoring for slow requests
 * - Content type detection and appropriate parsing
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeout = 30000
): Promise<T> {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  
  try {
    // Add authentication headers if needed
    // const authHeaders = await getAuthHeaders();
    
    // Default headers with content type and tracking information
    const headers = new Headers(options.headers || {});
    headers.set('X-Request-ID', requestId);
    
    // Add Content-Type for non-GET requests if not explicitly set
    if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add Accept header for JSON if not set
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    
    const enhancedOptions = {
      ...options,
      headers
    };
    
    // Perform the fetch with retry capability
    const response = await fetchWithRetry(url, enhancedOptions, maxRetries, 1000, timeout);
    
    // Process the response appropriately
    return await processApiResponse<T>(response);
  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    if (error instanceof ApiError) {
      // Log detailed error information
      console.error(
        `API Error [${error.status}] after ${totalTime}ms:`, 
        error.message, 
        error.url || url,
        error.requestId || requestId
      );
      
      // Enhanced logging for specific error types
      if (error.status === 401 || error.status === 403) {
        console.warn('Authentication or authorization error detected');
        // Could trigger auth refresh or redirect to login
      }
      
      if (error.status === 429) {
        console.warn(`Rate limiting detected for ${url}`);
        // Could implement app-wide rate limit handling
      }
      
      // Rethrow the error for component-level handling
      throw error;
    } else {
      // For non-ApiError instances (usually network errors)
      console.error('Network or unknown error:', error);
      
      // Create a new ApiError with detailed context
      throw new ApiError(
        'Network or unknown error occurred',
        0,
        { 
          originalError: String(error), 
          requestId,
          timing: {
            duration: totalTime,
            timestamp: new Date().toISOString()
          }
        },
        url
      );
    }
  }
}