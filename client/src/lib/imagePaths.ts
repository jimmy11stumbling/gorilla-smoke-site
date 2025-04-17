// This file centralizes all image paths used throughout the application

// Logo
export const GORILLA_LOGO = '/images/location/storefront.jpg';

// Restaurant images
export const RESTAURANT_EXTERIOR = '/images/location/storefront.jpg';
export const RESTAURANT_INTERIOR_1 = '/images/restaurant/customers.jpg';
export const RESTAURANT_INTERIOR_2 = '/images/restaurant/customers.jpg';
export const RESTAURANT_INTERIOR_3 = '/images/restaurant/customers.jpg';
export const RESTAURANT_INTERIOR_4 = '/images/restaurant/customers.jpg';
export const RESTAURANT_INTERIOR_5 = '/images/restaurant/customers.jpg';
export const RESTAURANT_INTERIOR_6 = '/images/restaurant/customers.jpg';

// Chef and Team images
export const CHEF_RAMIRO = '/images/chef/chef-ramiro.jpg';
export const BBQ_TEAM = '/images/team/bbq-team.jpg';
export const CUSTOMERS = '/images/restaurant/customers.jpg';

// Special dishes
export const SPECIAL_DISH_1 = '/images/menu/foods/chicken-tenders.jpg';
export const SPECIAL_DISH_2 = '/images/menu/foods/elote.jpg';
export const SPECIAL_DISH_3 = '/images/menu/foods/burger-fries.jpg';
export const SPECIAL_DISH_4 = '/images/menu/foods/signature-sandwich.jpg';
export const SPECIAL_DISH_5 = '/images/menu/foods/pulled-pork-sandwich.jpg';
export const SPECIAL_DISH_6 = '/images/menu/foods/tacos-combo.jpg';
export const SPECIAL_DISH_7 = '/images/menu/foods/avocado-tacos.jpg';
export const SPECIAL_DISH_8 = '/images/menu/foods/brisket-tacos.jpg';

// Menu item images by category
export const MENU_IMAGES = {
  // BBQ Items
  'BBQ_RIBS': '/images/menu/foods/combo-meal.jpg',
  'SMOKED_BRISKET': '/images/menu/foods/brisket-tacos.jpg',
  'PULLED_PORK': '/images/menu/foods/pulled-pork-sandwich.jpg',
  'GRILLED_WINGS': '/images/menu/foods/chicken-tenders.jpg',
  'GRILLED_SALMON': '/images/menu/foods/menu-item1.jpg',
  
  // Tacos
  'TACOS_PLATE': '/images/menu/foods/tacos-plate.jpg',
  'TACOS_COMBO': '/images/menu/foods/tacos-combo.jpg',
  'BRISKET_TACOS': '/images/menu/foods/brisket-tacos.jpg',
  'AVOCADO_TACOS': '/images/menu/foods/avocado-tacos.jpg',
  
  // Burgers and Sandwiches
  'SIGNATURE_SANDWICH': '/images/menu/foods/signature-sandwich.jpg',
  'BBQ_SANDWICH': '/images/menu/foods/bbq-sandwich.jpg',
  'BURGER_FRIES': '/images/menu/foods/burger-fries.jpg',
  
  // Sides
  'ELOTE': '/images/menu/foods/elote.jpg',
  
  // Default category images
  'DEFAULT_APPETIZER': '/images/menu/foods/chicken-tenders.jpg',
  'DEFAULT_ENTREE': '/images/menu/foods/signature-sandwich.jpg',
  'DEFAULT_DESSERT': '/images/menu/foods/elote.jpg',
  'DEFAULT_BEVERAGE': '/images/menu/foods/elote.jpg',
  'DEFAULT_SPECIAL': '/images/menu/foods/signature-sandwich.jpg',
  'DEFAULT_ITEM': '/images/menu/foods/burger-fries.jpg',
};

// BBQ specialties and masterclass images
export const BBQ_SPECIALTIES = '/images/menu/foods/combo-meal.jpg';
export const BBQ_MASTERCLASS = '/images/chef/chef-ramiro.jpg';

// Location images
export const RESTAURANT_EXTERIOR_ALT = '/images/location/storefront.jpg';
export const RESTAURANT_INTERIOR_ALT = '/images/restaurant/customers.jpg';

// Get menu image by ID or name
export function getMenuImageById(id: number): string {
  // Map specific IDs to specific images
  const imageMap: Record<number, string> = {
    // Starters
    1: MENU_IMAGES.GRILLED_WINGS,      // Chicken Tenders
    2: MENU_IMAGES.ELOTE,              // Elote
    
    // Burgers
    3: MENU_IMAGES.BURGER_FRIES,       // BBQ Burger with Fries
    
    // Tacos
    4: MENU_IMAGES.TACOS_COMBO,        // Gorilla Tacos Combo
    5: MENU_IMAGES.AVOCADO_TACOS,      // Avocado Brisket Tacos
    6: MENU_IMAGES.TACOS_PLATE,        // Street Tacos Plate
    7: MENU_IMAGES.BRISKET_TACOS,      // Brisket Tacos
    
    // Sandwiches
    8: MENU_IMAGES.BBQ_SANDWICH,       // BBQ Sandwich
    9: MENU_IMAGES.PULLED_PORK,        // Pulled Pork Sandwich
    10: MENU_IMAGES.SIGNATURE_SANDWICH, // Signature Sandwich
    
    // Grill
    11: MENU_IMAGES.BBQ_RIBS,          // BBQ Combo Meal
    
    // Featured items
    26: MENU_IMAGES.BRISKET_TACOS,     // Brisket Tacos
    27: MENU_IMAGES.SIGNATURE_SANDWICH, // Signature Sandwich
    28: MENU_IMAGES.ELOTE              // Gorilla Elote
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
  if (normalizedCategory.includes('burger')) {
    return MENU_IMAGES.BURGER_FRIES;
  }
  if (normalizedCategory.includes('taco')) {
    return MENU_IMAGES.BRISKET_TACOS;
  }
  if (normalizedCategory.includes('sandwich')) {
    return MENU_IMAGES.SIGNATURE_SANDWICH;
  }
  if (normalizedCategory.includes('grill')) {
    return MENU_IMAGES.BBQ_RIBS;
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
  if (normalizedCategory.includes('side')) {
    return MENU_IMAGES.ELOTE;
  }
  
  return MENU_IMAGES.DEFAULT_ITEM;
}