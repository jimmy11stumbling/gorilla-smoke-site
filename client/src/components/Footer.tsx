import DeliveryButtons from "./DeliveryButtons";

export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold font-oswald uppercase mb-4 tracking-wide text-white">
              Gorilla Bar & <span className="text-primary">Grill</span>
            </h3>
            <p className="mb-6 text-foreground/80">
              Laredo's premier destination for flame-grilled favorites and craft beverages since 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/80 hover:text-accent transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-foreground/80 hover:text-accent transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-foreground/80 hover:text-accent transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-foreground/80 hover:text-accent transition-colors">
                <i className="fab fa-yelp text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/80 hover:text-accent transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/80 hover:text-accent transition-colors"
                >
                  Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/80 hover:text-accent transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/80 hover:text-accent transition-colors"
                >
                  Location
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/80 hover:text-accent transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide text-white">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-accent mt-1 mr-3"></i>
                <span className="text-foreground/80">3910 E Del Mar Ave<br />Laredo, TX 78045</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-accent mr-3"></i>
                <span className="text-foreground/80">(956) 568-1450</span>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp text-accent mr-3"></i>
                <span className="text-foreground/80">+1 956-337-8359</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4 tracking-wide text-white">
              Hours
            </h3>
            <ul className="space-y-2 text-foreground/80">
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
        
        <div className="border-t border-border pt-8 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Gorilla Bar & Grill. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
