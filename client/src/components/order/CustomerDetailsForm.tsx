import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Order form schema
const orderFormSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

interface CustomerDetailsFormProps {
  onPrevStep: () => void;
  onSubmit: (data: OrderFormValues) => void;
  isSubmitting: boolean;
}

export function CustomerDetailsForm({ onPrevStep, onSubmit, isSubmitting }: CustomerDetailsFormProps) {
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

  return (
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
            onClick={onPrevStep}
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
}