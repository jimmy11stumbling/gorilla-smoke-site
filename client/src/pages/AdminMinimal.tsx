import React from 'react';

// Zero-hook implementation - pure class-based component with no React hooks
class AdminMinimal extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: false,
      activeTab: 'dashboard'
    };
    
    // Bind all methods
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }
  
  login() {
    this.setState({ isLoggedIn: true });
  }
  
  logout() {
    this.setState({ isLoggedIn: false });
  }
  
  switchTab(tab: string) {
    this.setState({ activeTab: tab });
  }
  
  render() {
    const { isLoggedIn, activeTab } = this.state as { isLoggedIn: boolean, activeTab: string };
    
    // Demo data
    const stats = {
      leads: 285,
      contacts: 178,
      menuItems: 45,
      popularService: 'UberEats'
    };
    
    // Login screen
    if (!isLoggedIn) {
      return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-primary text-white py-4 px-6">
              <h2 className="text-2xl font-bold text-center">Admin Login</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
                <p className="font-bold">Admin Login Information</p>
                <p className="text-sm">Click "Demo Login" to access the admin dashboard</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  id="username" 
                  type="text" 
                  placeholder="Username" 
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
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                  type="button"
                  onClick={this.login}
                >
                  Sign In
                </button>
                
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                  type="button"
                  onClick={this.login}
                >
                  Demo Login
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <a href="/" className="text-primary hover:underline text-sm">
                  Return to Website
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Dashboard content
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Panel</h2>
                
                <a
                  href="/"
                  className="w-full text-left mb-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return to Website
                </a>
                
                <nav className="mt-4">
                  <button
                    className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                    onClick={() => this.switchTab('dashboard')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </button>
                  
                  <button 
                    className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'menu' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                    onClick={() => this.switchTab('menu')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Menu
                  </button>
                  
                  <button
                    className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'leads' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                    onClick={() => this.switchTab('leads')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Leads
                  </button>
                  
                  <button
                    className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                    onClick={() => this.switchTab('contacts')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contacts
                  </button>
                  
                  <button
                    className={`w-full text-left mb-2 px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium flex items-center`}
                    onClick={() => this.switchTab('users')}
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
                      <p className="font-medium text-gray-800">Administrator</p>
                      <p className="text-xs text-gray-500">admin</p>
                    </div>
                  </div>
                  <button 
                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    onClick={this.logout}
                    title="Logout"
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.popularService}</p>
                      <p className="text-xs text-gray-500">45% of all delivery orders</p>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Monthly Performance</h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-800">Chart Placeholder</p>
                        <p className="text-sm text-gray-500 mt-1">This would display a chart showing lead and contact submissions over time</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">Recent Leads</h3>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">John Smith</p>
                            <p className="text-sm text-gray-500">john@example.com</p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mr-2">Del Mar</span>
                            <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Emily Johnson</p>
                            <p className="text-sm text-gray-500">emily@example.com</p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mr-2">Zapata</span>
                            <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Michael Brown</p>
                            <p className="text-sm text-gray-500">michael@example.com</p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mr-2">San Bernardo</span>
                            <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium">
                          View All Leads
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">Recent Messages</h3>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Sarah Wilson</p>
                            <p className="text-sm text-gray-500">Catering Inquiry</p>
                          </div>
                          <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Robert Davis</p>
                            <p className="text-sm text-gray-500">Reservation Question</p>
                          </div>
                          <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Jennifer Garcia</p>
                            <p className="text-sm text-gray-500">Feedback</p>
                          </div>
                          <button className="text-sm px-2 py-1 text-primary hover:text-primary-dark">View</button>
                        </div>
                        <button className="w-full py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium">
                          View All Messages
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Menu Content */}
              {activeTab === 'menu' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Menu Management</h2>
                  <p className="text-gray-600 mb-6">Add, edit and manage your restaurant menu items</p>
                  
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800">Menu Management</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">This section allows you to add, edit, and manage menu items for your restaurant.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Leads Content */}
              {activeTab === 'leads' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Leads Management</h2>
                  <p className="text-gray-600 mb-6">Track and manage customer leads and inquiries</p>
                  
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800">Leads Management</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">This section allows you to track and manage customer leads for your restaurant.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contacts Content */}
              {activeTab === 'contacts' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Contacts Management</h2>
                  <p className="text-gray-600 mb-6">Manage and respond to contact form submissions</p>
                  
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800">Contacts Management</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">This section allows you to manage contact form submissions for your restaurant.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Users Content */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Users Management</h2>
                  <p className="text-gray-600 mb-6">Manage admin users and access permissions</p>
                  
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800">Users Management</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">This section allows you to manage staff accounts and access permissions.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminMinimal;