import { useState } from "react";
import Navbar from "@/components/Navbar";
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

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  return (
    <div className="font-poppins bg-[#FAFAFA] text-darkgray">
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
