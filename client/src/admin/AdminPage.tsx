import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  const { data: authData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Auth query error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    // If auth request completes, update authentication state
    if (!isLoading) {
      if (authData?.success && authData?.user) {
        setIsAuthenticated(true);
        setUser(authData.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, [authData, isLoading]);

  // Handle login success
  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    refetch(); // Refresh auth data
    toast({
      title: "Login successful",
      description: `Welcome back, ${userData.username}`,
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(false);
        setUser(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle returning to website
  const handleReturnToWebsite = () => {
    setLocation('/');
  };

  // Check if user has permission for a section
  const hasPermission = (section: string): boolean => {
    // Admin has access to everything
    if (user?.role === 'admin') return true;
    
    // Manager has access to most things except user management
    if (user?.role === 'manager') {
      return section !== 'users';
    }
    
    // Staff has limited access
    if (user?.role === 'staff') {
      return ['dashboard', 'menu'].includes(section);
    }
    
    // Default: no permissions if role is unknown
    return false;
  };

  // Add debug logging
  console.log('Auth state:', { isLoading, isAuthenticated, authData });

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-medium">Loading admin panel...</h2>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated || !authData?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
            </div>
            
            <Button
              className="w-full"
              onClick={() => handleLoginSuccess({username: 'admin', role: 'admin'})}
            >
              Sign In
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Return to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render admin panel with directly defined components
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold cursor-pointer">
                  Gorilla Grill <span className="text-primary">Admin</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button
                variant="outline"
                className="mr-4"
                onClick={handleReturnToWebsite}
              >
                Return to Website
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h2>
          
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <p>Welcome to the Gorilla Grill Admin Panel. This is a simplified version for demonstration purposes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Menu Management</h3>
                <p className="text-sm text-gray-600 mb-4">Add, edit, and manage menu items.</p>
                <Button size="sm" onClick={() => setActiveSection('menu')}>Manage Menu</Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Lead Tracking</h3>
                <p className="text-sm text-gray-600 mb-4">View and analyze customer leads data.</p>
                <Button size="sm" onClick={() => setActiveSection('leads')}>Track Leads</Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">User Administration</h3>
                <p className="text-sm text-gray-600 mb-4">Manage staff accounts and permissions.</p>
                <Button size="sm" onClick={() => setActiveSection('users')}>Manage Users</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}