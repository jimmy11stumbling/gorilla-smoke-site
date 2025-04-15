import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderUpdate {
  type: 'order_update';
  orderId: number;
  status: string;
  timestamp: number;
}

export default function OrderNotifications() {
  const { toast } = useToast();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<OrderUpdate | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Handler for order updates received via WebSocket
  const handleOrderUpdate = (data: OrderUpdate) => {
    // Format the status for display
    const statusDisplay = data.status.charAt(0).toUpperCase() + data.status.slice(1);
    
    // Show a toast notification for all updates
    toast({
      title: `Order #${data.orderId} Update`,
      description: `Status: ${statusDisplay}`,
      duration: 5000,
    });
    
    // For "ready" status, also show a more prominent dialog
    if (data.status === 'ready') {
      setCurrentNotification(data);
      setOrderDialogOpen(true);
    }
    
    // Increment notification counter
    setNotificationCount(prev => prev + 1);
  };
  
  // Connect to WebSocket for real-time order updates
  const { isConnected } = useWebSocket({
    // Register handlers for different message types
    'order_update': handleOrderUpdate,
    'connection': (data) => console.log('WebSocket connected:', data.message),
    'error': (data) => console.error('WebSocket error:', data.message),
    '*': (data) => console.log('Unhandled WebSocket message type:', data)
  });
  
  // Clear notification count when dialog is opened
  useEffect(() => {
    if (orderDialogOpen) {
      setNotificationCount(0);
    }
  }, [orderDialogOpen]);
  
  // Render a notification bell with a badge for unread notifications
  return (
    <>
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 relative bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-card"
          onClick={() => {
            if (currentNotification) {
              setOrderDialogOpen(true);
            }
          }}
          aria-label="Order notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
        {!isConnected && (
          <Badge variant="outline" className="mt-2 text-xs bg-muted/80 backdrop-blur-sm">
            Offline
          </Badge>
        )}
      </div>
      
      <AlertDialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Your Order is Ready!
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentNotification && (
                <div className="py-2">
                  <p className="mb-2">Order #{currentNotification.orderId} is ready for pickup!</p>
                  <p className="text-sm text-muted-foreground">
                    Please proceed to the counter with your order number.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}