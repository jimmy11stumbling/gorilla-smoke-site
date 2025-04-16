import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart, BarChartHorizontal, PieChart } from '@/components/ui/chart';
import { 
  Loader2, 
  RefreshCw,
  ArrowUpRight,
  Users,
  Mail,
  Menu as MenuIcon,
  Activity,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  // Fetch metrics data
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/admin/leads'],
    refetchOnWindowFocus: false,
  });

  // Fetch contact form submissions
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    refetchOnWindowFocus: false,
  });

  // Fetch service statistics 
  const { data: serviceStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/leads/stats/services'],
    refetchOnWindowFocus: false,
  });

  // Fetch menu items
  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['/api/menu'],
    refetchOnWindowFocus: false,
  });

  // Prepare chart data
  const [leadsByDateData, setLeadsByDateData] = useState<any>(null);
  const [contactsByDateData, setContactsByDateData] = useState<any>(null);
  const [serviceDistributionData, setServiceDistributionData] = useState<any>(null);
  const [menuCategoryData, setMenuCategoryData] = useState<any>(null);

  // Manually refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/leads/stats/services'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/menu'] })
      ]);
      
      toast({
        title: "Data refreshed",
        description: "Dashboard metrics have been updated with the latest data"
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing the dashboard data",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Process leads data for charts
  useEffect(() => {
    if (leadsData?.success && leadsData?.data?.length > 0) {
      const leads = leadsData.data;
      const today = new Date();
      
      let daysToLookBack = 7;
      if (chartPeriod === 'month') daysToLookBack = 30;
      if (chartPeriod === 'quarter') daysToLookBack = 90;
      
      // Create date labels from oldest to newest
      const dateLabels = Array.from({ length: daysToLookBack }, (_, i) => {
        return format(subDays(today, daysToLookBack - 1 - i), 'MMM d');
      });
      
      // Count leads per day
      const leadCountsByDate = Array(daysToLookBack).fill(0);
      
      leads.forEach((lead: any) => {
        const leadDate = new Date(lead.createdAt);
        const diffTime = Math.abs(today.getTime() - leadDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= daysToLookBack) {
          const index = daysToLookBack - diffDays;
          leadCountsByDate[index]++;
        }
      });
      
      // Prepare chart data
      setLeadsByDateData({
        labels: dateLabels,
        datasets: [
          {
            label: 'New Leads',
            data: leadCountsByDate,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            fill: true,
          }
        ]
      });
    } else {
      setLeadsByDateData(null);
    }
  }, [leadsData, chartPeriod]);

  // Process contacts data for charts
  useEffect(() => {
    if (contactsData?.success && contactsData?.data?.length > 0) {
      const contacts = contactsData.data;
      const today = new Date();
      
      let daysToLookBack = 7;
      if (chartPeriod === 'month') daysToLookBack = 30;
      if (chartPeriod === 'quarter') daysToLookBack = 90;
      
      // Create date labels from oldest to newest
      const dateLabels = Array.from({ length: daysToLookBack }, (_, i) => {
        return format(subDays(today, daysToLookBack - 1 - i), 'MMM d');
      });
      
      // Count contacts per day
      const contactCountsByDate = Array(daysToLookBack).fill(0);
      
      contacts.forEach((contact: any) => {
        const contactDate = new Date(contact.createdAt);
        const diffTime = Math.abs(today.getTime() - contactDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= daysToLookBack) {
          const index = daysToLookBack - diffDays;
          contactCountsByDate[index]++;
        }
      });
      
      // Prepare chart data
      setContactsByDateData({
        labels: dateLabels,
        datasets: [
          {
            label: 'Contact Submissions',
            data: contactCountsByDate,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            fill: true,
          }
        ]
      });
    } else {
      setContactsByDateData(null);
    }
  }, [contactsData, chartPeriod]);

  // Process service stats for charts
  useEffect(() => {
    if (serviceStats?.success && serviceStats?.data?.length > 0) {
      const services = serviceStats.data;
      
      // Use real service names
      const chartColors = [
        'rgba(239, 68, 68, 0.8)',   // red
        'rgba(16, 185, 129, 0.8)',  // green
        'rgba(59, 130, 246, 0.8)',  // blue
      ];

      // Prepare chart data
      setServiceDistributionData({
        labels: services.map((item: any) => item.service),
        datasets: [
          {
            data: services.map((item: any) => item.count),
            backgroundColor: chartColors.slice(0, services.length),
            borderColor: chartColors.slice(0, services.length),
            borderWidth: 1,
          }
        ]
      });
    } else {
      setServiceDistributionData(null);
    }
  }, [serviceStats]);

  // Process menu items by category
  useEffect(() => {
    if (menuData?.success && menuData?.data?.length > 0) {
      const items = menuData.data;
      
      // Count items per category
      const categoryMap = new Map();
      
      items.forEach((item: any) => {
        if (categoryMap.has(item.category)) {
          categoryMap.set(item.category, categoryMap.get(item.category) + 1);
        } else {
          categoryMap.set(item.category, 1);
        }
      });
      
      // Sort categories by count (descending)
      const sortedCategories = [...categoryMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => ({ category, count }));
      
      // Define chart colors
      const chartColors = [
        'rgba(99, 102, 241, 0.8)',   // indigo
        'rgba(16, 185, 129, 0.8)',   // green
        'rgba(245, 158, 11, 0.8)',   // amber
        'rgba(239, 68, 68, 0.8)',    // red
        'rgba(14, 165, 233, 0.8)',   // sky
        'rgba(168, 85, 247, 0.8)',   // purple
      ];
      
      // Prepare chart data
      setMenuCategoryData({
        labels: sortedCategories.map(item => item.category),
        datasets: [
          {
            data: sortedCategories.map(item => item.count),
            backgroundColor: chartColors.slice(0, sortedCategories.length),
            borderColor: chartColors.slice(0, sortedCategories.length).map(color => color.replace('0.8', '1')),
            borderWidth: 1,
          }
        ]
      });
    } else {
      setMenuCategoryData(null);
    }
  }, [menuData]);

  // Calculate summary metrics
  const getTotalNewLeads = (): number => {
    if (!leadsData?.success || !leadsData?.data) return 0;
    
    const today = new Date();
    let count = 0;
    
    leadsData.data.forEach((lead: any) => {
      const leadDate = new Date(lead.createdAt);
      const diffTime = Math.abs(today.getTime() - leadDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        count++;
      }
    });
    
    return count;
  };
  
  const getTotalContacts = (): number => {
    if (!contactsData?.success || !contactsData?.data) return 0;
    
    const today = new Date();
    let count = 0;
    
    contactsData.data.forEach((contact: any) => {
      const contactDate = new Date(contact.createdAt);
      const diffTime = Math.abs(today.getTime() - contactDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        count++;
      }
    });
    
    return count;
  };
  
  const getMenuItemCount = (): number => {
    if (!menuData?.success || !menuData?.data) return 0;
    return menuData.data.length;
  };
  
  const getPopularDeliveryService = (): { name: string, count: number } => {
    if (!serviceStats?.success || !serviceStats?.data || serviceStats.data.length === 0) {
      return { name: 'N/A', count: 0 };
    }
    
    const topService = serviceStats.data.reduce((prev: any, current: any) => {
      return (prev.count > current.count) ? prev : current;
    });
    
    return { name: topService.service, count: topService.count };
  };

  // Get recent leads for the table
  const getRecentLeads = () => {
    if (!leadsData?.success || !leadsData?.data) return [];
    
    return leadsData.data
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  // Get recent contacts for the table
  const getRecentContacts = () => {
    if (!contactsData?.success || !contactsData?.data) return [];
    
    return contactsData.data
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  // Loading state
  if (leadsLoading || contactsLoading || statsLoading || menuLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Restaurant overview and performance metrics
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalNewLeads()}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Form</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalContacts()}</div>
            <p className="text-xs text-muted-foreground">
              New messages last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <MenuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMenuItemCount()}</div>
            <p className="text-xs text-muted-foreground">
              Total available items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Service</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPopularDeliveryService().name}</div>
            <p className="text-xs text-muted-foreground">
              {getPopularDeliveryService().count} leads this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="leads" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={chartPeriod === 'week' ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartPeriod('week')}
            >
              Week
            </Button>
            <Button 
              variant={chartPeriod === 'month' ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartPeriod('month')}
            >
              Month
            </Button>
            <Button 
              variant={chartPeriod === 'quarter' ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartPeriod('quarter')}
            >
              Quarter
            </Button>
          </div>
        </div>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Acquisition</CardTitle>
              <CardDescription>
                New leads over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {leadsByDateData ? (
                <LineChart data={leadsByDateData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No lead data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>
                New contact submissions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {contactsByDateData ? (
                <LineChart data={contactsByDateData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No contact data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Service Distribution</CardTitle>
              <CardDescription>
                Lead distribution across delivery services
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {serviceDistributionData ? (
                <PieChart data={serviceDistributionData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No service data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Category Breakdown</CardTitle>
              <CardDescription>
                Distribution of menu items by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {menuCategoryData ? (
                <BarChartHorizontal data={menuCategoryData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No menu category data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              The latest customer leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getRecentLeads().length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRecentLeads().map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">No recent leads</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => {}}>
              <span>View All Leads</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Contact Submissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getRecentContacts().length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRecentContacts().map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{format(new Date(contact.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">No recent messages</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => {}}>
              <span>View All Messages</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}