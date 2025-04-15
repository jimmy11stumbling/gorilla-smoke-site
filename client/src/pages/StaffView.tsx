import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { WebSocketMonitor } from '@/components/admin/WebSocketMonitor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, Timer, Clock, CheckCircle2, XCircle, Settings } from 'lucide-react';

// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: number;
  notes: string;
  menuItem: MenuItem;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

// Staff view component
export default function StaffView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/staff/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      const data = await response.json();
      return data.success ? data.data : [];
    },
  });

  // Mutation to update order status
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff/orders'] });
      toast({
        title: 'Order Updated',
        description: 'The order status has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update order status.',
        variant: 'destructive',
      });
    },
  });

  // WebSocket connection for real-time updates
  const { isConnected } = useWebSocket({
    'order_update': (data) => {
      // When an order is updated via WebSocket, invalidate the orders query
      queryClient.invalidateQueries({ queryKey: ['/api/staff/orders'] });
      
      // Show a toast notification
      toast({
        title: 'Order Updated',
        description: `Order #${data.orderId} status changed to ${data.status}`,
      });
    },
  });

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order: Order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Render order status badge with appropriate color
  const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case 'pending':
        variant = 'outline';
        break;
      case 'confirmed':
        variant = 'secondary';
        break;
      case 'preparing':
        variant = 'default';
        break;
      case 'ready':
        variant = 'default';
        break;
      case 'delivered':
        variant = 'outline';
        break;
      case 'cancelled':
        variant = 'destructive';
        break;
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Get status icon
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <ClipboardList className="h-4 w-4" />;
      case 'preparing':
        return <Timer className="h-4 w-4" />;
      case 'ready':
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
    }
  };

  // Main staff interface tabs: orders, system, settings
  const [mainView, setMainView] = useState<'orders' | 'system'>('orders');

  return (
    <div className="container mx-auto py-8">
      <SEO title="Staff View - Order Management" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Management</h1>
          <p className="text-muted-foreground">Order and system management dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={mainView === 'orders' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMainView('orders')}
              className="rounded-none"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Orders
            </Button>
            <Button 
              variant={mainView === 'system' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMainView('system')}
              className="rounded-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </div>
      </div>
      
      {mainView === 'orders' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-xl font-medium">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? 'There are no orders in the system yet.' 
                    : `There are no orders with '${activeTab}' status.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order: Order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Order #{order.id}
                          </CardTitle>
                          <CardDescription>
                            {new Date(order.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Customer</h4>
                          <p className="text-sm">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Total</h4>
                          <p className="text-lg font-semibold">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        
                        {order.notes && (
                          <div>
                            <h4 className="font-medium">Notes</h4>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <Separator />
                    
                    <CardFooter className="flex justify-between pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </div>
                      
                      <Select
                        value={order.status}
                        onValueChange={(value) => {
                          // Only update if the status is different
                          if (value !== order.status) {
                            updateOrderMutation.mutate({
                              id: order.id,
                              status: value
                            });
                          }
                        }}
                        disabled={updateOrderMutation.isPending}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6">
            <WebSocketMonitor />
          </div>
        </div>
      )}
    </div>
  );
}