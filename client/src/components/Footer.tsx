export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold font-oswald uppercase mb-4 tracking-wide">
              Gorilla Bar & Grill
            </h3>
            <p className="mb-6">
              Laredo's premier destination for flame-grilled favorites and craft beverages since 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <i className="fab fa-yelp text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-accent transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-accent transition"
                >
                  Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-accent transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-accent transition"
                >
                  Location
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-accent transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-accent mt-1 mr-3"></i>
                <span>3910 E Del Mar Ave<br />Laredo, TX 78045</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-accent mr-3"></i>
                <span>(956) 568-1450</span>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp text-accent mr-3"></i>
                <span>+1 956-337-8359</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide">
              Hours
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Thursday:</span>
                <span>11am - 10pm</span>
              </li>
              <li className="flex justify-between">
                <span>Friday - Saturday:</span>
                <span>11am - 12am</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>12pm - 9pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Gorilla Bar & Grill. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
