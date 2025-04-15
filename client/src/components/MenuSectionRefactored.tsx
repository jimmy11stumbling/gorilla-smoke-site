import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuCategory } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@shared/schema";
import {
  MenuHeader,
  MenuCategories,
  MenuItems,
  OrderButton
} from "./menu";

interface MenuSectionProps {
  onOrderClick: () => void;
}

export default function MenuSection({ onOrderClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch all menu items
  const { 
    data: apiMenuItems, 
    isLoading, 
    isError,
    error
  } = useQuery<{ success: boolean, data: MenuItem[] }>({
    queryKey: ['/api/menu'],
    retry: 3
  });
  
  // For debugging
  useEffect(() => {
    console.log("Menu API response:", apiMenuItems);
    if (isError) {
      console.error("Menu loading error:", error);
    }
  }, [apiMenuItems, isError, error]);
  
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
  
  // Function to add an item to the cart
  const addItemToCart = (item: MenuItem) => {
    addItem(item);
    // Show visual toast notification
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order.`,
      // Add additional styling
      className: "bg-card/90 border-primary/50"
    });
    
    // Announce to screen readers using aria-live
    const liveRegion = document.getElementById('cart-announcer');
    if (liveRegion) {
      liveRegion.textContent = `${item.name} - $${item.price.toFixed(2)} has been added to your cart.`;
    }
  };

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

  const categories: { id: MenuCategory | "all", label: string, icon: string }[] = [
    { id: "all", label: "All", icon: "fa-utensils" },
    { id: "starters", label: "Starters", icon: "fa-cheese" },
    { id: "burgers", label: "Burgers", icon: "fa-hamburger" },
    { id: "grill", label: "From The Grill", icon: "fa-fire" },
    { id: "sides", label: "Sides", icon: "fa-bacon" },
    { id: "drinks", label: "Drinks", icon: "fa-glass-martini-alt" }
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter((item: MenuItem) => item.category === activeCategory);

  return (
    <section id="menu" className="py-16 bg-secondary" aria-labelledby="menu-heading">
      <div className="container mx-auto px-4">
        {/* Menu Header */}
        <MenuHeader isVisible={isVisible} />
        
        {/* Menu Categories Tabs */}
        <MenuCategories
          categories={categories}
          activeCategory={activeCategory}
          isVisible={isVisible}
          setActiveCategory={setActiveCategory}
        />
        
        {/* Menu Items Grid */}
        <MenuItems
          isLoading={isLoading}
          isVisible={isVisible}
          activeCategory={activeCategory}
          filteredItems={filteredItems}
          addItemToCart={addItemToCart}
        />
        
        {/* Order Button */}
        <OrderButton
          isVisible={isVisible}
          onOrderClick={onOrderClick}
        />
      </div>
    </section>
  );
}