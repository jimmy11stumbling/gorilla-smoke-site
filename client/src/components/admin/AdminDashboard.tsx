import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart, BarChartHorizontal, PieChart } from '@/components/ui/chart';
import { 
  Loader2, 
  Users, 
  UtensilsCrossed, 
  Phone, 
  DollarSign, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Fetch recent leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/admin/leads'],
    refetchOnWindowFocus: false,
  });

  // Fetch recent contact submissions
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    refetchOnWindowFocus: false,
  });

  // Fetch all menu items
  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['/api/menu'],
    refetchOnWindowFocus: false,
  });

  // Regenerate sitemap
  const handleRegenerateSitemap = async () => {
    setRefreshing(true);
    
    try {
      const response = await fetch('/api/admin/regenerate-sitemap', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Sitemap regenerated successfully',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to regenerate sitemap',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Process leads data for charts
  const getLeadsByDateData = () => {
    if (!leadsData?.data) return null;
    
    // Get last 7 days
    const dates = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Format date as MM/DD
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      dates.push(formattedDate);
      
      // Count leads for this date
      const count = leadsData.data.filter((lead: any) => {
        const leadDate = new Date(lead.createdAt);
        return (
          leadDate.getDate() === date.getDate() &&
          leadDate.getMonth() === date.getMonth() &&
          leadDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      counts.push(count);
    }
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'New Leads',
          data: counts,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  // Process contact data for charts
  const getContactsByDateData = () => {
    if (!contactsData?.data) return null;
    
    // Get last 7 days
    const dates = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Format date as MM/DD
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      dates.push(formattedDate);
      
      // Count contacts for this date
      const count = contactsData.data.filter((contact: any) => {
        const contactDate = new Date(contact.createdAt);
        return (
          contactDate.getDate() === date.getDate() &&
          contactDate.getMonth() === date.getMonth() &&
          contactDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      counts.push(count);
    }
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Contact Submissions',
          data: counts,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  };

  // Process menu data for charts
  const getMenuCategoryData = () => {
    if (!menuData?.data) return null;
    
    // Count items by category
    const categories = ['appetizers', 'mains', 'sides', 'desserts', 'drinks'];
    const counts = categories.map(category => {
      return menuData.data.filter((item: any) => item.category === category).length;
    });
    
    return {
      labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [
        {
          label: 'Menu Items by Category',
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const leadsByDateData = getLeadsByDateData();
  const contactsByDateData = getContactsByDateData();
  const menuCategoryData = getMenuCategoryData();

  // Loading state
  if (leadsLoading || contactsLoading || menuLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Overview of your restaurant's performance
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleRegenerateSitemap}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Regenerate Sitemap
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leadsData?.data ? leadsData.data.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {leadsData?.data && leadsData.data.length > 0 
                ? `+${getLeadsByDateData()?.datasets[0].data.reduce((a: number, b: number) => a + b, 0)} in the last 7 days` 
                : 'No new leads in the last 7 days'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contactsData?.data ? contactsData.data.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {contactsData?.data && contactsData.data.length > 0 
                ? `+${getContactsByDateData()?.datasets[0].data.reduce((a: number, b: number) => a + b, 0)} in the last 7 days` 
                : 'No new contacts in the last 7 days'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuData?.data ? menuData.data.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {menuData?.data && menuData.data.length > 0
                ? `${menuData.data.filter((item: any) => item.featured === 1).length} featured items`
                : 'No menu items available'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Acquisition</CardTitle>
              <CardDescription>
                New leads over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {leadsByDateData ? (
                <LineChart data={leadsByDateData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
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
                New contact submissions over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {contactsByDateData ? (
                <LineChart data={contactsByDateData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Categories</CardTitle>
              <CardDescription>
                Distribution of menu items by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {menuCategoryData ? (
                <BarChart data={menuCategoryData} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}