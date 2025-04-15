import { useState } from "react";
import type { MenuItem as MenuItemType } from "@shared/schema";
import OptimizedImage from "../OptimizedImage";

interface MenuItemProps {
  item: MenuItemType;
  addItemToCart: (item: MenuItemType) => void;
  isVisible: boolean;
  index: number;
}

export default function MenuItem({ item, addItemToCart, isVisible, index }: MenuItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Calculate staggered animation delay based on item index
  const animationDelay = 500 + (index * 100); // Base delay + staggered delay

  return (
    <div 
      className={`bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-1000 transform
        ${isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-20 opacity-0"
        }`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      {/* Image container with fixed height */}
      <div className="relative w-full h-48 md:h-52 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted animate-pulse"></div>
        )}
        
        {/* Fallback for image errors */}
        {imageError && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
            <i className="fas fa-utensils text-4xl text-muted-foreground"></i>
          </div>
        )}
        
        {/* Image with error handling */}
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error(`Error loading image: ${item.image}`);
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
          width={400}
          height={300}
        />
        
        {/* Price tag floating on image */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white py-1 px-3 rounded-md font-semibold shadow-md backdrop-blur-sm">
          ${item.price.toFixed(2)}
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 font-oswald">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">{item.description}</p>
        
        {/* "Add to Cart" button */}
        <button
          onClick={() => addItemToCart(item)}
          className="mt-auto w-full py-2 rounded-md bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
          aria-label={`Add ${item.name} to your cart`}
        >
          <i className="fas fa-plus-circle" aria-hidden="true"></i>
          <span>Add to Order</span>
        </button>
      </div>
    </div>
  );
}