export default function LocationSection() {
  return (
    <section id="location" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide">
            Find <span className="text-accent">Us</span>
          </h2>
          <p className="max-w-2xl mx-auto">
            Visit us for an unforgettable dining experience in Laredo
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="h-[400px] bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src="https://maps.googleapis.com/maps/api/staticmap?center=3910+E+Del+Mar+Ave,Laredo,TX&zoom=15&size=600x400&markers=color:red%7C3910+E+Del+Mar+Ave,Laredo,TX&key=NO_API_KEY_REQUIRED_FOR_PREVIEW" 
                    alt="Gorilla Bar & Grill Location" 
                    className="rounded-lg mx-auto max-w-full max-h-full opacity-60"
                  />
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=3910+E+Del+Mar+Ave+Laredo+TX+78045" 
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
                Gorilla Bar & Grill
              </h3>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-map-marker-alt text-accent text-xl mt-1 mr-4"></i>
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p>3910 E Del Mar Ave</p>
                  <p>Laredo, TX 78045</p>
                  <p>United States</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-phone text-accent text-xl mt-1 mr-4"></i>
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <p>(956) 568-1450</p>
                  <p className="flex items-center mt-1">
                    <i className="fab fa-whatsapp mr-2"></i> +1 956-337-8359
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-clock text-accent text-xl mt-1 mr-4"></i>
                <div>
                  <h4 className="font-bold text-lg mb-1">Hours</h4>
                  <p>Monday - Thursday: 11am - 10pm</p>
                  <p>Friday - Saturday: 11am - 12am</p>
                  <p>Sunday: 12pm - 9pm</p>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=3910+E+Del+Mar+Ave+Laredo+TX+78045" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-accent text-secondary font-oswald uppercase tracking-wider rounded-md hover:bg-opacity-90 transition"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
