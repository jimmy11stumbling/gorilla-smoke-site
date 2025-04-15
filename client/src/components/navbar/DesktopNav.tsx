import * as React from "react";
import { navigationItems } from "./MobileMenu";
import { NavbarLink } from "./NavbarLink";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";

interface DesktopNavProps {
  activeSection: string;
  itemCount: number;
  onNavItemClick: (sectionId: string) => void;
  onOrderClick: () => void;
}

export function DesktopNav({ 
  activeSection, 
  itemCount, 
  onNavItemClick, 
  onOrderClick 
}: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center justify-between ml-auto">
      <nav className="flex mr-6 space-x-1" aria-label="Main Navigation">
        {navigationItems.map((item) => (
          <NavbarLink
            key={item.sectionId}
            label={item.label}
            sectionId={item.sectionId}
            isActive={activeSection === item.sectionId}
            onClick={onNavItemClick}
          />
        ))}
      </nav>
      
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        
        <Button 
          onClick={onOrderClick}
          className="bg-primary hover:bg-primary/80 text-white font-bold px-4 py-2 shadow-md rounded relative group"
          aria-label="Order Online"
        >
          <span className="mr-2">Order Online</span>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 bg-white text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}