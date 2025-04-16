import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-medium">Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <Button
            className="w-full"
            onClick={() => {
              setIsAuthenticated(true);
              setUser({username: 'admin', role: 'admin'});
            }}
          >
            Sign In
          </Button>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Return to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to the simplified admin panel.</p>
          <p className="mt-2">Logged in as: {user?.username}</p>
        </div>
      </div>
    </div>
  );
}