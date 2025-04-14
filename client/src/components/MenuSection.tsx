import { useState } from "react";
import { menuItems, MenuCategory } from "@/lib/data";

interface MenuSectionProps {
  onOrderClick: () => void;
}

export default function MenuSection({ onOrderClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");

  const categories: { id: MenuCategory | "all", label: string }[] = [
    { id: "all", label: "All" },
    { id: "starters", label: "Starters" },
    { id: "burgers", label: "Burgers" },
    { id: "grill", label: "From The Grill" },
    { id: "sides", label: "Sides" },
    { id: "drinks", label: "Drinks" }
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide text-white">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Menu</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Savor our wide selection of house specialties, all made with fresh ingredients and cooked to perfection
          </p>
        </div>
        
        {/* Menu Categories Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`px-6 py-2 font-oswald uppercase tracking-wider rounded-md ${
                  activeCategory === category.id 
                    ? "bg-primary text-white" 
                    : "bg-card text-white hover:bg-primary/80 transition"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div 
              key={index} 
              className="menu-item bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold font-oswald tracking-wide text-white">{item.name}</h3>
                  <span className="text-accent font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={onOrderClick}
            className="inline-block px-8 py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition text-lg shadow-lg"
          >
            Order Online
          </button>
        </div>
      </div>
    </section>
  );
}
