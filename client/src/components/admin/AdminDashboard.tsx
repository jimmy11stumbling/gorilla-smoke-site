import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, BarChartHorizontal, LineChart, PieChart 
} from '@/components/ui/chart';
import { Loader2, UserCheck, Pizza, FileText, Mail, ShoppingCart } from 'lucide-react';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface AdminDashboardProps {
  user?: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  // Fetch service selection statistics for leads
  const { data: serviceStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/leads/stats/services'],
    refetchOnWindowFocus: false,
  });

  // Fetch recent leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/admin/leads'],
    queryFn: async () => {
      const response = await fetch('/api/admin/leads?limit=5');
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Fetch contact submissions
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    refetchOnWindowFocus: false,
  });

  // Format data for service selection chart
  const serviceChartData = serviceStats?.data
    ? {
        labels: serviceStats.data.map((item: any) => item.service),
        datasets: [
          {
            label: 'Service Selections',
            data: serviceStats.data.map((item: any) => item.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Mock data for example charts
  // Note: In a real app, this would come from API calls
  const mockLocationData = {
    labels: ['Del Mar', 'Zapata', 'San Bernardo'],
    datasets: [
      {
        label: 'Orders by Location',
        data: [65, 42, 55],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
    ],
  };

  const mockTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 15, 18, 14, 22, 34, 29],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (statsLoading || leadsLoading || contactsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Menu Items</CardTitle>
            <Pizza className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              3 new items added this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsData?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              From all locations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsData?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requiring response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Location</CardTitle>
            <CardDescription>
              Distribution of orders across restaurant locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={mockLocationData} className="h-80" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Service Selections</CardTitle>
            <CardDescription>
              Which delivery platforms customers prefer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {serviceChartData ? (
              <PieChart data={serviceChartData} className="h-80" />
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-muted-foreground text-center">No delivery service data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Based Analytics */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Order Activity</CardTitle>
            <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Order trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={mockTimeData} className="h-96" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            Latest customer leads from all locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leadsData?.data?.length > 0 ? (
            <div className="space-y-4">
              {leadsData.data.slice(0, 5).map((lead: any) => (
                <div key={lead.id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {lead.locationId}
                    </span>
                    {lead.marketingConsent && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                        Marketing Opt-in
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent leads found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}