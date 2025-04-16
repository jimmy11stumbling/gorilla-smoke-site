import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  Users, 
  Mail, 
  ShoppingBag,
  ArrowUpRight,
  LockKeyhole,
  Home,
  User,
  LogOut
} from 'lucide-react';

export default function AdminBasic() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simple login form
  const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, we would validate credentials
      setIsAuthenticated(true);
    };
    
    // For demo purposes
    const handleDemoLogin = () => {
      setIsAuthenticated(true);
    };
    
    return (
      <div className="container mx-auto py-6">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded">
          <div className="flex items-start">
            <div>
              <p className="font-bold">Admin Login Information</p>
              <p className="text-sm mt-1">Click "Demo Login" to access the admin dashboard</p>
              <p className="text-sm mt-2">
                This will give you full admin access to the restaurant management system.
              </p>
            </div>
          </div>
        </div>
        
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LockKeyhole className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </form>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
            >
              Demo Login (Admin)
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground mt-3 text-center">
              <Link href="/" className="text-primary hover:underline">
                Return to website
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Dashboard component with metrics
  const Dashboard = () => {
    // Recent leads data for dashboard
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

    const [activeChart, setActiveChart] = useState('overview');
    
    // Summary metrics for dashboard
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
  };

  // Menu management placeholder
  const MenuManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
      <p>This section allows you to add, edit, and manage menu items.</p>
      <div className="mt-4 p-4 border border-dashed rounded-lg">
        <p className="text-center text-muted-foreground">Menu management features would be implemented here</p>
      </div>
    </div>
  );

  // Leads management placeholder
  const LeadsManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Leads Management</h2>
      <p>This section allows you to track and manage customer leads.</p>
      <div className="mt-4 p-4 border border-dashed rounded-lg">
        <p className="text-center text-muted-foreground">Lead management features would be implemented here</p>
      </div>
    </div>
  );

  // Contacts management placeholder
  const ContactsManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Contacts Management</h2>
      <p>This section allows you to manage contact form submissions.</p>
      <div className="mt-4 p-4 border border-dashed rounded-lg">
        <p className="text-center text-muted-foreground">Contact management features would be implemented here</p>
      </div>
    </div>
  );

  // Users management placeholder
  const UsersManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Users Management</h2>
      <p>This section allows you to manage staff accounts and access permissions.</p>
      <div className="mt-4 p-4 border border-dashed rounded-lg">
        <p className="text-center text-muted-foreground">User management features would be implemented here</p>
      </div>
    </div>
  );

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // If authenticated, show admin panel
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="space-y-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
              
              <div className="mb-4 space-y-1">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Website
                </Button>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
                
                <Button
                  variant={activeTab === 'menu' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('menu')}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Menu
                </Button>
                
                <Button
                  variant={activeTab === 'leads' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('leads')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Leads
                </Button>
                
                <Button
                  variant={activeTab === 'contacts' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('contacts')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contacts
                </Button>
              </div>
            </div>
            
            {/* User info and logout */}
            <div className="px-3 py-2">
              <div className="mt-auto pt-4 border-t">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Administrator</p>
                      <p className="text-xs text-muted-foreground capitalize">admin</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsAuthenticated(false)}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'leads' && <LeadsManagement />}
          {activeTab === 'contacts' && <ContactsManagement />}
          {activeTab === 'users' && <UsersManagement />}
        </div>
      </div>
    </div>
  );
}