import { useState, useEffect } from "react";
// Temporarily import both for testing the refactored version
// import Navbar from "@/components/Navbar";
import Navbar from "@/components/NavbarRefactored";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeaturedItems from "@/components/FeaturedItems";
import AboutSection from "@/components/AboutSection";
import ChefSection from "@/components/ChefSection";
import MenuSection from "@/components/MenuSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import SEO from "@/components/SEO";
import { registerServiceWorker } from "@/lib/serviceWorkerRegistration";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Register service worker for PWA functionality with enhanced error handling
  useEffect(() => {
    // Only register in production to avoid interference during development
    if (import.meta.env.PROD) {
      registerServiceWorker();
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
      <VideoSection />
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
