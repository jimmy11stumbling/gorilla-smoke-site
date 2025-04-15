import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@shared/schema";
import OptimizedImage from "@/components/OptimizedImage";

export default function FeaturedItems() {
  // Fetch featured items from API
  const { 
    data: apiFeaturedItems, 
    isLoading, 
    isError, 
    error 
  } = useQuery<{ success: boolean, data: MenuItem[] }>({
    queryKey: ['/api/menu/featured'],
    retry: 3,
  });
  
  // For debugging
  useEffect(() => {
    console.log("Featured Items API response:", apiFeaturedItems);
    if (isError) {
      console.error("Featured Items loading error:", error);
    }
  }, [apiFeaturedItems, isError, error]);
  
  const featuredItems = apiFeaturedItems?.data || [];

  // Loading skeleton for featured items
  const FeaturedItemSkeleton = () => (
    <div className="bg-secondary rounded-lg shadow-lg overflow-hidden transition-all border border-border">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/5" />
        </div>
        <Skeleton className="h-4 w-full mt-2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-card" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 id="featured-heading" className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide">
            Popular <span className="text-primary">Picks</span>
          </h2>
          <p className="text-card-foreground/80 max-w-2xl mx-auto">
            Our most loved selections that keep our customers coming back for more
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Featured menu items">
          {isLoading ? (
            // Show skeletons while loading
            Array(3).fill(0).map((_, index) => (
              <FeaturedItemSkeleton key={index} />
            ))
          ) : featuredItems.length > 0 ? (
            // Show featured items
            featuredItems.map((item: MenuItem) => (
              <article 
                key={item.id} 
                className="group bg-secondary rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl border border-border"
                role="listitem"
                aria-labelledby={`featured-item-${item.id}`}
              >
                <div className="h-64 overflow-hidden">
                  <OptimizedImage 
                    src={item.image} 
                    alt={`${item.name} - Specialty dish at Gorilla Smoke & Grill`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    height={256}
                    width={480}
                    loading="lazy"
                    quality={85}
                    placeholderColor="#202020"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 id={`featured-item-${item.id}`} className="text-xl font-bold font-oswald tracking-wide text-white">{item.name}</h3>
                    <span className="text-accent font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  <button 
                    onClick={() => {
                      // Scroll to menu section and open order modal
                      const menuSection = document.getElementById('menu');
                      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition"
                    aria-label={`Order ${item.name} now`}
                  >
                    <span>Order Now</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            // Show message if no featured items are found
            <div className="col-span-full text-center py-8">
              <p className="text-foreground/70 text-lg">Check back soon for our featured dishes!</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => {
              const menuSection = document.getElementById('menu');
              if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-8 py-3 bg-accent text-accent-foreground font-oswald uppercase tracking-wider rounded-md hover:bg-accent/90 transition text-lg"
            aria-label="View our complete menu options"
          >
            <span>See Full Menu</span>
          </button>
        </div>
      </div>
    </section>
  );
}
