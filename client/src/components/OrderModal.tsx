interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
      onClick={handleBackgroundClick}
    >
      <div className="bg-secondary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 border border-border shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-oswald tracking-wide text-white">
            Order <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Online</span>
          </h3>
          <button onClick={onClose} className="text-2xl text-foreground/80 hover:text-accent">&times;</button>
        </div>
        
        <div className="text-center py-10">
          <i className="fas fa-utensils text-5xl text-primary mb-4"></i>
          <h4 className="text-xl font-bold mb-2 text-white">Start Your Order</h4>
          <p className="mb-6 text-foreground/70">Choose your preferred ordering method</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
            <a 
              href="https://www.doordash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 border border-border rounded-lg bg-card hover:border-accent hover:shadow-md transition-all"
            >
              <i className="fas fa-truck text-3xl text-primary mb-3"></i>
              <span className="font-bold text-white">Delivery</span>
              <span className="text-sm text-foreground/70 mt-1">Delivered to your door</span>
            </a>
            
            <a 
              href="tel:+19565681450"
              className="flex flex-col items-center p-6 border border-border rounded-lg bg-card hover:border-accent hover:shadow-md transition-all"
            >
              <i className="fas fa-shopping-bag text-3xl text-primary mb-3"></i>
              <span className="font-bold text-white">Pickup</span>
              <span className="text-sm text-foreground/70 mt-1">Ready when you arrive</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
