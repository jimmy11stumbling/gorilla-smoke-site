import React from 'react';
import { Button } from '@/components/ui/button';
import { FallbackProps } from 'react-error-boundary';

/**
 * ErrorFallback component to display user-friendly error information
 * Designed to be used with react-error-boundary library
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-lg p-8 bg-card rounded-lg shadow-lg border border-border text-card-foreground">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Something went wrong</h2>
            <p className="text-card-foreground/80">
              We apologize for the inconvenience. Our team has been notified of this issue.
            </p>
          </div>

          {/* Show error details only in development mode */}
          {isDevelopment && (
            <div className="p-4 bg-secondary/50 rounded-md overflow-auto max-h-48 text-secondary-foreground">
              <p className="font-mono text-sm">{error?.toString()}</p>
              {error?.stack && (
                <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">
                  {error.stack.split('\n').slice(1).join('\n')}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={resetErrorBoundary} className="w-full">
              Try again
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="w-full"
            >
              Refresh page
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="secondary" 
              className="w-full"
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}