import React from 'react';
import { useLocation } from 'wouter';

export default function AdminBasic() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="container mx-auto py-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Access Test</h2>
        <p>This is a simplified admin page for testing access.</p>
        <button 
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setLocation('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}