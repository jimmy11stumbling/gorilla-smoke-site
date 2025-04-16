import React from 'react';

interface DashboardProps {
  onLogout: () => void;
  username: string;
}

export default function Dashboard({ onLogout, username }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {username}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-lg font-semibold mb-4">Restaurant Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium text-gray-700">Menu Items</h3>
                <p className="text-gray-500 text-sm mt-1">Manage your restaurant menu</p>
                <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                  Manage Menu
                </button>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium text-gray-700">Customer Leads</h3>
                <p className="text-gray-500 text-sm mt-1">View and manage customer leads</p>
                <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                  View Leads
                </button>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium text-gray-700">Contact Form Submissions</h3>
                <p className="text-gray-500 text-sm mt-1">Review customer inquiries</p>
                <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                  View Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}