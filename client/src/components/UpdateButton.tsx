import React from 'react';
import { Button } from '@/components/ui/button';

export function UpdateButton() {
  return (
    <Button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      aria-label="Update application"
    >
      Update now
    </Button>
  );
}