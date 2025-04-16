import React from 'react';

export default function AdminTest() {
  return (
    <div className="container mx-auto py-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Access Test</h2>
        <p>This is a basic test page with no hooks or complex components.</p>
        <a href="/" className="px-4 py-2 mt-4 inline-block bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Home
        </a>
      </div>
    </div>
  );
}