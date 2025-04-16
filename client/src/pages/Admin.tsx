import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Users, Menu, FileText, BarChart2, LogOut } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminMenu from '@/components/admin/AdminMenu';
import AdminLeads from '@/components/admin/AdminLeads';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Query current user
  const { data: userData, error, isError, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // Check authentication status
    if (userData?.success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [userData]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Logged out successfully',
          description: 'You have been logged out of the admin dashboard.',
          variant: 'default',
        });
        
        // Refetch user data to update authentication state
        await refetch();
        
        // Reset to dashboard tab
        setActiveTab('dashboard');
      } else {
        toast({
          title: 'Logout failed',
          description: data.message || 'An error occurred during logout.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  };

  const handleLogin = async () => {
    // Refetch user data after login
    await refetch();
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // We could update the URL here if needed with setLocation
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle>Loading Admin Dashboard</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="container mx-auto p-0 min-h-screen flex">
      {/* Admin Sidebar */}
      <Sidebar className="w-64 border-r min-h-screen">
        <div className="px-3 py-4">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h2>
          <div className="px-4 my-2">
            <p className="text-sm text-muted-foreground">
              Welcome, {userData?.user?.name || 'Admin'}
            </p>
          </div>
          <Separator className="my-4" />
          <div className="space-y-1 py-2">
            <Button 
              variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => handleTabChange('dashboard')}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTabChange('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'menu' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTabChange('menu')}
            >
              <Menu className="mr-2 h-4 w-4" />
              Menu Items
            </Button>
            <Button 
              variant={activeTab === 'leads' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTabChange('leads')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Leads
            </Button>
            <Button 
              variant={activeTab === 'contacts' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTabChange('contacts')}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Contact Forms
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="space-y-1 py-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setLocation('/')}
            >
              Back to Website
            </Button>
          </div>
        </div>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'leads' && 'Lead Management'}
              {activeTab === 'contacts' && 'Contact Form Submissions'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'dashboard' && 'Key metrics and analytics for Gorilla Smoke & Grill'}
              {activeTab === 'users' && 'Add, edit, and manage admin users'}
              {activeTab === 'menu' && 'Manage your restaurant menu items'}
              {activeTab === 'leads' && 'View and analyze customer leads'}
              {activeTab === 'contacts' && 'Review contact form submissions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'dashboard' && <AdminDashboard user={userData?.user} />}
            {activeTab === 'users' && <AdminUsers currentUser={userData?.user} />}
            {activeTab === 'menu' && <AdminMenu />}
            {activeTab === 'leads' && <AdminLeads />}
            {activeTab === 'contacts' && <AdminContacts />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}