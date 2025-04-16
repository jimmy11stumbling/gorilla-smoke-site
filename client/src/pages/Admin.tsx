import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  UtensilsCrossed, 
  Phone, 
  User, 
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import Admin Components
import AdminUsers from '@/components/admin/AdminUsers';
import AdminMenu from '@/components/admin/AdminMenu';
import AdminLeads from '@/components/admin/AdminLeads';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // If auth request completes and is successful, set authentication state
    if (!isLoading) {
      if (authData?.success) {
        setIsAuthenticated(true);
        setUser(authData.user);
      }
    }
  }, [authData, isLoading]);

  // Handle login success
  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Logged out',
          description: 'You have been logged out successfully',
          variant: 'default',
        });
        
        // Reset authentication state
        setIsAuthenticated(false);
        setUser(null);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to logout',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Return to website
  const handleReturnToWebsite = () => {
    setLocation('/');
  };

  // Check if user has required permission for a tab
  const hasPermission = (tab: string): boolean => {
    if (!user) return false;
    
    // These tabs require admin or manager role
    if (tab === 'users') {
      return user.role === 'admin';
    }
    
    // These tabs require admin or manager role
    if (tab === 'menu' || tab === 'leads' || tab === 'contacts') {
      return ['admin', 'manager'].includes(user.role);
    }
    
    // Dashboard accessible to all authenticated users
    return true;
  };

  // Check if user is authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0" />
            <div>
              <p className="font-bold">Admin Login Information</p>
              <p className="text-sm mt-1">You can log in with:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                <li>Username: <strong>admin</strong></li>
                <li>Password: <strong>password</strong></li>
              </ul>
              <p className="text-sm mt-2">
                This login will give you full admin access to the restaurant management system.
              </p>
            </div>
          </div>
        </div>
        
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

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
                  onClick={handleReturnToWebsite}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Website
                </Button>
              </div>
              
              <div className="space-y-1">
                <TabsList className="flex flex-col h-auto w-full bg-transparent">
                  <TabsTrigger
                    value="dashboard"
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full justify-start`}
                    disabled={!hasPermission('dashboard')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="users"
                    onClick={() => setActiveTab('users')}
                    className={`w-full justify-start`}
                    disabled={!hasPermission('users')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Users
                    {!hasPermission('users') && (
                      <AlertTriangle className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="menu"
                    onClick={() => setActiveTab('menu')}
                    className={`w-full justify-start`}
                    disabled={!hasPermission('menu')}
                  >
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    Menu
                    {!hasPermission('menu') && (
                      <AlertTriangle className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="leads"
                    onClick={() => setActiveTab('leads')}
                    className={`w-full justify-start`}
                    disabled={!hasPermission('leads')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Leads
                    {!hasPermission('leads') && (
                      <AlertTriangle className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="contacts"
                    onClick={() => setActiveTab('contacts')}
                    className={`w-full justify-start`}
                    disabled={!hasPermission('contacts')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contacts
                    {!hasPermission('contacts') && (
                      <AlertTriangle className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TabsTrigger>
                </TabsList>
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
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
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
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="dashboard" className="mt-0">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              {user && <AdminUsers currentUser={user} />}
            </TabsContent>
            
            <TabsContent value="menu" className="mt-0">
              <AdminMenu />
            </TabsContent>
            
            <TabsContent value="leads" className="mt-0">
              <AdminLeads />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <AdminContacts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}