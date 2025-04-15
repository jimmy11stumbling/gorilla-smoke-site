import { useState, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "wouter";
import logoImage from "../assets/gorilla-logo.jpg";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOrderClick: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Set focus to the section for better accessibility
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
    }
  };
  
  // Handle keyboard navigation in mobile menu
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isMobileMenuOpen) return;
    
    // Close menu on escape
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    }
    
    // Trap focus within mobile menu
    if (e.key === 'Tab') {
      if (!firstFocusableElementRef.current || !lastFocusableElementRef.current) return;
      
      // If shift + tab pressed and first element is focused, move to last element
      if (e.shiftKey && document.activeElement === firstFocusableElementRef.current) {
        e.preventDefault();
        lastFocusableElementRef.current.focus();
      } 
      // If tab pressed and last element is focused, cycle to first element
      else if (!e.shiftKey && document.activeElement === lastFocusableElementRef.current) {
        e.preventDefault();
        firstFocusableElementRef.current.focus();
      }
    }
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    // Only add listener if mobile menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  // Focus first menu item when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen && firstFocusableElementRef.current) {
      setTimeout(() => {
        firstFocusableElementRef.current?.focus();
      }, 100);
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <img 
              src={logoImage} 
              alt="Gorilla Bar & Grill Logo" 
              className="h-14 mr-3 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="text-2xl font-bold font-oswald tracking-wider hidden sm:block">
              <span className="text-white">GORILLA</span> <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">BAR & GRILL</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main Navigation">
          <button 
            onClick={() => scrollToSection("home")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to home section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("menu")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to menu section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">Menu</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to about section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("chef")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to chef section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">Chef</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("location")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to location section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">Location</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="font-oswald uppercase tracking-wide text-white/80 hover:text-white focus-visible:text-white transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Navigate to contact section"
          >
            <span className="relative z-10 bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent group-hover:bg-gradient-to-r group-focus-visible:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-focus-visible:from-primary group-focus-visible:to-accent transition-all duration-300">Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full group-focus-visible:w-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"></span>
          </button>
          
          {/* Cart Button */}
          <Button 
            onClick={onOrderClick} 
            className="relative p-2 bg-transparent border border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 rounded-full hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transform hover:scale-105"
            aria-label="Shopping Cart"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>
          
          <button 
            onClick={onOrderClick} 
            className="relative px-5 py-2.5 font-oswald uppercase tracking-wide rounded-md shadow-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Open order menu"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-80 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20"></span>
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent transform translate-y-1 group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300"></span>
            <span className="relative text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2">
              <i className="fas fa-utensils text-sm" aria-hidden="true"></i>
              Order Now
            </span>
          </button>
        </nav>
        
        {/* Mobile Cart and Menu Buttons */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Cart Button */}
          <Button 
            onClick={onOrderClick} 
            className="relative p-2 bg-transparent border border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 rounded-full hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transform hover:scale-105"
            aria-label="Shopping Cart"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu Button */}
          <button 
            ref={mobileMenuButtonRef}
            className="relative p-2 text-white/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black hover:text-white transition-all duration-300 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm hover:border-primary/30 hover:bg-black/50" 
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-t border-white/10 animate-fadeIn"
          ref={mobileMenuRef}
          role="menu"
          aria-labelledby="mobile-menu-button"
          onKeyDown={handleKeyDown}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              ref={firstFocusableElementRef}
              onClick={() => scrollToSection("home")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Home</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("menu")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Menu</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">About</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("chef")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Chef</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("location")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Location</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="font-oswald uppercase tracking-wide text-white/80 hover:text-white transition-all duration-300 py-2 text-left group relative focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">Contact</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
            </button>
            <button 
              ref={lastFocusableElementRef}
              onClick={onOrderClick} 
              className="relative px-5 py-2.5 font-oswald uppercase tracking-wide rounded-md shadow-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="menuitem"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20"></span>
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2">
                <i className="fas fa-utensils text-sm"></i>
                Order Now
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
