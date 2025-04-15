import logoImage from "../../assets/gorilla-logo.jpg";

interface HeroContentProps {
  isVisible: boolean;
  onOrderClick: () => void;
}

export default function HeroContent({ isVisible, onOrderClick }: HeroContentProps) {
  return (
    <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20 text-center">
      {/* Logo image with animation */}
      <div 
        className={`mb-6 transform transition-all duration-1000 ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-xl animate-pulse opacity-70"></div>
          <img 
            src={logoImage} 
            alt="Gorilla Bar & Grill Logo" 
            className="h-full w-full object-contain relative z-10 drop-shadow-xl animate-float"
          />
        </div>
      </div>
      
      {/* Hero heading with animation */}
      <h1 
        className={`text-5xl md:text-7xl font-bold font-oswald text-white uppercase mb-4 tracking-wider drop-shadow-xl transform transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <span className="inline-block relative overflow-hidden">
          <span className="relative z-10">Gorilla</span>
          <span className="absolute bottom-2 left-0 w-full h-[6px] bg-gradient-to-r from-primary/50 to-primary/20 transform translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></span>
        </span>{" "}
        <span className="inline-block relative z-10 mx-1 px-1 animate-pulse-slow">
          <span className="text-accent">&</span>
        </span>{" "}
        <span className="inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_auto]">Grill</span>
        </span>
      </h1>
      
      {/* Hero tagline with animation */}
      <p 
        className={`text-xl md:text-2xl text-white/90 mb-10 max-w-2xl drop-shadow-xl transform transition-all duration-1000 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <span className="text-accent font-semibold">Unleash your appetite</span> with our flame-grilled perfection and premium bar selections.
      </p>
      
      {/* Call to action buttons with animation */}
      <div 
        className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button 
          onClick={() => {
            const menuSection = document.getElementById('menu');
            if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative px-8 py-3 font-oswald uppercase tracking-wider rounded-md shadow-lg overflow-hidden group text-lg min-w-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="View our menu"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 opacity-90 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
          <span className="absolute inset-[-2px] bg-gradient-to-r from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105"></span>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"></span>
          <span className="relative text-white font-bold tracking-widest flex items-center justify-center gap-2 z-10">
            <i className="fas fa-utensils text-sm" aria-hidden="true"></i>
            View Menu
          </span>
        </button>
        <button 
          onClick={onOrderClick} 
          className="relative px-8 py-3 font-oswald uppercase tracking-wider rounded-md shadow-lg overflow-hidden group text-lg min-w-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Order food online"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/90 opacity-90 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
          <span className="absolute inset-[-2px] bg-gradient-to-r from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105"></span>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"></span>
          <span className="relative text-white font-bold tracking-widest flex items-center justify-center gap-2 z-10">
            <i className="fas fa-shopping-cart text-sm" aria-hidden="true"></i>
            Order Online
          </span>
        </button>
      </div>
    </div>
  );
}