import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuCategory } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DeliveryButtons from "./DeliveryButtons";
import OrderModal from "./OrderModal";
import type { MenuItem } from "@shared/schema";
import { 
  FaUtensils, 
  FaCheese, 
  FaHamburger, 
  FaFire, 
  FaBacon, 
  FaGlassMartini, 
  FaBreadSlice, 
  FaCarrot, 
  FaPepperHot 
} from 'react-icons/fa';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const [isVisible, setIsVisible] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all menu items
  const { 
    data: apiMenuItems, 
    isLoading, 
    isError 
  } = useQuery<{ success: boolean, data: MenuItem[] }>({
    queryKey: ['/api/menu'],
    retry: 3
  });
  
  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading menu",
        description: "There was an error loading the menu. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);
  
  const menuItems = apiMenuItems?.data || [];

  useEffect(() => {
    // Set up intersection observer to trigger animations when menu section is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const menuSection = document.getElementById("menu");
    if (menuSection) {
      observer.observe(menuSection);
    }

    return () => observer.disconnect();
  }, []);

  const categoryIcons = {
    all: FaUtensils,
    starters: FaCheese,
    burgers: FaHamburger, 
    grill: FaFire,
    sides: FaBacon,
    drinks: FaGlassMartini,
    sandwiches: FaBreadSlice,
    tacos: FaPepperHot,
    salads: FaCarrot
  };

  const categories: { id: MenuCategory | "all", label: string }[] = [
    { id: "all", label: "All" },
    { id: "starters", label: "Starters" },
    { id: "sandwiches", label: "Sandwiches" },
    { id: "burgers", label: "Burgers" },
    { id: "tacos", label: "Tacos" },
    { id: "salads", label: "Salads" },
    { id: "grill", label: "From The Grill" },
    { id: "sides", label: "Sides" },
    { id: "drinks", label: "Drinks" }
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter((item: MenuItem) => item.category === activeCategory);

  // Loading skeleton for menu items
  const MenuItemSkeleton = () => (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/5" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6 mt-2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );

  return (
    <section id="menu" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide text-white">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Menu</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Savor our wide selection of house specialties, all made with fresh ingredients and cooked to perfection
          </p>
        </div>
        
        {/* Menu Categories Tabs */}
        <div className={`mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button 
                key={category.id}
                className={`flex items-center px-6 py-2 font-oswald uppercase tracking-wider rounded-md transition-all duration-300 ${
                  activeCategory === category.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "bg-card text-white hover:bg-primary/80 hover:scale-105"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {(() => {
                  const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons];
                  return <IconComponent className="mr-2" />;
                })()}
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array(6).fill(0).map((_, index) => (
              <MenuItemSkeleton key={index} />
            ))
          ) : filteredItems.length > 0 ? (
            // Show menu items
            filteredItems.map((item: MenuItem, index: number) => (
              <div 
                key={item.id} 
                className={`menu-item bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl hover:border-accent transition-all duration-300 transform ${
                  isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="h-48 overflow-hidden group relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=480&q=80";
                      e.currentTarget.onerror = null; // Prevent infinite fallback loop
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute bottom-2 right-2 bg-accent text-accent-foreground font-bold py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="p-6 group">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold font-oswald tracking-wide text-white group-hover:text-accent transition-colors">{item.name}</h3>
                    <span className="text-accent font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-foreground/70">{item.description}</p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => setOrderModalOpen(true)} 
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                    >
                      Order This Item
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Show "no items found" message
            <div className="col-span-full text-center py-12">
              <p className="text-foreground/70 text-lg">No menu items found for this category.</p>
            </div>
          )}
        </div>
        
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">Ready to Order?</h3>
            <Button 
              onClick={() => setOrderModalOpen(true)}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-bold rounded-md shadow-lg animate-pulse-slow"
            >
              Order Now
            </Button>
            
            {/* Order modal */}
            <OrderModal 
              open={orderModalOpen}
              onOpenChange={setOrderModalOpen}
              locationId="delmar"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
