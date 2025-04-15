import { Button } from "@/components/ui/button";
import type { MenuItem as MenuItemType } from "@shared/schema";
import OptimizedImage from "@/components/OptimizedImage";

interface MenuItemProps {
  item: MenuItemType;
  isVisible: boolean;
  index: number;
  addItemToCart: (item: MenuItemType) => void;
}

export default function MenuItem({ item, isVisible, index, addItemToCart }: MenuItemProps) {
  return (
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
  );
}