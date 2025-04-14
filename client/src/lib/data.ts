export type MenuCategory = "starters" | "burgers" | "grill" | "sides" | "drinks";

export interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
  category: MenuCategory;
}

export const featuredItems = [
  {
    name: "Gorilla Signature Burger",
    price: 14.99,
    description: "Our famous half-pound Angus beef patty with aged cheddar, caramelized onions, fresh lettuce, tomato, and our secret sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80"
  },
  {
    name: "Smokehouse BBQ Ribs",
    price: 19.99,
    description: "Fall-off-the-bone ribs slow-cooked for 8 hours and glazed with our house-made smoky BBQ sauce. Served with coleslaw and fries.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80"
  },
  {
    name: "Gorilla Loaded Nachos",
    price: 12.99,
    description: "Crispy tortilla chips loaded with seasoned ground beef, melted cheese, jalapeños, guacamole, sour cream, and pico de gallo.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80"
  }
];

export const menuItems: MenuItem[] = [
  {
    name: "Gorilla Loaded Fries",
    price: 9.99,
    description: "Crispy fries topped with melted cheese, bacon, jalapeños, and our special sauce.",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "starters"
  },
  {
    name: "Fire Grilled Wings",
    price: 12.99,
    description: "Eight wings grilled to perfection, available in Buffalo, BBQ, or our signature Gorilla sauce.",
    image: "https://images.unsplash.com/photo-1601056641500-339d365155c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "starters"
  },
  {
    name: "Classic Gorilla Burger",
    price: 13.99,
    description: "Half-pound Angus beef patty with lettuce, tomato, onion, and our signature sauce on a brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "burgers"
  },
  {
    name: "BBQ Bacon Burger",
    price: 15.99,
    description: "Angus beef with crispy bacon, cheddar, onion rings, and our house BBQ sauce.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "burgers"
  },
  {
    name: "Texas Style Ribs",
    price: 22.99,
    description: "Slow-cooked St. Louis ribs with our signature dry rub, served with fries and coleslaw.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "grill"
  },
  {
    name: "Ribeye Steak",
    price: 28.99,
    description: "12oz hand-cut ribeye, seasoned and grilled to your preference, served with two sides.",
    image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "grill"
  },
  {
    name: "Seasoned Fries",
    price: 4.99,
    description: "Crispy skin-on fries tossed in our special house seasoning.",
    image: "https://images.unsplash.com/photo-1623238914605-100dec4d2039?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "sides"
  },
  {
    name: "Gorilla Margarita",
    price: 8.99,
    description: "Our signature margarita with premium tequila, fresh lime juice, and a spicy rim.",
    image: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400&q=80",
    category: "drinks"
  }
];
