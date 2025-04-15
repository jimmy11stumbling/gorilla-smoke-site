import { useState, useEffect } from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClipboardCopy, Send, Database, WifiOff, Wifi } from 'lucide-react';

// Form schema for sending notifications
const notificationSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  targetRole: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  action: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

// WebSocket status interface
interface WebSocketStatus {
  clients: {
    total: number;
    customers: number;
    kitchen: number;
    admin: number;
    unknown: number;
  };
  server: {
    uptime: number;
    started: string;
    status: 'online' | 'offline' | 'degraded';
  };
}

// WebSocket admin monitor component
export function WebSocketMonitor() {
  const { toast } = useToast();
  const [status, setStatus] = useState<WebSocketStatus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Connection statistics
  const [connectionStats, setConnectionStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    errors: 0,
  });
  
  // Form for sending notifications
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: 'announcement',
      targetRole: 'all',
      title: '',
      message: '',
      action: '',
    },
  });

  // Connect to WebSocket as admin role
  const { 
    isConnected, 
    clientId, 
    clientRole,
    sendMessage,
    lastActivity 
  } = useWebSocket({
    // Status update handler
    'status_update': (data: WebSocketMessage) => {
      if ('clients' in data && 'server' in data) {
        setStatus(data as WebSocketStatus);
        setLastUpdate(new Date());
      }
    },
    // Handle general server messages
    'server_message': (data) => {
      if (data.message) {
        toast({
          title: data.title || 'Server Message',
          description: data.message,
          duration: 5000,
        });
      }
    },
    // Handle connection messages
    'connection': (data) => {
      setConnectionStats(prev => ({
        ...prev,
        messagesReceived: prev.messagesReceived + 1,
      }));
    },
    // Track errors
    'error': (data) => {
      setConnectionStats(prev => ({
        ...prev,
        errors: prev.errors + 1,
      }));
      
      toast({
        title: 'WebSocket Error',
        description: data.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    },
    // Catch-all handler for unhandled messages
    '*': (data) => {
      setConnectionStats(prev => ({
        ...prev,
        messagesReceived: prev.messagesReceived + 1,
      }));
    }
  }, {
    // Register as admin
    role: 'admin',
    debug: true,
    reconnectAttempts: 5,
  });

  // Request status updates when connected
  useEffect(() => {
    if (isConnected) {
      // Request initial status
      requestStatus();
      
      // Set up interval to request status updates
      const interval = setInterval(requestStatus, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Request WebSocket server status
  const requestStatus = () => {
    if (isConnected) {
      sendMessage({
        type: 'status_request',
        timestamp: Date.now(),
      });
    }
  };

  // Handle form submission to send notifications
  const onSubmit = (values: NotificationFormValues) => {
    if (!isConnected) {
      toast({
        title: 'Not Connected',
        description: 'Cannot send notification while offline',
        variant: 'destructive',
      });
      return;
    }
    
    const message = {
      type: 'broadcast',
      messageType: values.type,
      title: values.title,
      message: values.message,
      action: values.action || undefined,
      timestamp: Date.now(),
      sender: {
        id: clientId,
        role: clientRole,
      },
    };
    
    // Add target role if specified
    if (values.targetRole && values.targetRole !== 'all') {
      message['targetRole'] = values.targetRole;
    }
    
    // Send the notification
    const success = sendMessage(message);
    
    if (success) {
      setConnectionStats(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1,
      }));
      
      toast({
        title: 'Notification Sent',
        description: `"${values.title}" sent to ${values.targetRole || 'all users'}`,
      });
      
      // Reset form
      form.reset({
        type: 'announcement',
        targetRole: 'all',
        title: '',
        message: '',
        action: '',
      });
    } else {
      toast({
        title: 'Send Failed',
        description: 'Failed to send notification',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">WebSocket Monitor</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={requestStatus}
        >
          Refresh Status
        </Button>
      </div>
      
      {/* Connection Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>WebSocket server connection status</CardDescription>
            </div>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? (
                <div className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  <span>Disconnected</span>
                </div>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client ID:</span>
                <span className="font-mono">{clientId || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="outline">{clientRole}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Activity:</span>
                <span>{new Date(lastActivity).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages Sent:</span>
                <span>{connectionStats.messagesSent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages Received:</span>
                <span>{connectionStats.messagesReceived}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Errors:</span>
                <span className={connectionStats.errors > 0 ? 'text-destructive' : ''}>
                  {connectionStats.errors}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Server Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Server Status</CardTitle>
              <CardDescription>
                WebSocket server statistics and client count
              </CardDescription>
            </div>
            <Badge variant={status?.server.status === 'online' ? 'default' : 'destructive'}>
              {status?.server.status || 'Unknown'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Server Uptime:</span>
                  <span>{Math.floor(status.server.uptime / 60)} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Started At:</span>
                  <span>{status.server.started}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span>{lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Clients:</span>
                  <Badge variant="secondary">{status.clients.total}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">- Customers:</span>
                    <span>{status.clients.customers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">- Kitchen Staff:</span>
                    <span>{status.clients.kitchen}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">- Admins:</span>
                    <span>{status.clients.admin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">- Unregistered:</span>
                    <span>{status.clients.unknown}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {isConnected 
                ? 'Waiting for server status...' 
                : 'Not connected to server'}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Send Notification Card */}
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send real-time notifications to connected clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Type</FormLabel>
                      <Select 
                        disabled={!isConnected} 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="system">System Message</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <Select 
                        disabled={!isConnected} 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="customer">Customers Only</SelectItem>
                          <SelectItem value="kitchen">Kitchen Staff Only</SelectItem>
                          <SelectItem value="admin">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter notification title" 
                        {...field} 
                        disabled={!isConnected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter notification message" 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                        disabled={!isConnected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/action" 
                        {...field} 
                        disabled={!isConnected}
                      />
                    </FormControl>
                    <FormDescription>
                      Add an optional URL for users to click in the notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!isConnected || form.formState.isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}