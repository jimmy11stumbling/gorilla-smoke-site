// This file centralizes all image paths used throughout the application

// Logo
export const GORILLA_LOGO = '/images/logo/gorilla-logo.jpg';

// Restaurant images
export const RESTAURANT_EXTERIOR = '/images/restaurant-exterior.png';
export const RESTAURANT_INTERIOR_1 = '/images/restaurant/interior1.png';
export const RESTAURANT_INTERIOR_2 = '/images/restaurant/interior2.png';
export const RESTAURANT_INTERIOR_3 = '/images/restaurant/interior3.png';
export const RESTAURANT_INTERIOR_4 = '/images/restaurant/interior4.png';
export const RESTAURANT_INTERIOR_5 = '/images/restaurant/interior1.png';
export const RESTAURANT_INTERIOR_6 = '/images/restaurant/interior2.png';

// Chef and Team images
export const CHEF_RAMIRO = '/images/chef/chef-ramiro.png';
export const BBQ_TEAM = '/images/team/bbq-team.png';
export const CUSTOMERS = '/images/restaurant/customers.png';

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
  'BBQ_RIBS': '/images/menu/bbq-ribs.png',
  'SMOKED_BRISKET': '/images/menu/smoked-brisket.png',
  'PULLED_PORK': '/images/menu/foods/pulled-pork-sandwich.png',
  'GRILLED_WINGS': '/images/menu/fire-grilled-wings.png',
  'GRILLED_SALMON': '/images/menu/grilled-salmon.jpg',

  // Tacos
  'TACOS_PLATE': '/images/menu/foods/tacos-combo.png',
  'TACOS_COMBO': '/images/menu/foods/tacos-combo.png',
  'BRISKET_TACOS': '/images/menu/foods/brisket-tacos.png',
  'AVOCADO_TACOS': '/images/menu/foods/brisket-tacos.png',

  // Burgers and Sandwiches
  'SIGNATURE_SANDWICH': '/images/menu/foods/signature-sandwich.png',
  'BBQ_SANDWICH': '/images/menu/foods/pulled-pork-sandwich.png',
  'BURGER_FRIES': '/images/menu/foods/burger-fries.png',

  // Sides
  'ELOTE': '/images/menu/foods/elote.png',

  // Default category images
  'DEFAULT_APPETIZER': '/images/menu/foods/chicken-tenders.png',
  'DEFAULT_ENTREE': '/images/menu/smoked-brisket.png',
  'DEFAULT_DESSERT': '/images/menu/foods/elote.png',
  'DEFAULT_BEVERAGE': '/images/menu/defaults/default-beverage.jpg',
  'DEFAULT_SPECIAL': '/images/menu/bbq-ribs.png',
  'DEFAULT_ITEM': '/images/menu/smoked-brisket.png',
};

// BBQ specialties and masterclass images
export const BBQ_SPECIALTIES = '/images/bbq-specialties.png';
export const BBQ_MASTERCLASS = '/images/bbq-masterclass.png';

// Location images
export const RESTAURANT_EXTERIOR_ALT = '/images/restaurant-exterior.png';
export const RESTAURANT_INTERIOR_ALT = '/images/restaurant/customers.png';

// Get menu image by ID or name
export function getMenuImageById(id: number): string {
  // Map specific IDs to specific images
  const imageMap: Record<number, string> = {
    // Starters
    1: MENU_IMAGES.GRILLED_WINGS,
    2: MENU_IMAGES.ELOTE,

    // Burgers
    3: MENU_IMAGES.BURGER_FRIES,

    // Tacos
    4: MENU_IMAGES.TACOS_COMBO,
    5: MENU_IMAGES.AVOCADO_TACOS,
    6: MENU_IMAGES.TACOS_PLATE,
    7: MENU_IMAGES.BRISKET_TACOS,

    // Sandwiches
    8: MENU_IMAGES.BBQ_SANDWICH,
    9: MENU_IMAGES.PULLED_PORK,
    10: MENU_IMAGES.SIGNATURE_SANDWICH,

    // Grill
    11: MENU_IMAGES.BBQ_RIBS,

    // Featured items
    26: MENU_IMAGES.BRISKET_TACOS,
    27: MENU_IMAGES.SIGNATURE_SANDWICH,
    28: MENU_IMAGES.ELOTE
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
