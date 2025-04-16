import React from 'react';
import { MapPin } from 'lucide-react';

// This component renders the location header banner at the top of the page
// This will be a "null" component that doesn't render anything
// as we're removing this feature per client request

export default function LocationHeader() {
  // Return null instead of the original location header
  return null;
  
  // The original component rendered something like this, which we're now removing:
  // return (
  //   <div className="w-full bg-red-600 px-4 py-2 flex justify-center gap-4 flex-wrap text-white">
  //     <div className="flex items-center">
  //       <MapPin className="mr-1 h-4 w-4" />
  //       <span>Del Mar: 3910 E Del Mar Ave</span>
  //     </div>
  //     <div className="flex items-center">
  //       <MapPin className="mr-1 h-4 w-4" />
  //       <span>Zapata: 608 Zapata Hwy</span>
  //     </div>
  //     <div className="flex items-center">
  //       <MapPin className="mr-1 h-4 w-4" />
  //       <span>San Bernardo: 3301 San Bernardo Ave</span>
  //     </div>
  //   </div>
  // );
}