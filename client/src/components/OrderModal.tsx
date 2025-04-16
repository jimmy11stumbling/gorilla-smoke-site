import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/use-websocket';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SiUbereats, SiDoordash, SiGrubhub } from 'react-icons/si';
import { useLocation } from '../contexts/LocationContext';

// Lead form schema
const leadFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' })
    .optional()
    .or(z.literal('')),
  marketingConsent: z.boolean().default(true),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface DeliveryServiceUrls {
  ubereats: string;
  doordash: string;
  grubhub: string;
}

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId?: string;
}

export default function OrderModal({ open, onOpenChange, locationId = 'delmar' }: OrderModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryUrls, setDeliveryUrls] = useState<DeliveryServiceUrls | null>(null);
  const [stage, setStage] = useState<'form' | 'delivery-options'>('form');
  const [leadId, setLeadId] = useState<number | null>(null);
  
  // Connect to WebSocket
  const { sendJsonMessage, connected } = useWebSocket();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      marketingConsent: true
    }
  });
  
  // Get delivery URLs for the selected location
  const fetchDeliveryUrls = async (locationId: string) => {
    try {
      const response = await fetch(`/api/delivery-services/${locationId}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
      
      throw new Error('Failed to fetch delivery options');
    } catch (error) {
      console.error('Error fetching delivery options:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve delivery options. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Submit lead info and move to delivery options
  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      // Submit lead to database
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          marketingConsent: data.marketingConsent,
          locationId,
          source: 'website_order_modal'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit your information');
      }
      
      // Parse lead ID from response
      const responseData = await response.json();
      if (responseData.success && responseData.data && responseData.data.id) {
        setLeadId(responseData.data.id);
        
        // Send WebSocket notification for lead creation
        if (connected) {
          const sent = sendJsonMessage({
            type: 'order_notification',
            orderId: responseData.data.id,
            locationId: locationId,
            customerName: data.name,
            status: 'lead_created',
            timestamp: Date.now()
          });
          
          if (!sent) {
            console.warn('Failed to send WebSocket notification for lead creation');
          }
        }
      }
      
      // Fetch delivery URLs for the selected location
      const urls = await fetchDeliveryUrls(locationId);
      if (urls) {
        setDeliveryUrls(urls);
        setStage('delivery-options');
        
        toast({
          title: 'Thank you!',
          description: 'Your information has been saved. Please select a delivery service.',
        });
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your information. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delivery service selection
  const handleDeliveryServiceClick = (service: keyof DeliveryServiceUrls) => {
    if (!deliveryUrls) return;
    
    // Track which service was selected
    fetch('/api/leads/track-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leadId: leadId,
        service,
        locationId
      })
    })
    .then(response => {
      if (response.ok) {
        // Send WebSocket notification for service selection
        if (connected) {
          const sent = sendJsonMessage({
            type: 'order_notification',
            orderId: leadId,
            locationId: locationId,
            service: service,
            customerName: form.getValues('name'),
            status: 'service_selected',
            timestamp: Date.now()
          });
          
          if (!sent) {
            console.warn('Failed to send WebSocket notification for service selection');
          }
        }
      }
    })
    .catch(err => {
      console.error('Error tracking service selection:', err);
    });
    
    // Redirect to the selected service
    window.open(deliveryUrls[service], '_blank');
    
    // Keep the modal open to allow selection of another service if needed
  };
  
  // Reset modal state when closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStage('form');
      form.reset();
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stage === 'form' ? 'Order with Gorilla Smoke & Grill' : 'Select Delivery Service'}
          </DialogTitle>
        </DialogHeader>
        
        {stage === 'form' ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Your name" 
                {...form.register('name')} 
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Your email address" 
                {...form.register('email')} 
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input 
                id="phone" 
                placeholder="Your phone number" 
                {...form.register('phone')} 
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketingConsent" 
                {...form.register('marketingConsent')} 
              />
              <Label htmlFor="marketingConsent" className="text-sm">
                I agree to receive updates on special offers, events and promotions
              </Label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Your information will not be shared with third parties.
              You can unsubscribe from our emails at any time.
            </p>
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Continue to Order'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-center">
              Thank you! Select the service you'd like to use to place your order.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="flex flex-col items-center h-auto py-4 space-y-2"
                onClick={() => handleDeliveryServiceClick('ubereats')}
              >
                <SiUbereats className="h-8 w-8 text-black" />
                <span className="text-xs">UberEats</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center h-auto py-4 space-y-2"
                onClick={() => handleDeliveryServiceClick('doordash')}
              >
                <SiDoordash className="h-8 w-8 text-red-600" />
                <span className="text-xs">DoorDash</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center h-auto py-4 space-y-2"
                onClick={() => handleDeliveryServiceClick('grubhub')}
              >
                <SiGrubhub className="h-8 w-8 text-orange-500" />
                <span className="text-xs">Grubhub</span>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to our partner's website to complete your order.
            </p>
            
            <DialogFooter>
              <Button 
                variant="secondary" 
                onClick={() => setStage('form')}
              >
                Back
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}