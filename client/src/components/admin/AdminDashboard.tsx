import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  Users, 
  Mail, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

// Demo data for charts
const getLeadsData = () => [
  { month: 'Jan', count: 55 },
  { month: 'Feb', count: 40 },
  { month: 'Mar', count: 65 },
  { month: 'Apr', count: 80 },
  { month: 'May', count: 65 },
  { month: 'Jun', count: 85 },
];

const getContactsData = () => [
  { month: 'Jan', count: 25 },
  { month: 'Feb', count: 30 },
  { month: 'Mar', count: 35 },
  { month: 'Apr', count: 40 },
  { month: 'May', count: 35 },
  { month: 'Jun', count: 45 },
];

const getMenuData = () => [
  { category: 'BBQ Ribs', count: 12 },
  { category: 'Grilled Chicken', count: 10 },
  { category: 'Smoked Brisket', count: 8 },
  { category: 'Pulled Pork', count: 6 },
  { category: 'Sides', count: 15 },
];

const getServiceData = () => [
  { service: 'UberEats', count: 45 },
  { service: 'DoorDash', count: 35 },
  { service: 'GrubHub', count: 20 },
];

export default function AdminDashboard() {
  const [activeChart, setActiveChart] = useState<string>('overview');
  
  // Recent leads data
  const recentLeads = [
    { id: 1, name: 'John Smith', email: 'john@example.com', location: 'Del Mar', date: '2025-04-15' },
    { id: 2, name: 'Emily Johnson', email: 'emily@example.com', location: 'Zapata', date: '2025-04-14' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', location: 'San Bernardo', date: '2025-04-13' },
  ];
  
  // Recent contacts data
  const recentContacts = [
    { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', subject: 'Catering Inquiry', date: '2025-04-15' },
    { id: 2, name: 'Robert Davis', email: 'robert@example.com', subject: 'Reservation Question', date: '2025-04-14' },
    { id: 3, name: 'Jennifer Garcia', email: 'jennifer@example.com', subject: 'Feedback', date: '2025-04-13' },
  ];

  // Calculate summary metrics
  const totalLeads = 285;
  const totalContacts = 178;
  const totalMenuItems = 45;
  const popularService = 'UberEats';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Restaurant performance overview and metrics
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from previous month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5% from previous month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMenuItems}</div>
            <p className="text-xs text-muted-foreground">
              Across 5 categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Delivery Service</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularService}</div>
            <p className="text-xs text-muted-foreground">
              45% of all delivery orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4" value={activeChart} onValueChange={setActiveChart}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads">
              <LineChart className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="services">
              <PieChart className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>
                Lead and contact form submissions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center p-8 border border-dashed rounded-lg w-full max-w-md">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chart Placeholder</h3>
                <p className="text-sm text-muted-foreground">
                  This would display a bar chart showing lead and contact submissions over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Acquisition</CardTitle>
              <CardDescription>
                New leads over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center p-8 border border-dashed rounded-lg w-full max-w-md">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chart Placeholder</h3>
                <p className="text-sm text-muted-foreground">
                  This would display a line chart showing lead acquisition trends.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Service Distribution</CardTitle>
              <CardDescription>
                Lead distribution across delivery services
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center p-8 border border-dashed rounded-lg w-full max-w-md">
                <PieChart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chart Placeholder</h3>
                <p className="text-sm text-muted-foreground">
                  This would display a pie chart showing the distribution of delivery services.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              The latest customer leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">{lead.location}</Badge>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                View All Leads
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.subject}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                View All Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}