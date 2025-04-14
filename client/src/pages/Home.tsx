import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedItems from "@/components/FeaturedItems";
import AboutSection from "@/components/AboutSection";
import ChefSection from "@/components/ChefSection";
import MenuSection from "@/components/MenuSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import SEO from "@/components/SEO";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);
  
  return (
    <div className="font-poppins bg-[#FAFAFA] text-darkgray">
      <SEO 
        title="Gorilla Smoke & Grill | Authentic BBQ in Laredo, TX"
        description="Experience the best authentic BBQ in Laredo at Gorilla Smoke & Grill. Our menu features flame-grilled favorites, specialty burgers, and signature dishes crafted by Chef Ramiro Garza."
        canonical="https://gorillasmokegrill.com"
        ogImage="/og-image.svg"
        keywords="BBQ Laredo, Gorilla Smoke and Grill, Chef Ramiro Garza, best burgers in Laredo, Texas barbecue, restaurant Laredo TX, Mexican American BBQ, online ordering"
      />
      <Navbar onOrderClick={() => setIsOrderModalOpen(true)} />
      <HeroSection onOrderClick={() => setIsOrderModalOpen(true)} />
      <FeaturedItems />
      <AboutSection />
      <ChefSection />
      <MenuSection onOrderClick={() => setIsOrderModalOpen(true)} />
      <LocationSection />
      <ContactSection />
      <Footer />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </div>
  );
}
