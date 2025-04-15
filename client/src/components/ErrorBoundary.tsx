import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
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
    
    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      // This is where you'd log to a service like Sentry, LogRocket, etc.
      // Example: logErrorToService(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-card text-card-foreground">
          <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-lg border border-border">
            <h2 className="text-3xl font-bold text-primary mb-4">Oops, something went wrong</h2>
            <p className="text-base mb-6">
              We're sorry, but something unexpected happened. We've been notified and are looking into it.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="p-4 bg-secondary rounded-md mb-6 overflow-auto max-h-48">
                <p className="font-mono text-sm text-white">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary/80 transition"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full py-2 bg-secondary text-secondary-foreground font-medium rounded hover:bg-secondary/80 transition"
              >
                Try Again
              </button>
              <a
                href="/"
                className="w-full py-2 text-center border border-primary text-primary font-medium rounded hover:bg-primary/10 transition"
              >
                Go to Home Page
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;