import { useState, useEffect } from "react";
import { navigationItems } from "./MobileMenu";

export function useNavigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled to update navbar styles
      setIsScrolled(window.scrollY > 50);
      
      // Determine which section is currently in view
      const scrollPosition = window.scrollY + 200; // Offset for better UX
      
      // Find the current active section
      for (let i = navigationItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navigationItems[i].sectionId);
        
        if (section) {
          const sectionTop = section.offsetTop;
          
          if (scrollPosition >= sectionTop) {
            setActiveSection(navigationItems[i].sectionId);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Set focus to the section for better accessibility
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
      setActiveSection(sectionId);
    }
  };

  return {
    activeSection,
    isScrolled,
    scrollToSection
  };
}