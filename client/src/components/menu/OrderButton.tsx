interface OrderButtonProps {
  isVisible: boolean;
  onOrderClick: () => void;
}

export default function OrderButton({ isVisible, onOrderClick }: OrderButtonProps) {
  return (
    <div className={`text-center mt-12 transform transition-all duration-1000 delay-1000 ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`}>
      <button 
        onClick={onOrderClick}
        className="inline-block px-8 py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-primary/80 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
        aria-label="Open order menu to place an order"
        type="button"
      >
        <i className="fas fa-shopping-cart mr-2" aria-hidden="true"></i>
        <span>Order Online</span>
      </button>
      {/* Provide static information about the ordering process for screen readers */}
      <div className="sr-only" aria-live="polite">
        Clicking the Order Online button will open a modal window where you can view your cart and complete your order.
      </div>
    </div>
  );
}