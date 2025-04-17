import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string; // Component name or section for better error context
  resetErrorBoundary?: () => void; // Optional callback to reset the error state
  onError?: (error: Error, info: React.ErrorInfo) => void; // Optional error reporting callback
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Set error info for detailed debugging
    this.setState({ errorInfo });
    
    // Log error for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.resetErrorBoundary) {
      this.props.resetErrorBoundary();
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Modern styled fallback UI with dark mode support
      return (
        <Card className="border-destructive/50 bg-card shadow-md">
          <CardHeader className="bg-destructive/10 border-b border-destructive/30 pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Error in {this.props.name || 'Component'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="font-semibold">Something went wrong</AlertTitle>
              <AlertDescription>{this.state.error?.message || 'An unknown error occurred'}</AlertDescription>
            </Alert>
            
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mb-2 text-xs">
                  Show Technical Details
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md bg-card border border-border p-3 text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap text-foreground/70">
                  {this.state.error?.toString()}
                  <div className="h-px bg-border my-2" />
                  {this.state.errorInfo?.componentStack || ''}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          <CardFooter className="border-t border-border pt-3 flex justify-between">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="default" size="sm" onClick={this.resetBoundary}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Helper hook for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps} name={errorBoundaryProps.name || displayName}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `WithErrorBoundary(${displayName})`;
  return WrappedComponent;
}

export default ErrorBoundary;