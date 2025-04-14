import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

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

  // Form submission
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
        },
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
      };
      
      const response = await apiRequest(
        "POST",
        "/api/orders",
        orderData
      );
      
      // Order successful
      clearCart();
      setOrderStep("success");
      toast({
        title: "Order placed successfully!",
        description: "We'll start preparing your order right away.",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: "Please try again or contact us directly by phone.",
        variant: "destructive",
      });
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

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
      onClick={handleBackgroundClick}
    >
      <div className="bg-secondary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 border border-border shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-oswald tracking-wide text-white">
            {orderStep === "success" ? "Order Confirmed" : "Your Order"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-2xl text-foreground/80 hover:text-accent"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
}
