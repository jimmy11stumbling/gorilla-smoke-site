import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

interface CartViewProps {
  onNextStep: () => void;
  onClose: () => void;
}

export function CartView({ onNextStep, onClose }: CartViewProps) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-white">Your Order</h4>
        <p className="text-foreground/70 text-sm">Review your items before checkout</p>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-lg">
          <i className="fas fa-shopping-cart text-4xl text-foreground/30 mb-3"></i>
          <p className="text-foreground/50">Your cart is empty</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => onClose()}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="bg-card rounded-md divide-y divide-border">
              {items.map((item) => (
                <div key={item.menuItem.id} className="p-4 flex items-center">
                  <div className="w-14 h-14 rounded overflow-hidden mr-4">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-white">{item.menuItem.name}</h5>
                    <p className="text-sm text-foreground/70">${item.menuItem.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </Button>
                    <span className="w-8 text-center text-white">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => removeItem(item.menuItem.id)}
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-card rounded-md p-4 space-y-2">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button 
                onClick={onNextStep}
                className="bg-primary hover:bg-primary/80"
                disabled={items.length === 0}
              >
                Continue to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}