import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuCategory } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@shared/schema";
import OptimizedImage from "@/components/OptimizedImage";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Utensils } from "lucide-react";

interface MenuSectionProps {
  onOrderClick: () => void;
}

export default function MenuSection({ onOrderClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: "Menu",
      icon: <Utensils className="h-4 w-4" />,
    }
  ];

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
      // Add additional accessibility attributes
      className: "text-foreground",
      variant: "default"
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

  // Loading skeleton for menu items
  const MenuItemSkeleton = () => (
    <div 
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading menu item"
    >
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
    <section id="menu" className="py-16 bg-secondary" aria-labelledby="menu-heading">
      <div className="container mx-auto px-4">
        <header className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h2 id="menu-heading" className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide text-white">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Menu</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Savor our wide selection of house specialties, all made with fresh ingredients and cooked to perfection
          </p>
        </header>
        
        {/* Menu Categories Tabs */}
        <div className={`mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div 
            className="flex flex-wrap justify-center gap-4" 
            role="tablist" 
            aria-label="Menu categories"
          >
            {categories.map((category) => (
              <button 
                key={category.id}
                className={`flex items-center px-6 py-2 font-oswald uppercase tracking-wider rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
                  activeCategory === category.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "bg-card text-white hover:bg-primary/80 hover:scale-105"
                }`}
                onClick={() => setActiveCategory(category.id)}
                onKeyDown={(e) => {
                  // Handle left/right arrow keys for keyboard navigation between tabs
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentIndex = categories.findIndex(c => c.id === activeCategory);
                    const nextIndex = e.key === 'ArrowLeft' 
                      ? (currentIndex - 1 + categories.length) % categories.length
                      : (currentIndex + 1) % categories.length;
                    setActiveCategory(categories[nextIndex].id);
                  }
                }}
                aria-label={`Show ${category.label} menu items`}
                aria-pressed={activeCategory === category.id}
                role="tab"
                id={`tab-${category.id}`}
                aria-controls={`tabpanel-${category.id}`}
                aria-selected={activeCategory === category.id}
                tabIndex={activeCategory === category.id ? 0 : -1}
              >
                <i className={`fas ${category.icon} mr-2`} aria-hidden="true"></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          role="tabpanel" 
          aria-label={`${activeCategory === 'all' ? 'All menu' : activeCategory} items`}
          id={`tabpanel-${activeCategory}`}
          aria-busy={isLoading}
          aria-live="polite"
        >
          {isLoading ? (
            // Show skeletons while loading
            <>
              <div className="sr-only">Loading menu items. Please wait.</div>
              {Array(6).fill(0).map((_, index) => (
                <MenuItemSkeleton key={index} />
              ))}
            </>
          ) : filteredItems.length > 0 ? (
            // Show menu items
            filteredItems.map((item: MenuItem, index: number) => (
              <article 
                key={item.id} 
                className={`menu-item bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl hover:border-accent transition-all duration-300 transform ${
                  isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
                aria-labelledby={`menu-item-${item.id}`}
                tabIndex={0}
              >
                <div className="h-48 overflow-hidden group relative">
                  <OptimizedImage 
                    src={item.image} 
                    alt={`${item.name} - Gorilla Smoke & Grill specialty`}
                    className="w-full h-full object-cover group-hover:scale-110 group-focus-within:scale-110 transition-transform duration-500"
                    height={192}
                    width={400}
                    loading="lazy"
                    quality={80}
                    placeholderColor="#1a1a1a"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div 
                    className="absolute bottom-2 right-2 bg-accent text-accent-foreground font-bold py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 group-focus-within:translate-y-0 translate-y-4 text-sm"
                    aria-hidden="true"
                  >
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-6 group">
                  <div className="flex justify-between items-center mb-2">
                    <h3 id={`menu-item-${item.id}`} className="text-xl font-bold font-oswald tracking-wide text-white group-hover:text-accent group-focus-within:text-accent transition-colors">
                      {item.name}
                      <span className="sr-only"> - ${item.price.toFixed(2)}</span>
                    </h3>
                    <span className="text-accent font-semibold" aria-hidden="true">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-foreground/70">{item.description}</p>
                  <Button
                    className="w-full mt-4 py-2 bg-transparent border border-primary text-primary font-oswald uppercase tracking-wide rounded-md opacity-80 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    onClick={() => {
                      addItemToCart(item);
                    }}
                    aria-label={`Add ${item.name} to your order for $${item.price.toFixed(2)}`}
                  >
                    <span>Add to Order</span>
                  </Button>
                </div>
              </article>
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
          <button 
            onClick={onOrderClick}
            className="inline-block px-8 py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            aria-label="Open order menu to place an order"
            type="button"
          >
            <i className="fas fa-shopping-cart mr-2" aria-hidden="true"></i>
            <span>Order Online</span>
          </button>
          {/* Provide static information about the ordering process for screen readers */}
          <div className="sr-only" aria-live="polite">
            Clicking the Order Online button will open a modal window where you can view your cart and complete your order.
          </div>
        </div>
      </div>
    </section>
  );
}
