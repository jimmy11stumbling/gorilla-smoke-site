import { useState, useEffect } from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bell, BellOff, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Order update message type
interface OrderUpdate extends WebSocketMessage {
  type: 'order_update';
  orderId: number;
  status: string;
  timestamp: number;
  details?: {
    customerName?: string;
    items?: Array<{
      name: string;
      quantity: number;
    }>;
    estimatedReadyTime?: string;
  };
}

// Enhanced order notification component with improved animation and feedback
export default function OrderNotifications() {
  const { toast } = useToast();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<OrderUpdate | null>(null);
  const [notifications, setNotifications] = useState<OrderUpdate[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Handler for order updates received via WebSocket
  const handleOrderUpdate = (data: OrderUpdate) => {
    if (!notificationsEnabled) return;
    
    // Format the status for display
    const statusDisplay = data.status.charAt(0).toUpperCase() + data.status.slice(1);
    
    // Add to notifications list
    setNotifications(prev => [data, ...prev].slice(0, 10)); // Keep last 10 notifications
    
    // Show a toast notification for all updates
    toast({
      title: `Order #${data.orderId} Update`,
      description: `Status: ${statusDisplay}`,
      duration: 5000,
    });
    
    // For "ready" or "confirmed" status, also show a more prominent dialog
    if (data.status === 'ready') {
      setCurrentNotification(data);
      setOrderDialogOpen(true);
      // Play a sound notification
      playNotificationSound();
    } else if (data.status === 'confirmed') {
      // Just increment counter but don't show dialog for confirmations
      setNotificationCount(prev => prev + 1);
    } else {
      // For other statuses, just increment counter
      setNotificationCount(prev => prev + 1);
    }
  };
  
  // Play a notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/audio/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.warn('Could not play notification sound:', err);
      });
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  };
  
  // Connect to WebSocket for real-time order updates with customer role
  const { isConnected, clientRole } = useWebSocket({
    // Register handlers for different message types
    'order_update': (data: WebSocketMessage) => {
      // Cast the message to our OrderUpdate type since we know the structure
      handleOrderUpdate(data as OrderUpdate);
    },
    'connection': (data) => {
      console.log('WebSocket connected:', data.message);
    },
    'error': (data) => {
      console.error('WebSocket error:', data.message);
      toast({
        title: 'Connection Error',
        description: 'Lost connection to notification service',
        variant: 'destructive',
      });
    }
  }, {
    // Set customer role to receive appropriate notifications
    role: 'customer',
    debug: false,
    reconnectAttempts: 5
  });
  
  // Clear notification count when dialog is opened
  useEffect(() => {
    if (orderDialogOpen) {
      setNotificationCount(0);
    }
  }, [orderDialogOpen]);
  
  // Toggle notifications on/off
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    if (!notificationsEnabled) {
      // Clear counts when re-enabling
      setNotificationCount(0);
    }
    
    toast({
      title: notificationsEnabled ? 'Notifications Disabled' : 'Notifications Enabled',
      description: notificationsEnabled 
        ? 'You will no longer receive order updates' 
        : 'You will now receive order updates',
      duration: 3000,
    });
  };
  
  // Get animation class for bell icon
  const getAnimationClass = () => {
    if (!isConnected || !notificationsEnabled) return '';
    return notificationCount > 0 ? 'animate-bounce' : '';
  };
  
  // Render a notification bell with a badge for unread notifications
  return (
    <>
      <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-12 w-12 relative bg-card/80 backdrop-blur-sm border-primary/20 
                  hover:bg-card transition-all duration-300 ${notificationCount > 0 ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  // If there are notifications to show, open the dialog
                  if (notificationCount > 0 && currentNotification) {
                    setOrderDialogOpen(true);
                  } else {
                    // Otherwise toggle notifications on/off
                    toggleNotifications();
                  }
                }}
                aria-label={notificationsEnabled ? 'Order notifications' : 'Notifications disabled'}
              >
                {!isConnected ? (
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                ) : notificationsEnabled ? (
                  <Bell className={`h-5 w-5 ${getAnimationClass()}`} />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                
                {notificationCount > 0 && notificationsEnabled && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {!isConnected 
                ? 'Notification service offline' 
                : notificationsEnabled 
                  ? `Order notifications: ${notificationCount > 0 ? notificationCount : 'None'}` 
                  : 'Notifications disabled'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Status indicator */}
        {isConnected ? (
          <Badge 
            variant={notificationsEnabled ? 'default' : 'outline'} 
            className="text-xs bg-background/80 backdrop-blur-sm"
          >
            {clientRole}
          </Badge>
        ) : (
          <Badge 
            variant="outline" 
            className="text-xs text-destructive bg-background/80 backdrop-blur-sm"
          >
            Offline
          </Badge>
        )}
      </div>
      
      {/* Order ready notification dialog */}
      <AlertDialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-5 w-5 text-primary" />
              Your Order is Ready!
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentNotification && (
                <div className="py-2 space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold text-lg mb-1">Order #{currentNotification.orderId}</p>
                    <p className="text-sm text-foreground">
                      Status: <span className="font-medium text-primary">Ready for pickup</span>
                    </p>
                    {currentNotification.details?.customerName && (
                      <p className="text-sm text-foreground">
                        Name: <span className="font-medium">{currentNotification.details.customerName}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Please proceed to the counter with your order number.</p>
                    <p className="text-muted-foreground">Your order will be held for up to 30 minutes.</p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <Button
              variant="ghost"
              onClick={toggleNotifications}
              className="hidden sm:flex"
            >
              {notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            </Button>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}