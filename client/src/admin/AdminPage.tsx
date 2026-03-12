import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminMenu from './components/AdminMenu';
import AdminLeads from './components/AdminLeads';
import AdminContacts from './components/AdminContacts';
import AdminUsers from './components/AdminUsers';
import AdminSettings from './components/AdminSettings';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (authData?.success && authData?.user) {
        setUser(authData.user);
      } else {
        setUser(null);
      }
    }
  }, [authData, isLoading]);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleReturnToWebsite = () => {
    navigate('/');
  };

  const hasPermission = (section: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'manager') {
      return ['dashboard', 'menu', 'leads', 'contacts', 'settings'].includes(section);
    }
    if (user.role === 'staff') {
      return ['dashboard'].includes(section);
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-medium">Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'menu':
        return hasPermission('menu') ? <AdminMenu /> : null;
      case 'leads':
        return hasPermission('leads') ? <AdminLeads /> : null;
      case 'contacts':
        return hasPermission('contacts') ? <AdminContacts /> : null;
      case 'users':
        return hasPermission('users') ? <AdminUsers /> : null;
      case 'settings':
        return hasPermission('settings') ? <AdminSettings /> : null;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      onReturnToWebsite={handleReturnToWebsite}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      hasPermission={hasPermission}
    >
      {renderSection()}
    </AdminLayout>
  );
}