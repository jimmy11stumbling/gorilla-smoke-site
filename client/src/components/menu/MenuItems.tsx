import MenuItem from "./MenuItem";
import MenuItemSkeleton from "./MenuItemSkeleton";
import type { MenuItem as MenuItemType } from "@shared/schema";
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
  return (
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
        filteredItems.map((item: MenuItemType, index: number) => (
          <MenuItem
            key={item.id}
            item={item}
            isVisible={isVisible}
            index={index}
            addItemToCart={addItemToCart}
          />
        ))
      ) : (
        // Show "no items found" message
        <div className="col-span-full text-center py-12">
          <p className="text-foreground/70 text-lg">No menu items found for this category.</p>
        </div>
      )}
    </div>
  );
}