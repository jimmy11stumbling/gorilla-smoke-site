import * as React from "react";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
  onClose: () => void;
}

export function SuccessView({ onClose }: SuccessViewProps) {
  return (
    <div className="text-center py-10">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <i className="fas fa-check text-2xl text-green-500"></i>
      </div>
      <h4 className="text-2xl font-bold mb-2 text-white">Order Confirmed!</h4>
      <p className="mb-6 text-foreground/70">
        Thank you for your order. We'll start preparing it right away!
      </p>
      <Button
        className="bg-primary hover:bg-primary/80"
        onClick={onClose}
      >
        Back to Menu
      </Button>
    </div>
  );
}