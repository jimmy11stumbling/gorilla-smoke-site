// This file centralizes all image paths used throughout the application

// Logo
export const GORILLA_LOGO = '/images/logo/gorilla-logo.jpg';

// Restaurant images
export const RESTAURANT_EXTERIOR = '/images/location/storefront.jpg';
export const RESTAURANT_INTERIOR_1 = '/images/restaurant/interior1.jpg';
export const RESTAURANT_INTERIOR_2 = '/images/restaurant/interior2.jpg';
export const RESTAURANT_INTERIOR_3 = '/images/restaurant/interior3.jpg';
export const RESTAURANT_INTERIOR_4 = '/images/restaurant/interior4.jpg';
export const RESTAURANT_INTERIOR_5 = '/images/restaurant/interior5.jpg';
export const RESTAURANT_INTERIOR_6 = '/images/restaurant/interior6.jpg';

// Chef and Team images
export const CHEF_RAMIRO = '/images/chef/chef-ramiro.jpg';
export const BBQ_TEAM = '/images/team/bbq-team.jpg';
export const CUSTOMERS = '/images/restaurant/customers.jpg';

// Special dishes
export const SPECIAL_DISH_1 = '/images/menu/special-dish1.jpg';
export const SPECIAL_DISH_2 = '/images/menu/special-dish2.jpg';
export const SPECIAL_DISH_3 = '/images/menu/special-dish3.jpg';
export const SPECIAL_DISH_4 = '/images/menu/special-dish4.jpg';
export const SPECIAL_DISH_5 = '/images/menu/special-dish5.jpg';
export const SPECIAL_DISH_6 = '/images/menu/special-dish6.jpg';
export const SPECIAL_DISH_7 = '/images/menu/special-dish7.jpg';
export const SPECIAL_DISH_8 = '/images/menu/special-dish8.jpg';

// Menu item images by category
export const MENU_IMAGES = {
  // BBQ Items
  'BBQ_RIBS': '/images/menu/bbq-ribs.jpg',
  'SMOKED_BRISKET': '/images/menu/smoked-brisket.jpg',
  'PULLED_PORK': '/images/menu/pulled-pork-sandwich.jpg',
  'GRILLED_WINGS': '/images/menu/fire-grilled-wings.jpg',
  'GRILLED_SALMON': '/images/menu/grilled-salmon.jpg',
  
  // Default category images
  'DEFAULT_APPETIZER': '/images/menu/defaults/default-appetizer.jpg',
  'DEFAULT_ENTREE': '/images/menu/defaults/default-entree.jpg',
  'DEFAULT_DESSERT': '/images/menu/defaults/default-dessert.jpg',
  'DEFAULT_BEVERAGE': '/images/menu/defaults/default-beverage.jpg',
  'DEFAULT_SPECIAL': '/images/menu/defaults/default-special.jpg',
  'DEFAULT_ITEM': '/images/menu/defaults/default-item.jpg',
};

// BBQ specialties and masterclass images
export const BBQ_SPECIALTIES = '/images/bbq-specialties.jpg';
export const BBQ_MASTERCLASS = '/images/bbq-masterclass.jpg';

// Location images
export const RESTAURANT_EXTERIOR_ALT = '/images/restaurant-exterior.jpg';
export const RESTAURANT_INTERIOR_ALT = '/images/restaurant-interior.jpg';

// Get menu image by ID or name
export function getMenuImageById(id: number): string {
  // Map specific IDs to specific images
  const imageMap: Record<number, string> = {
    1: MENU_IMAGES.GRILLED_WINGS,  // Buffalo Fire Wings
    2: SPECIAL_DISH_1,             // Jalapeño Poppers
    3: SPECIAL_DISH_2,             // Nachos Grande
    4: SPECIAL_DISH_3,             // Loaded Potato Skins
    5: SPECIAL_DISH_4,             // Beef Brisket Sandwich
    6: MENU_IMAGES.PULLED_PORK,    // Pulled Pork Sandwich
    7: SPECIAL_DISH_5,             // Cuban Sandwich
    8: SPECIAL_DISH_6,             // Classic Burger
    9: SPECIAL_DISH_7,             // BBQ Bacon Burger
    10: SPECIAL_DISH_8,            // Mushroom Swiss Burger
    // Add more as needed
    26: MENU_IMAGES.BBQ_RIBS,      // BBQ Ribs
    27: MENU_IMAGES.SMOKED_BRISKET, // Smoked Brisket
    28: MENU_IMAGES.GRILLED_SALMON // Grilled Salmon
  };
  
  return imageMap[id] || MENU_IMAGES.DEFAULT_ITEM;
}

// Get default image for category
export function getDefaultImageForCategory(category?: string): string {
  if (!category) return MENU_IMAGES.DEFAULT_ITEM;
  
  const normalizedCategory = category.toLowerCase();
  
  if (normalizedCategory.includes('appetizer') || normalizedCategory.includes('starter')) {
    return MENU_IMAGES.DEFAULT_APPETIZER;
  }
  if (normalizedCategory.includes('entree') || normalizedCategory.includes('main')) {
    return MENU_IMAGES.DEFAULT_ENTREE;
  }
  if (normalizedCategory.includes('dessert')) {
    return MENU_IMAGES.DEFAULT_DESSERT;
  }
  if (normalizedCategory.includes('drink') || normalizedCategory.includes('beverage')) {
    return MENU_IMAGES.DEFAULT_BEVERAGE;
  }
  if (normalizedCategory.includes('special')) {
    return MENU_IMAGES.DEFAULT_SPECIAL;
  }
  
  return MENU_IMAGES.DEFAULT_ITEM;
}