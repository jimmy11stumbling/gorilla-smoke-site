import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem } from '@shared/schema';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    try {
      if (items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(items));
      } else {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      // Continue execution even if localStorage fails
    }

    // Calculate totals
    let totalPrice = 0;
    let totalItems = 0;

    items.forEach(item => {
      totalPrice += item.menuItem.price * item.quantity;
      totalItems += item.quantity;
    });

    setTotal(totalPrice);
    setItemCount(totalItems);
  }, [items]);

  const addItem = (menuItem: MenuItem) => {
    setItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.menuItem.id === menuItem.id);
      
      if (existingItemIndex >= 0) {
        // Item exists in cart, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Item doesn't exist in cart, add it
        return [...prevItems, { menuItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.menuItem.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItem.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};