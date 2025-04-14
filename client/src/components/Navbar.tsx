import { useState } from "react";
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

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-md border-b border-border">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
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
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection("home")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection("menu")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("location")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            Location
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </button>
          
          {/* Cart Button */}
          <Button 
            onClick={onOrderClick} 
            className="relative p-2 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-full"
            aria-label="Shopping Cart"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          
          <button 
            onClick={onOrderClick} 
            className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded-md hover:bg-primary/80 transition shadow-md transform hover:scale-105 hover:shadow-lg duration-300 hover:translate-y-[-2px]"
          >
            Order Now
          </button>
        </nav>
        
        {/* Mobile Cart and Menu Buttons */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Cart Button */}
          <Button 
            onClick={onOrderClick} 
            className="relative p-2 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-full"
            aria-label="Shopping Cart"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu Button */}
          <button 
            className="text-foreground/80 focus:outline-none hover:text-accent transition-colors" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-border">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection("home")} 
              className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors py-2 text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("menu")} 
              className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors py-2 text-left"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors py-2 text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("location")} 
              className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors py-2 text-left"
            >
              Location
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors py-2 text-left"
            >
              Contact
            </button>
            <button 
              onClick={onOrderClick} 
              className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded-md hover:bg-primary/80 transition text-center shadow-md transform hover:scale-105 duration-300"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
