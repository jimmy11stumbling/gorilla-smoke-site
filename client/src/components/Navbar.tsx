import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import DeliveryButtons from "./DeliveryButtons";
import LocationSelectorWithReservation from "./LocationSelectorWithReservation";
import { useLocation } from "@/contexts/LocationContext";
import { useReservation } from "@/contexts/ReservationContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const { currentLocation } = useLocation();
  const { openReservationModal } = useReservation();

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="text-2xl font-bold font-oswald tracking-wider">
              <span className="text-white">GORILLA</span> <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">BAR & GRILL</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection("home")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("menu")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Menu</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("chef")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Chef</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("location")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Location</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 relative group"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
          </button>
          
          {/* Location Selector Button */}
          <Button
            variant="outline"
            size="sm"
            className="bg-black/30 backdrop-blur-sm text-white border-white/20 hover:bg-black/50 hover:border-primary/30"
            onClick={() => setLocationSelectorOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {currentLocation?.name.split(' - ')[1] || 'Delmar'}
          </Button>
          
          {/* Reserve Table Button */}
          <Button
            variant="default"
            size="sm"
            className="bg-accent text-white hover:bg-accent/90"
            onClick={openReservationModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Reserve
          </Button>
          
          {/* Delivery Buttons - Desktop */}
          <DeliveryButtons size="sm" showLabels={false} />
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Location Button - Mobile */}
          <button 
            className="relative p-2 text-white/80 focus:outline-none hover:text-white transition-all duration-300 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm hover:border-primary/30 hover:bg-black/50 active:scale-95" 
            aria-label="Select location"
            onClick={() => setLocationSelectorOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="relative p-2 text-white/80 focus:outline-none hover:text-white transition-all duration-300 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm hover:border-primary/30 hover:bg-black/50 active:scale-95" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2 opacity-100' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 opacity-100' : 'opacity-100'}`}></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-t border-white/10 animate-fadeIn">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection("home")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Home</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("menu")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Menu</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">About</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("chef")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Chef</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("location")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Location</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Contact</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            
            {/* Reserve Button - Mobile */}
            <div className="py-2">
              <Button
                variant="default"
                size="default"
                className="w-full bg-accent text-white hover:bg-accent/90"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openReservationModal();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Reserve a Table
              </Button>
            </div>
            
            <div className="mt-2 py-2 border-t border-white/10">
              <h4 className="font-oswald uppercase text-white text-base mb-3">Order Through Our Delivery Partners:</h4>
              <DeliveryButtons size="sm" vertical={true} />
            </div>
            
            {/* Admin Link - Mobile */}
            <div className="mt-2 py-2 border-t border-white/10 pt-4">
              <Link href="/admin" className="w-full">
                <Button 
                  variant="default" 
                  className="w-full bg-primary text-white hover:bg-primary/80 font-bold"
                >
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Location Selector Modal */}
      <LocationSelectorWithReservation 
        open={locationSelectorOpen} 
        onOpenChange={setLocationSelectorOpen} 
      />
    </header>
  );
}
