export type MenuCategory = "starters" | "burgers" | "grill" | "sides" | "drinks" | "sandwiches" | "tacos" | "salads";

export interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
  category: MenuCategory;
}

export const featuredItems = [
  {
    name: "BBQ Burger with Fries",
    price: 13.99,
    description: "Juicy beef patty with our signature BBQ sauce served with a side of seasoned fries.",
    image: "/menu-item-bbq-burger.png",
    category: "burgers"
  },
  {
    name: "Brisket Tacos",
    price: 14.99,
    description: "Premium smoked brisket in fresh corn tortillas with cilantro, onions, and lime.",
    image: "/menu-item-brisket-tacos.png",
    category: "tacos"
  },
  {
    name: "Signature Sandwich",
    price: 16.99,
    description: "Our famous signature sandwich loaded with premium pulled pork, brisket, and our special sauce.",
    image: "/menu-item-signature-sandwich.png",
    category: "sandwiches"
  },
  {
    name: "Gorilla Elote",
    price: 8.99,
    description: "Mexican street corn covered with melted cheese and our special spicy seasoning.",
    image: "/menu-item-elote.png",
    category: "sides"
  }
];

export const menuItems: MenuItem[] = [
  {
    name: "BBQ Burger with Fries",
    price: 13.99,
    description: "Juicy beef patty with our signature BBQ sauce served with a side of seasoned fries.",
    image: "/menu-item-bbq-burger.png",
    category: "burgers"
  },
  {
    name: "Brisket Tacos",
    price: 14.99,
    description: "Premium smoked brisket in fresh corn tortillas with cilantro, onions, and lime.",
    image: "/menu-item-brisket-tacos.png",
    category: "tacos"
  },
  {
    name: "Signature Sandwich",
    price: 16.99,
    description: "Our famous signature sandwich loaded with premium pulled pork, brisket, and our special sauce.",
    image: "/menu-item-signature-sandwich.png",
    category: "sandwiches"
  },
  {
    name: "Gorilla Elote",
    price: 8.99,
    description: "Mexican street corn covered with melted cheese and our special spicy seasoning.",
    image: "/menu-item-elote.png",
    category: "sides"
  },
  {
    name: "Chicken Tenders",
    price: 11.99,
    description: "Premium chicken tenders served with our homemade ranch and honey mustard sauces.",
    image: "/images/menu/foods/chicken-tenders.jpg",
    category: "starters"
  },
  {
    name: "Gorilla Tacos Combo",
    price: 15.99,
    description: "Four delicious tacos with pickled onions, jalapeño, and lime. Served on corn tortillas.",
    image: "/images/menu/foods/tacos-combo.jpg",
    category: "tacos"
  },
  {
    name: "Avocado Brisket Tacos",
    price: 16.99,
    description: "Premium smoked brisket tacos topped with fresh avocado and jalapeño.",
    image: "/images/menu/foods/brisket-tacos.jpg",
    category: "tacos"
  },
  {
    name: "BBQ Sandwich",
    price: 14.99,
    description: "Slow-smoked meat with our signature BBQ sauce on a fresh brioche bun with fries.",
    image: "/images/menu/foods/pulled-pork-sandwich.jpg",
    category: "sandwiches"
  },
  {
    name: "Pulled Pork Sandwich",
    price: 13.99,
    description: "Tender pulled pork with our housemade BBQ sauce on a brioche bun with fries.",
    image: "/images/menu/foods/pulled-pork-sandwich.jpg",
    category: "sandwiches"
  },
  {
    name: "Street Tacos Plate",
    price: 16.99,
    description: "Authentic street tacos with pickled onions, avocado, and jalapeño on corn tortillas.",
    image: "/images/menu/foods/tacos-combo.jpg",
    category: "tacos"
  },
  {
    name: "BBQ Combo Meal",
    price: 18.99,
    description: "Smoked meat combo served with fries and our signature garnish.",
    image: "/images/menu/bbq-ribs.jpg",
    category: "grill"
  },
  {
    name: "St. Louis Style Ribs",
    price: 24.99,
    description: "Full rack of tender, fall-off-the-bone pork ribs glazed with our signature sweet and smoky BBQ sauce.",
    image: "/images/menu/bbq-ribs.jpg",
    category: "grill"
  },
  {
    name: "Smoked Beef Brisket",
    price: 21.99,
    description: "Half-pound of our 14-hour slow-smoked beef brisket, sliced thin and served with pickles and onions.",
    image: "/images/menu/smoked-brisket.jpg",
    category: "grill"
  },
  {
    name: "Fire Grilled Wings",
    price: 12.99,
    description: "Jumbo wings tossed in your choice of Buffalo, BBQ, or Garlic Parmesan sauce. Served with celery and blue cheese.",
    image: "/images/menu/fire-grilled-wings.jpg",
    category: "starters"
  },
  {
    name: "Loaded BBQ Nachos",
    price: 14.49,
    description: "Crispy tortilla chips topped with melted cheese, black beans, jalapeños, sour cream, and your choice of pulled pork or brisket.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "starters"
  }
];
