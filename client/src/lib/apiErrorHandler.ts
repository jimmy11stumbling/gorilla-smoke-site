// API Error handling utilities

/**
 * Custom error class for API errors with additional metadata
 */
export class ApiError extends Error {
  public status: number;
  public data: any;
  public isRetryable: boolean;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
    // Determine if this error can be retried
    this.isRetryable = status >= 500 || status === 429 || status === 408;
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Enhanced fetch function with automatic retry capability and error handling
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3, 
  retryDelay = 1000
): Promise<Response> {
  let retries = 0;
  
  while (true) {
    try {
      const response = await fetch(url, options);
      
      // If response is not OK, throw an error
      if (!response.ok) {
        let errorData: any;
        try {
          // Try to parse error response as JSON
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, use text content
          errorData = await response.text();
        }
        
        throw new ApiError(
          errorData?.message || `API error: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      
      return response;
    } catch (error) {
      // Check if we've reached max retries or if error is not retryable
      if (error instanceof ApiError) {
        if (retries >= maxRetries || !error.isRetryable) {
          throw error;
        }
        
        // For rate limiting (429), use the Retry-After header if available
        if (error.status === 429) {
          const retryAfter = parseInt(error.data?.headers?.['retry-after'] || '0', 10);
          if (retryAfter > 0) {
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            retries++;
            continue;
          }
        }
      } else if (retries >= maxRetries) {
        // For network errors (not ApiError), retry based on maxRetries
        throw error;
      }
      
      // Exponential backoff
      const delay = retryDelay * Math.pow(2, retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

/**
 * Process API response with proper error handling
 */
export async function processApiResponse<T = any>(response: Response): Promise<T> {
  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error processing API response:', error);
    throw new ApiError(
      'Failed to process API response',
      500,
      { originalError: String(error) }
    );
  }
}

/**
 * Complete API request function with retry, validation, and error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  try {
    const response = await fetchWithRetry(url, options, maxRetries);
    return await processApiResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      // Log and rethrow
      console.error(`API Error (${error.status}):`, error.message, error.data);
      throw error;
    } else {
      // Handle network or other errors
      console.error('Network or unknown error:', error);
      throw new ApiError(
        'Network or unknown error occurred',
        0,
        { originalError: String(error) }
      );
    }
  }
}