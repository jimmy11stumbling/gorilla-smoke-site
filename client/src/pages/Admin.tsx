import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Authentication status
  const { data: authData, isLoading: isAuthLoading, isError: isAuthError } = useQuery<{
    success: boolean;
    user?: {
      id: number;
      username: string;
      name: string;
      email: string;
      role: string;
    };
  }>({
    queryKey: ['/api/auth/user'],
    retry: false
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Refetch auth status after successful login
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLoginError('');
    },
    onError: (error: Error) => {
      setLoginError(error.message);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Clear auth data from cache
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    }
  });

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Check if user is authenticated
  const isAuthenticated = authData?.success && authData?.user;

  // Demo data
  const stats = {
    leads: 285,
    contacts: 178,
    menuItems: 45,
    popularService: 'UberEats'
  };

  // Return to website
  const handleReturnToWebsite = () => {
    window.location.href = '/';
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white py-4 px-6">
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          </div>
          
          <div className="p-6">
            {isAuthLoading ? (
              <div className="text-center py-4">Loading authentication status...</div>
            ) : (
              <form onSubmit={handleLogin}>
                {loginError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                    <p className="font-bold">Login Failed</p>
                    <p className="text-sm">{loginError}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="username" 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                  </button>
                  
                  <button 
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    onClick={handleReturnToWebsite}
                  >
                    Return to Website
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content (when authenticated)
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Panel</h2>
              
              <button
                onClick={handleReturnToWebsite}
                className="w-full text-left mb-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Website
              </button>
              
              <nav className="mt-4">
                <button
                  className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </button>
                
                <button 
                  className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'menu' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                  onClick={() => setActiveTab('menu')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Menu
                </button>
                
                <button
                  className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'leads' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                  onClick={() => setActiveTab('leads')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Leads
                </button>
                
                <button
                  className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                  onClick={() => setActiveTab('contacts')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contacts
                </button>
                
                <button
                  className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                  onClick={() => setActiveTab('users')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Users
                </button>
              </nav>
            </div>
            
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{authData?.user?.name || 'Administrator'}</p>
                    <p className="text-xs text-gray-500">{authData?.user?.username || 'admin'}</p>
                  </div>
                </div>
                <button 
                  className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                  onClick={handleLogout}
                  title="Logout"
                  disabled={logoutMutation.isPending}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 md:ml-6">
            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mb-6">Restaurant performance overview and metrics</p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.leads}</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +12% from previous month
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Contact Messages</h3>
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.contacts}</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +5% from previous month
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Menu Items</h3>
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.menuItems}</p>
                    <p className="text-xs text-gray-500">Across 5 categories</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Top Delivery Service</h3>
                      <div className="bg-red-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.popularService}</p>
                    <p className="text-xs text-gray-500">Based on user selections</p>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
                  
                  <div className="border border-gray-200 rounded-md">
                    <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">New lead from Del Mar location</p>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                    
                    <div className="py-2 px-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">Menu item updated: Gorilla Signature Burger</p>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                    </div>
                    
                    <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">New contact form submission</p>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                    </div>
                    
                    <div className="py-2 px-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">Staff account created: Maria Rodriguez</p>
                        <span className="text-xs text-gray-500">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Menu Content (placeholder) */}
            {activeTab === 'menu' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu Management</h2>
                <p className="text-gray-600 mb-6">Add, edit, and remove menu items</p>
                
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Menu management functionality would be implemented here.</p>
                  <p className="text-gray-500 text-sm mt-2">This would include a list of current menu items, item editor, category management, etc.</p>
                </div>
              </div>
            )}
            
            {/* Leads Content (placeholder) */}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Lead Tracking</h2>
                <p className="text-gray-600 mb-6">Monitor customer leads and service selections</p>
                
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Lead management functionality would be implemented here.</p>
                  <p className="text-gray-500 text-sm mt-2">This would include a lead list, filtering options, export capabilities, etc.</p>
                </div>
              </div>
            )}
            
            {/* Contacts Content (placeholder) */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Messages</h2>
                <p className="text-gray-600 mb-6">View and respond to customer inquiries</p>
                
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Contact management functionality would be implemented here.</p>
                  <p className="text-gray-500 text-sm mt-2">This would include message viewing, reply options, filtering, etc.</p>
                </div>
              </div>
            )}
            
            {/* Users Content (placeholder) */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
                <p className="text-gray-600 mb-6">Manage staff access and permissions</p>
                
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">User management functionality would be implemented here.</p>
                  <p className="text-gray-500 text-sm mt-2">This would include user creation, role assignment, access control, etc.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}