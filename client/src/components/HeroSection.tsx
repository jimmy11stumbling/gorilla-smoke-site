interface HeroSectionProps {
  onOrderClick: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative h-[85vh] bg-secondary overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80" 
          alt="Grilled food" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-oswald text-white uppercase mb-4 tracking-wider">
          Gorilla Bar <span className="text-accent">&</span> Grill
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
          Unleash your appetite with our flame-grilled perfection and premium bar selections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => {
              const menuSection = document.getElementById('menu');
              if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-primary text-white font-oswald uppercase tracking-wider rounded-md hover:bg-opacity-90 transition text-lg"
          >
            View Menu
          </button>
          <button 
            onClick={onOrderClick} 
            className="px-8 py-3 bg-accent text-secondary font-oswald uppercase tracking-wider rounded-md hover:bg-opacity-90 transition text-lg"
          >
            Order Online
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-black to-transparent z-20">
        <div className="container mx-auto px-4 flex justify-center items-center text-white flex-wrap gap-4">
          <div className="flex items-center mr-0 sm:mr-8">
            <i className="fas fa-map-marker-alt text-accent mr-2"></i>
            <span>3910 E Del Mar Ave, Laredo, TX 78045</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-phone text-accent mr-2"></i>
            <span>(956) 568-1450</span>
          </div>
        </div>
      </div>
    </section>
  );
}
