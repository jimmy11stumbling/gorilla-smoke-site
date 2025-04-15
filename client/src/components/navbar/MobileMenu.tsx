import * as React from "react";
import { useRef, useEffect, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { NavbarLink } from "./NavbarLink";

// Define the navigation items for reuse
export const navigationItems = [
  { label: "Home", sectionId: "home" },
  { label: "Menu", sectionId: "menu" },
  { label: "About", sectionId: "about" },
  { label: "Chef", sectionId: "chef" },
  { label: "Location", sectionId: "location" },
  { label: "Contact", sectionId: "contact" },
];

interface MobileMenuProps {
  isOpen: boolean;
  activeSection: string;
  itemCount: number;
  onClose: () => void;
  onNavItemClick: (sectionId: string) => void;
  onOrderClick: () => void;
  firstFocusableElementRef: React.RefObject<HTMLButtonElement>;
  lastFocusableElementRef: React.RefObject<HTMLButtonElement>;
}

export function MobileMenu({
  isOpen,
  activeSection,
  itemCount,
  onClose,
  onNavItemClick,
  onOrderClick,
  firstFocusableElementRef,
  lastFocusableElementRef
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation in mobile menu
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    
    // Close menu on escape
    if (e.key === 'Escape') {
      onClose();
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

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus first element when menu opens
  useEffect(() => {
    if (isOpen && firstFocusableElementRef.current) {
      setTimeout(() => {
        firstFocusableElementRef.current?.focus();
      }, 100);
    }
  }, [isOpen, firstFocusableElementRef]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-start justify-end"
      onKeyDown={handleKeyDown}
    >
      <div 
        ref={menuRef}
        className="h-screen w-4/5 max-w-sm bg-secondary shadow-lg transform transition-transform overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="p-5 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button 
              ref={firstFocusableElementRef}
              className="text-foreground/70 hover:text-primary rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={onClose}
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <nav className="py-2 divide-y divide-border/20">
          {navigationItems.map((item) => (
            <div key={item.sectionId} className="px-2 py-1">
              <NavbarLink
                label={item.label}
                sectionId={item.sectionId}
                isActive={activeSection === item.sectionId}
                onClick={onNavItemClick}
                isMobile={true}
              />
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <Button 
            ref={lastFocusableElementRef}
            className="w-full bg-primary hover:bg-primary/80 py-6 text-white font-bold shadow-md relative group"
            onClick={() => {
              onOrderClick();
              onClose();
            }}
          >
            <span className="mr-2">Order Online</span>
            {itemCount > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}