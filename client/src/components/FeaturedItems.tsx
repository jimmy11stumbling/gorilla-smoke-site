import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@shared/schema";

export default function FeaturedItems() {
  // Fetch featured items from API
  const { data: apiFeaturedItems, isLoading } = useQuery<{ success: boolean, data: MenuItem[] }>({
    queryKey: ['/api/menu/featured'],
    retry: 3,
  });
  
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
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide">
            Popular <span className="text-primary">Picks</span>
          </h2>
          <p className="text-card-foreground/80 max-w-2xl mx-auto">
            Our most loved selections that keep our customers coming back for more
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array(3).fill(0).map((_, index) => (
              <FeaturedItemSkeleton key={index} />
            ))
          ) : featuredItems.length > 0 ? (
            // Show featured items
            featuredItems.map((item: MenuItem) => (
              <div 
                key={item.id} 
                className="group bg-secondary rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl border border-border"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=480&q=80";
                      e.currentTarget.onerror = null; // Prevent infinite fallback loop
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold font-oswald tracking-wide text-white">{item.name}</h3>
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
                  >
                    Order Now
                  </button>
                </div>
              </div>
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
          >
            See Full Menu
          </button>
        </div>
      </div>
    </section>
  );
}
