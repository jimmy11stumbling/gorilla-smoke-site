import { useState, useMemo } from 'react';
import OptimizedImage from './OptimizedImage';
import DeliveryButtons from './DeliveryButtons';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

interface LocationProps {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string[];
  mapUrl: string;
  directionsUrl: string;
}

const locations: LocationProps[] = [
  {
    id: 'del-mar',
    name: 'Gorilla Smoke & Grill - E Del Mar',
    address: '3910 E Del Mar',
    city: 'Laredo, TX 78041',
    phone: '956-568-0744',
    hours: ['Monday - Sunday: 11:00 AM - 10:00 PM'],
    mapUrl: "https://maps.googleapis.com/maps/api/staticmap?center=3910+E+Del+Mar,Laredo,TX&zoom=15&size=600x400&markers=color:red%7C3910+E+Del+Mar,Laredo,TX&key=NO_API_KEY_REQUIRED_FOR_PREVIEW",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=3910+E+Del+Mar+Laredo+TX+78041"
  },
  {
    id: 'zapata',
    name: 'Gorilla Smoke & Grill - Zapata Hwy',
    address: '608 Zapata Hwy',
    city: 'Laredo, TX 78043',
    phone: '956-568-1450',
    hours: ['Monday - Sunday: 11:00 AM - 10:00 PM'],
    mapUrl: "https://maps.googleapis.com/maps/api/staticmap?center=608+Zapata+Hwy,Laredo,TX&zoom=15&size=600x400&markers=color:red%7C608+Zapata+Hwy,Laredo,TX&key=NO_API_KEY_REQUIRED_FOR_PREVIEW",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=608+Zapata+Hwy+Laredo+TX+78043"
  },
  {
    id: 'san-bernardo',
    name: 'Gorilla Smoke & Grill - San Bernardo',
    address: '3301 San Bernardo Ave',
    city: 'Laredo, TX 78040',
    phone: '956-415-6011',
    hours: [
      'Monday: CLOSED',
      'Tuesday - Sunday: 5:00 PM - 11:00 PM'
    ],
    mapUrl: "https://maps.googleapis.com/maps/api/staticmap?center=3301+San+Bernardo+Ave,Laredo,TX&zoom=15&size=600x400&markers=color:red%7C3301+San+Bernardo+Ave,Laredo,TX&key=NO_API_KEY_REQUIRED_FOR_PREVIEW",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=3301+San+Bernardo+Ave+Laredo+TX+78040"
  }
];

export default function LocationSection() {
  const [activeLocation, setActiveLocation] = useState<string>(locations[0].id);
  
  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];
  
  // Map location IDs to DeliveryButtons locationIds
  const deliveryLocationMap = useMemo(() => ({
    'del-mar': 'delmar',
    'zapata': 'zapata',
    'san-bernardo': 'sanbernardo'
  }), []);
  
  return (
    <section id="location" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide">
            Find <span className="text-accent">Us</span>
          </h2>
          <p className="max-w-2xl mx-auto">
            Visit one of our three convenient locations in Laredo for an unforgettable dining experience
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {locations.map(location => (
              <button
                key={location.id}
                type="button"
                onClick={() => setActiveLocation(location.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeLocation === location.id 
                    ? 'bg-accent text-secondary' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } ${
                  location.id === 'del-mar' 
                    ? 'rounded-l-lg' 
                    : location.id === 'san-bernardo' 
                      ? 'rounded-r-lg' 
                      : ''
                } focus:z-10 focus:ring-2 focus:ring-accent`}
              >
                {location.name.split(' - ')[1]}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="h-[400px] bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <OptimizedImage 
                    src={currentLocation.mapUrl}
                    alt={`${currentLocation.name} Location Map`}
                    className="rounded-lg mx-auto max-w-full max-h-full opacity-70"
                    width={600}
                    height={400}
                    loading="lazy"
                    placeholderColor="#2d3748"
                    quality={75}
                  />
                </div>
                <a 
                  href={currentLocation.directionsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-accent text-secondary font-oswald uppercase tracking-wider rounded-md hover:bg-opacity-90 transition"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-gray-800 p-8 rounded-lg h-full">
              <h3 className="text-2xl font-bold font-oswald uppercase mb-6 tracking-wide">
                {currentLocation.name}
              </h3>
              
              <div className="flex items-start mb-6">
                <FaMapMarkerAlt className="text-accent text-xl mt-1 mr-4" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p>{currentLocation.address}</p>
                  <p>{currentLocation.city}</p>
                  <p>United States</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <FaPhone className="text-accent text-xl mt-1 mr-4" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <p>{currentLocation.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <FaClock className="text-accent text-xl mt-1 mr-4" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Hours</h4>
                  {currentLocation.hours.map((hour, index) => (
                    <p key={index}>{hour}</p>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <a 
                  href={currentLocation.directionsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-accent text-secondary font-oswald uppercase tracking-wider rounded-md hover:bg-opacity-90 transition"
                >
                  Get Directions
                </a>
              </div>
              
              <div className="mt-8">
                <h4 className="font-bold text-lg mb-3">Order for Delivery:</h4>
                <DeliveryButtons 
                  locationId={deliveryLocationMap[activeLocation as keyof typeof deliveryLocationMap] as any} 
                  showLabels={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
