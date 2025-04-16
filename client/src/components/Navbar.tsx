import { useState } from "react";
import { Link } from "wouter";
import logoImage from "../assets/gorilla-logo.jpg";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import DeliveryButtons from "./DeliveryButtons";

interface NavbarProps {
  onOrderClick?: () => void; // Made optional since we're not using it anymore
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
        <nav className="hidden md:flex items-center space-x-8">
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
          
          {/* Delivery Buttons - Desktop */}
          <DeliveryButtons size="sm" showLabels={false} />
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          
          {/* Mobile Menu Button */}
          <button 
            className="relative p-2 text-white/80 focus:outline-none hover:text-white transition-all duration-300 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm hover:border-primary/30 hover:bg-black/50" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
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
            <div className="mt-4 py-2">
              <h4 className="font-oswald uppercase text-white text-base mb-3">Order Through Our Delivery Partners:</h4>
              <DeliveryButtons size="sm" vertical={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
