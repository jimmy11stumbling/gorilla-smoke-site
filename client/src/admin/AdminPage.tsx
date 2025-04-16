import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import AdminMenu from './components/AdminMenu';
import AdminLeads from './components/AdminLeads';
import AdminContacts from './components/AdminContacts';
import AdminUsers from './components/AdminUsers';
import AdminSettings from './components/AdminSettings';
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
    
    // Default: development mode grants all permissions for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment;
  };

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-medium">Loading admin panel...</h2>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // If authenticated, render admin panel
  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      onReturnToWebsite={handleReturnToWebsite}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      hasPermission={hasPermission}
    >
      {activeSection === 'dashboard' && <AdminDashboard />}
      {activeSection === 'menu' && <AdminMenu />}
      {activeSection === 'leads' && hasPermission('leads') && <AdminLeads />}
      {activeSection === 'contacts' && hasPermission('contacts') && <AdminContacts />}
      {activeSection === 'users' && hasPermission('users') && <AdminUsers />}
      {activeSection === 'settings' && hasPermission('settings') && <AdminSettings />}
      
      {/* Error message if user doesn't have permission */}
      {((activeSection === 'leads' && !hasPermission('leads')) ||
        (activeSection === 'contacts' && !hasPermission('contacts')) ||
        (activeSection === 'users' && !hasPermission('users')) ||
        (activeSection === 'settings' && !hasPermission('settings'))) && (
        <div className="rounded-md bg-yellow-50 p-6 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You don't have permission to access this section.</p>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={() => setActiveSection('dashboard')}
                  variant="outline"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}