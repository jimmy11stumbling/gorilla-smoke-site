import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

// Import our modular components
import {
  NavbarHeader,
  DesktopNav,
  MobileMenu,
  useNavigation
} from "./navbar";

interface NavbarProps {
  onOrderClick: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  // Use our custom navigation hook
  const { activeSection, isScrolled, scrollToSection } = useNavigation();

  // Handle mobile menu navigation
  const handleNavItemClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-secondary/95 shadow-lg backdrop-blur-sm py-1" 
          : "bg-secondary/60 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavbarHeader isScrolled={isScrolled} />
          
          {/* Desktop Navigation */}
          <DesktopNav 
            activeSection={activeSection} 
            itemCount={itemCount} 
            onNavItemClick={scrollToSection} 
            onOrderClick={onOrderClick} 
          />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              ref={mobileMenuButtonRef}
              variant="ghost" 
              size="sm"
              className="text-white p-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </Button>
            
            {itemCount > 0 && (
              <span className="ml-2 relative">
                <Button 
                  onClick={onOrderClick}
                  variant="ghost" 
                  size="sm"
                  className="text-white p-1 relative"
                  aria-label={`View cart with ${itemCount} items`}
                >
                  <i className="fas fa-shopping-cart text-xl"></i>
                  <span className="absolute -right-2 -top-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        activeSection={activeSection}
        itemCount={itemCount}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavItemClick={handleNavItemClick}
        onOrderClick={onOrderClick}
        firstFocusableElementRef={firstFocusableElementRef}
        lastFocusableElementRef={lastFocusableElementRef}
      />
    </header>
  );
}