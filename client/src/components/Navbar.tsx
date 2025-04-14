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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold font-oswald text-primary tracking-wider">
            GORILLA <span className="text-secondary">BAR & GRILL</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection("home")} 
            className="font-oswald uppercase tracking-wide hover:text-primary transition"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection("menu")} 
            className="font-oswald uppercase tracking-wide hover:text-primary transition"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="font-oswald uppercase tracking-wide hover:text-primary transition"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("location")} 
            className="font-oswald uppercase tracking-wide hover:text-primary transition"
          >
            Location
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="font-oswald uppercase tracking-wide hover:text-primary transition"
          >
            Contact
          </button>
          <button 
            onClick={onOrderClick} 
            className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded hover:bg-opacity-90 transition"
          >
            Order Now
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-darkgray focus:outline-none" 
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection("home")} 
              className="font-oswald uppercase tracking-wide hover:text-primary transition py-2 text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("menu")} 
              className="font-oswald uppercase tracking-wide hover:text-primary transition py-2 text-left"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="font-oswald uppercase tracking-wide hover:text-primary transition py-2 text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("location")} 
              className="font-oswald uppercase tracking-wide hover:text-primary transition py-2 text-left"
            >
              Location
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="font-oswald uppercase tracking-wide hover:text-primary transition py-2 text-left"
            >
              Contact
            </button>
            <button 
              onClick={onOrderClick} 
              className="px-4 py-2 bg-primary text-white font-oswald uppercase tracking-wide rounded hover:bg-opacity-90 transition text-center"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
