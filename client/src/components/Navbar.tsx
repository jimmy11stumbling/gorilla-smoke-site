import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import DeliveryButtons from "./DeliveryButtons";
import LocationSelectorWithReservation from "./LocationSelectorWithReservation";
import { useLocation } from "@/contexts/LocationContext";
import { useReservation } from "@/contexts/ReservationContext";
import { MapPin, CalendarDays, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Menu", id: "menu" },
  { label: "About", id: "about" },
  { label: "Chef", id: "chef" },
  { label: "Location", id: "location" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { currentLocation } = useLocation();
  const { openReservationModal } = useReservation();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 72;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const locationLabel = currentLocation?.name.split(" - ")[1] || "Delmar";

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-white/10"
          : "bg-gradient-to-b from-black/80 to-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <motion.div
            className="text-xl font-bold font-oswald tracking-wider"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-white">GORILLA</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BAR & GRILL
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                data-testid={`nav-link-${id}`}
                className="relative px-3 py-2 font-oswald uppercase tracking-wide text-sm transition-colors duration-200 group"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/60 group-hover:text-white"
                  }`}
                >
                  {label}
                </span>

                {/* Active pill background */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Active bottom bar */}
                <motion.span
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent origin-left"
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Hover underline (only when not active) */}
                {!isActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-white/30 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200" />
                )}
              </button>
            );
          })}

          {/* Divider */}
          <span className="w-px h-5 bg-white/20 mx-2" />

          {/* Location Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLocationSelectorOpen(true)}
            data-testid="button-location-selector"
            className="flex items-center gap-1.5 font-oswald uppercase tracking-wide text-white/70 hover:text-white border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {locationLabel}
          </Button>

          {/* Reserve Button */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              size="sm"
              data-testid="button-reserve"
              className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 border-0 font-oswald tracking-wide uppercase shadow-md shadow-primary/30"
              onClick={openReservationModal}
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
              Reserve
            </Button>
          </motion.div>

          <DeliveryButtons size="sm" showLabels={false} />
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setLocationSelectorOpen(true)}
            data-testid="button-location-mobile"
            className="p-2 text-white/70 hover:text-white border border-white/15 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            aria-label="Select location"
          >
            <MapPin className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            data-testid="button-mobile-menu"
            className="p-2 text-white/70 hover:text-white border border-white/15 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto px-4 pt-3 pb-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, id }, i) => {
                const isActive = activeSection === id;
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045, duration: 0.22 }}
                    onClick={() => scrollToSection(id)}
                    data-testid={`mobile-nav-link-${id}`}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg font-oswald uppercase tracking-wide text-left transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-accent flex-shrink-0" />
                    )}
                    <span>{label}</span>
                  </motion.button>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.045 + 0.05 }}
                className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-3"
              >
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 font-oswald tracking-wide uppercase shadow-md shadow-primary/20"
                  data-testid="button-reserve-mobile"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openReservationModal();
                  }}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Reserve a Table
                </Button>

                <div>
                  <p className="font-oswald uppercase text-white/50 text-xs mb-2 px-1 tracking-widest">
                    Order Delivery
                  </p>
                  <DeliveryButtons size="sm" vertical={true} />
                </div>

                <div className="pt-1 border-t border-white/10">
                  <Link href="/admin" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white/60 hover:text-white hover:border-white/40 font-oswald tracking-wide uppercase"
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>

    {/* Location Selector Modal - rendered outside header to avoid stacking context issues */}
    <LocationSelectorWithReservation
      open={locationSelectorOpen}
      onOpenChange={setLocationSelectorOpen}
    />
    </>
  );
}
