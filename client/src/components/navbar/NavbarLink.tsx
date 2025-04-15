import * as React from "react";

interface NavbarLinkProps {
  label: string;
  sectionId: string;
  isActive: boolean;
  onClick: (sectionId: string) => void;
  isMobile?: boolean;
}

export function NavbarLink({ label, sectionId, isActive, onClick, isMobile = false }: NavbarLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(sectionId);
  };

  // Different styling based on mobile vs desktop
  const baseClasses = "text-white relative py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded-sm";
  
  const mobileClasses = "block w-full px-4 py-3 text-left font-oswald tracking-wider text-lg hover:bg-gray-800";
  
  const desktopClasses = `${baseClasses} px-3 font-medium hover:text-primary ${
    isActive 
      ? "font-bold after:absolute after:bottom-0 after:left-1/2 after:w-2 after:h-2 after:bg-primary after:rounded-full after:transform after:-translate-x-1/2 after:transition-all" 
      : "opacity-80 hover:opacity-100"
  }`;

  return (
    <button
      className={isMobile ? mobileClasses : desktopClasses}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );
}