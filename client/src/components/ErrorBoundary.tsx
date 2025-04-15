import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from "@/components/ErrorFallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Features:
 * - Catches errors in any child component
 * - Prevents app crashes from UI errors
 * - Provides a user-friendly error message
 * - Allows custom error handling through onError prop
 * - Can be reset to recover from errors
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      // This is where you'd log to a service like Sentry, LogRocket, etc.
      // Example: logErrorToService(error, errorInfo);
    }
  }

  public resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise use our default ErrorFallback component
      return (
        <ErrorFallback 
          error={this.state.error as Error} 
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;