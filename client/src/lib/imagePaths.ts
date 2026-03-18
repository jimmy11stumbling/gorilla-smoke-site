// This file centralizes all image paths used throughout the application

// Logo
export const GORILLA_LOGO = '/images/logo/gorilla-logo.jpg';

// Restaurant images
export const RESTAURANT_EXTERIOR   = '/images/restaurant-exterior.jpg';
export const RESTAURANT_INTERIOR_1 = '/images/restaurant/interior1.jpg';
export const RESTAURANT_INTERIOR_2 = '/images/restaurant/interior2.jpg';
export const RESTAURANT_INTERIOR_3 = '/images/restaurant/interior3.jpg';
export const RESTAURANT_INTERIOR_4 = '/images/restaurant/interior4.jpg';

// Chef image
export const CHEF_RAMIRO = '/images/chef/chef-ramiro.png';

// Menu item images by category
export const MENU_IMAGES = {
  // BBQ Items
  'BBQ_RIBS':        '/images/menu/bbq-ribs.jpg',
  'SMOKED_BRISKET':  '/images/menu/smoked-brisket.jpg',
  'PULLED_PORK':     '/images/menu/foods/pulled-pork-sandwich.jpg',
  'GRILLED_WINGS':   '/images/menu/fire-grilled-wings.jpg',
  'GRILLED_SALMON':  '/images/menu/grilled-salmon.jpg',

  // Tacos
  'TACOS_PLATE':    '/images/menu/foods/tacos-combo.jpg',
  'TACOS_COMBO':    '/images/menu/foods/tacos-combo.jpg',
  'BRISKET_TACOS':  '/images/menu/foods/brisket-tacos.jpg',
  'AVOCADO_TACOS':  '/images/menu/foods/brisket-tacos.jpg',

  // Burgers and Sandwiches
  'SIGNATURE_SANDWICH': '/images/menu/foods/signature-sandwich.jpg',
  'BBQ_SANDWICH':       '/images/menu/foods/pulled-pork-sandwich.jpg',
  'BURGER_FRIES':       '/images/menu/foods/burger-fries.jpg',

  // Starters / Sides
  'ELOTE':              '/images/menu/foods/elote.jpg',
  'CHICKEN_TENDERS':    '/images/menu/foods/chicken-tenders.jpg',
  'LOADED_NACHOS':      'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Default fallbacks per category
  'DEFAULT_APPETIZER': '/images/menu/foods/chicken-tenders.jpg',
  'DEFAULT_ENTREE':    '/images/menu/smoked-brisket.jpg',
  'DEFAULT_DESSERT':   '/images/menu/defaults/default-dessert.jpg',
  'DEFAULT_BEVERAGE':  '/images/menu/defaults/default-beverage.jpg',
  'DEFAULT_SPECIAL':   '/images/menu/bbq-ribs.jpg',
  'DEFAULT_ITEM':      '/images/menu/smoked-brisket.jpg',
};

// BBQ specialties and masterclass images
export const BBQ_SPECIALTIES = '/images/bbq-specialties.jpg';
export const BBQ_MASTERCLASS = '/images/bbq-masterclass.jpg';

// Get menu image by item ID
export function getMenuImageById(id: number): string {
  const imageMap: Record<number, string> = {
    1:  MENU_IMAGES.GRILLED_WINGS,
    2:  MENU_IMAGES.ELOTE,
    3:  MENU_IMAGES.BURGER_FRIES,
    4:  MENU_IMAGES.TACOS_COMBO,
    5:  MENU_IMAGES.AVOCADO_TACOS,
    6:  MENU_IMAGES.TACOS_PLATE,
    7:  MENU_IMAGES.BRISKET_TACOS,
    8:  MENU_IMAGES.BBQ_SANDWICH,
    9:  MENU_IMAGES.PULLED_PORK,
    10: MENU_IMAGES.SIGNATURE_SANDWICH,
    11: MENU_IMAGES.BBQ_RIBS,
    26: MENU_IMAGES.BRISKET_TACOS,
    27: MENU_IMAGES.SIGNATURE_SANDWICH,
    28: MENU_IMAGES.ELOTE,
  };
  return imageMap[id] || MENU_IMAGES.DEFAULT_ITEM;
}

// Get default image for a menu category
export function getDefaultImageForCategory(category?: string): string {
  if (!category) return MENU_IMAGES.DEFAULT_ITEM;
  const cat = category.toLowerCase();
  if (cat.includes('appetizer') || cat.includes('starter')) return MENU_IMAGES.DEFAULT_APPETIZER;
  if (cat.includes('entree')    || cat.includes('main'))    return MENU_IMAGES.DEFAULT_ENTREE;
  if (cat.includes('burger'))                               return MENU_IMAGES.BURGER_FRIES;
  if (cat.includes('taco'))                                 return MENU_IMAGES.BRISKET_TACOS;
  if (cat.includes('sandwich'))                             return MENU_IMAGES.SIGNATURE_SANDWICH;
  if (cat.includes('grill'))                                return MENU_IMAGES.BBQ_RIBS;
  if (cat.includes('dessert'))                              return MENU_IMAGES.DEFAULT_DESSERT;
  if (cat.includes('drink') || cat.includes('beverage'))   return MENU_IMAGES.DEFAULT_BEVERAGE;
  if (cat.includes('special'))                              return MENU_IMAGES.DEFAULT_SPECIAL;
  if (cat.includes('side'))                                 return MENU_IMAGES.ELOTE;
  if (cat.includes('nacho'))                                return MENU_IMAGES.LOADED_NACHOS;
  return MENU_IMAGES.DEFAULT_ITEM;
}
