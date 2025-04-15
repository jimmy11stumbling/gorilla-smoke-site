import * as React from "react";
import { useState, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useApiErrorHandler } from "@/hooks/use-api-error";
import { apiRequest } from "@/lib/apiErrorHandler";

// Import our component modules
import {
  CartView,
  CustomerDetailsForm,
  SuccessView,
  useModalAccessibility,
  OrderFormValues
} from "./order";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define steps for the order process
type OrderStep = "cart" | "details" | "success";

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [orderStep, setOrderStep] = useState<OrderStep>("cart");
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const { handleError } = useApiErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Setup accessibility features for the modal
  const { closeButtonRef } = useModalAccessibility({
    isOpen,
    onClose,
    modalRef
  });

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Form submission with enhanced error handling
  const onSubmit = async (data: OrderFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare order data for API
      const orderData = {
        order: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone || null,
          status: 'pending', 
          total,
          notes: data.notes,
        },
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
      };
      
      // Using enhanced API request with better error handling, timeout, and retries
      const response = await apiRequest<{ success: boolean; message?: string; orderId?: number; }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        }
      }, 2, 30000) // Allow up to 2 retries and 30s timeout for order submission
      
      if (response && response.success) {
        // Order successful
        clearCart();
        setOrderStep("success");
        toast({
          title: "Order placed successfully!",
          description: response.message || "We'll start preparing your order right away.",
          duration: 5000,
        });
      } else {
        throw new Error(response?.message || "Order submission failed");
      }
    } catch (error) {
      // Use enhanced error handler for consistent error handling
      handleError(error, "order submission", {
        showToast: true,
        toastDuration: 7000,
        logError: true
      });
      
      // Show a more user-friendly message for connectivity issues
      if (error instanceof Error && error.message.includes("Network")) {
        toast({
          title: "Connection issue",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
          duration: 7000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing on success view
  const handleSuccessClose = () => {
    setOrderStep("cart");
    onClose();
  };

  // Render the appropriate view based on the current step
  const renderStepContent = () => {
    switch (orderStep) {
      case "cart":
        return <CartView 
                onNextStep={() => setOrderStep("details")} 
                onClose={onClose} 
              />;
      case "details":
        return <CustomerDetailsForm 
                onPrevStep={() => setOrderStep("cart")} 
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />;
      case "success":
        return <SuccessView onClose={handleSuccessClose} />;
      default:
        return <CartView 
                onNextStep={() => setOrderStep("details")} 
                onClose={onClose} 
              />;
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-secondary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 border border-border shadow-xl"
        tabIndex={-1} // Not focusable itself, but its children are
      >
        <div className="flex justify-between items-center mb-6">
          <h3 
            id="modal-title" 
            className="text-2xl font-bold font-oswald tracking-wide text-white"
          >
            {orderStep === "success" ? "Order Confirmed" : "Your Order"}
          </h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="text-2xl text-foreground/80 hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded-sm"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
}
