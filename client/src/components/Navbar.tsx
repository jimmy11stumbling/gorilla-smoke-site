import { useState } from "react";
import { Link } from "wouter";

interface NavbarProps {
  onOrderClick: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold font-oswald tracking-wider">
            <span className="text-white">GORILLA</span> <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">BAR & GRILL</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection("home")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection("menu")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("location")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            Location
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="font-oswald uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
          >
            Contact
          </button>
          <button 
            onClick={onOrderClick} 
            className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded-md hover:bg-primary/80 transition shadow-md"
          >
            Order Now
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground/80 focus:outline-none" 
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
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
              className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded-md hover:bg-primary/80 transition text-center shadow-md"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
