import { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import ReservationModal from "@/components/ReservationModal";
import Footer from "@/components/Footer";

// Lazy load non-critical sections to improve initial load time
const VideoSection = lazy(() => import("@/components/VideoSection"));
const FeaturedItems = lazy(() => import("@/components/FeaturedItems"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ChefSection = lazy(() => import("@/components/ChefSection"));
const MenuSection = lazy(() => import("@/components/MenuSection"));
const LocationSection = lazy(() => import("@/components/LocationSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

// Loading placeholder for lazy-loaded components
const SectionLoader = () => (
  <div className="py-12 flex justify-center items-center">
    <div className="animate-pulse bg-gray-300 h-40 w-full max-w-5xl rounded-lg"></div>
  </div>
);

export default function Home() {
  // Prefetch important sections after the initial render
  useEffect(() => {
    // Use requestIdleCallback (or its polyfill) to load non-critical components
    // during browser idle time
    const idleCallback = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 1));
    
    idleCallback(() => {
      // Preload key components
      import("@/components/FeaturedItems");
      import("@/components/MenuSection"); 
    });
  }, []);
  
  return (
    <div className="font-poppins bg-[#FAFAFA] text-darkgray">
      <SEO 
        title="Gorilla Smoke & Grill | Authentic BBQ in Laredo, TX"
        description="Experience the best authentic BBQ in Laredo at Gorilla Smoke & Grill. Our menu features flame-grilled favorites, specialty burgers, and signature dishes crafted by Chef Ramiro Garza."
        canonical="https://gorillasmokegrill.com"
        ogImage="/og-image.svg"
        keywords="BBQ Laredo, Gorilla Smoke and Grill, Chef Ramiro Garza, best burgers in Laredo, Texas barbecue, restaurant Laredo TX, Mexican American BBQ, online ordering, table reservations"
      />
      
      {/* Critical path - loaded immediately */}
      <Navbar />
      <HeroSection />
      
      {/* Non-critical sections - lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <VideoSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FeaturedItems />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ChefSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <MenuSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <LocationSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>
      
      <Footer />
      
      {/* Reservation Modal */}
      <ReservationModal />
    </div>
  );
}
