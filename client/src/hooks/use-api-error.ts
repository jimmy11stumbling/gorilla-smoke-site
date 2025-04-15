import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/apiErrorHandler';

/**
 * Custom hook for handling API errors consistently across the application
 * Features:
 * - User-friendly error toasts with appropriate messages
 * - Error logging with context
 * - Different handling strategies based on error type
 * - Consistent error behavior application-wide
 */
export function useApiErrorHandler() {
  const { toast } = useToast();
  
  /**
   * Handles API errors with appropriate UI feedback
   * @param error The error that occurred
   * @param context Additional context about where the error happened
   * @param options Configuration options for error handling
   */
  const handleError = useCallback((
    error: unknown, 
    context: string = 'unknown',
    options: {
      showToast?: boolean;
      toastDuration?: number;
      logError?: boolean;
      redirectOnAuthError?: boolean;
    } = {}
  ) => {
    // Default options
    const {
      showToast = true,
      toastDuration = 5000,
      logError = true,
      redirectOnAuthError = false
    } = options;
    
    // Determine if this is an API error
    if (error instanceof ApiError) {
      // Log detailed information about the API error
      if (logError) {
        console.error(
          `API Error [${error.status}] in ${context}:`,
          error.message,
          {
            url: error.url,
            timestamp: error.timestamp,
            requestId: error.requestId,
            data: error.data
          }
        );
      }
      
      // Handle specific error types
      switch (error.status) {
        // Authentication errors
        case 401:
          if (redirectOnAuthError) {
            // Could redirect to login page
            // window.location.href = '/login';
            console.log('Authentication error - would redirect to login');
          }
          
          if (showToast) {
            toast({
              title: 'Authentication Required',
              description: 'Please sign in to continue.',
              variant: 'destructive',
              duration: toastDuration
            });
          }
          break;
          
        // Authorization errors
        case 403:
          if (showToast) {
            toast({
              title: 'Access Denied',
              description: 'You don\'t have permission to perform this action.',
              variant: 'destructive',
              duration: toastDuration
            });
          }
          break;
          
        // Not found errors
        case 404:
          if (showToast) {
            toast({
              title: 'Not Found',
              description: 'The requested resource could not be found.',
              variant: 'destructive',
              duration: toastDuration
            });
          }
          break;
          
        // Rate limiting
        case 429:
          if (showToast) {
            toast({
              title: 'Too Many Requests',
              description: 'Please slow down and try again later.',
              variant: 'destructive',
              duration: toastDuration
            });
          }
          break;
          
        // Server errors
        case 500:
        case 502:
        case 503:
        case 504:
          if (showToast) {
            toast({
              title: 'Server Error',
              description: 'We\'re experiencing technical difficulties. Please try again later.',
              variant: 'destructive',
              duration: toastDuration
            });
          }
          break;
          
        // Default for other API errors
        default:
          if (showToast) {
            toast({
              title: 'Error',
              description: error.getUserFriendlyMessage(),
              variant: 'destructive',
              duration: toastDuration
            });
          }
      }
    } else {
      // For non-API errors (network, parsing, etc.)
      if (logError) {
        console.error(`Error in ${context}:`, error);
      }
      
      if (showToast) {
        toast({
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
          duration: toastDuration
        });
      }
    }
    
    // Return the error for further handling if needed
    return error;
  }, [toast]);
  
  return { handleError };
}