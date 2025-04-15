import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useApiErrorHandler } from "@/hooks/use-api-error";
import { z } from "zod";
import { apiRequest } from "@/lib/apiErrorHandler";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define steps for the order process
type OrderStep = "cart" | "details" | "success";

// Order form schema
const orderFormSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [orderStep, setOrderStep] = useState<OrderStep>("cart");
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const { handleError } = useApiErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
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

  // Render the cart view
  const renderCart = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-white">Your Order</h4>
        <p className="text-foreground/70 text-sm">Review your items before checkout</p>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-lg">
          <i className="fas fa-shopping-cart text-4xl text-foreground/30 mb-3"></i>
          <p className="text-foreground/50">Your cart is empty</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => onClose()}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="bg-card rounded-md divide-y divide-border">
              {items.map((item) => (
                <div key={item.menuItem.id} className="p-4 flex items-center">
                  <div className="w-14 h-14 rounded overflow-hidden mr-4">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-white">{item.menuItem.name}</h5>
                    <p className="text-sm text-foreground/70">${item.menuItem.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </Button>
                    <span className="w-8 text-center text-white">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => removeItem(item.menuItem.id)}
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-card rounded-md p-4 space-y-2">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button 
                onClick={() => setOrderStep("details")}
                className="bg-primary hover:bg-primary/80"
              >
                Continue to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render the customer details form
  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-white">Customer Details</h4>
        <p className="text-foreground/70 text-sm">Please provide your contact information</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="customerName" className="text-white">Full Name *</label>
          <Input 
            id="customerName"
            className="bg-card border-border text-white"
            placeholder="Your full name"
            {...form.register("customerName")}
          />
          {form.formState.errors.customerName && (
            <p className="text-destructive text-sm">{form.formState.errors.customerName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="customerEmail" className="text-white">Email *</label>
          <Input 
            id="customerEmail"
            className="bg-card border-border text-white"
            placeholder="your.email@example.com"
            type="email"
            {...form.register("customerEmail")}
          />
          {form.formState.errors.customerEmail && (
            <p className="text-destructive text-sm">{form.formState.errors.customerEmail.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="customerPhone" className="text-white">Phone Number</label>
          <Input 
            id="customerPhone"
            className="bg-card border-border text-white"
            placeholder="(123) 456-7890"
            {...form.register("customerPhone")}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="notes" className="text-white">Special Instructions</label>
          <Textarea 
            id="notes"
            className="bg-card border-border text-white"
            placeholder="Special instructions for your order..."
            {...form.register("notes")}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOrderStep("cart")}
          >
            Back to Cart
          </Button>
          
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  // Render the success view
  const renderSuccessView = () => (
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
        onClick={() => {
          setOrderStep("cart");
          onClose();
        }}
      >
        Back to Menu
      </Button>
    </div>
  );

  // Render the appropriate view based on the current step
  const renderStepContent = () => {
    switch (orderStep) {
      case "cart":
        return renderCart();
      case "details":
        return renderDetailsForm();
      case "success":
        return renderSuccessView();
      default:
        return renderCart();
    }
  };

  // Create ref for the close button to focus it when modal opens
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  // Store previous active element to restore focus when modal closes
  useEffect(() => {
    if (isOpen) {
      // Store the active element to restore focus later
      const previousActiveElement = document.activeElement as HTMLElement;
      
      // Focus the close button when the modal opens
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);
      
      // Set up clean-up function to restore focus when component unmounts or modal closes
      return () => {
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Trap focus inside the modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      // Get all focusable elements inside the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // If shift + tab and we're on the first element, move to the last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab and we're on the last element, move to the first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, orderStep]);

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
