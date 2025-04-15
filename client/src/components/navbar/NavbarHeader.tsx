import * as React from "react";
import { Link } from "wouter";
import logoImage from "../../assets/gorilla-logo.jpg";

interface NavbarHeaderProps {
  isScrolled: boolean;
}

export function NavbarHeader({ isScrolled }: NavbarHeaderProps) {
  return (
    <div className="flex items-center shrink-0">
      <Link href="/">
        <a 
          className={`flex items-center mr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded-md ${
            isScrolled ? 'py-2' : 'py-3'
          } transition-all duration-300`}
          aria-label="Gorilla Bar & Grill Home"
        >
          <div className={`relative rounded-full overflow-hidden transition-all duration-300 ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <img 
              src={logoImage} 
              alt="Gorilla Bar & Grill" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2">
            <span className={`font-bold text-white transition-all duration-300 ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}>
              Gorilla
            </span>
            <span className="ml-1 text-primary font-semibold">Grill</span>
          </div>
        </a>
      </Link>
    </div>
  );
}