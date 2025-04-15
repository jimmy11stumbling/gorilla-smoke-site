import { MenuItem as MenuItemType } from "@shared/schema";
import MenuItem from "./MenuItem";
import MenuItemSkeleton from "./MenuItemSkeleton";
import { MenuCategory } from "@/lib/data";

interface MenuItemsProps {
  isLoading: boolean;
  isVisible: boolean;
  activeCategory: MenuCategory | "all";
  filteredItems: MenuItemType[];
  addItemToCart: (item: MenuItemType) => void;
}

export default function MenuItems({
  isLoading,
  isVisible,
  activeCategory,
  filteredItems,
  addItemToCart
}: MenuItemsProps) {
  // Create array for loading skeletons
  const loadingSkeletons = Array(6).fill(0);

  return (
    <div 
      role="region" 
      aria-label={activeCategory === "all" ? "All menu items" : `${activeCategory} menu items`}
      className="mb-12"
    >
      {/* Empty state handling */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-8 bg-card/50 rounded-lg">
          <i className="fas fa-utensils text-4xl text-muted-foreground mb-4"></i>
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            No menu items are available in this category.
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingSkeletons.map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
      )}
      
      {/* Menu grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: MenuItemType, index: number) => (
            <MenuItem
              key={item.id}
              item={item}
              addItemToCart={addItemToCart}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      )}
      
      {/* Screen reader announcements for filtered items */}
      <div className="sr-only" aria-live="polite">
        {!isLoading && filteredItems.length > 0 && (
          `Showing ${filteredItems.length} items in the ${activeCategory === "all" ? "all categories" : activeCategory} category.`
        )}
      </div>
    </div>
  );
}