import { featuredItems } from "@/lib/data";

export default function FeaturedItems() {
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
          {featuredItems.map((item, index) => (
            <div key={index} className="group bg-secondary rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl border border-border">
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold font-oswald tracking-wide text-white">{item.name}</h3>
                  <span className="text-accent font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <button className="w-full py-2 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition">
                  Add to Order
                </button>
              </div>
            </div>
          ))}
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
