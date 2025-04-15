interface MenuHeaderProps {
  isVisible: boolean;
}

export default function MenuHeader({ isVisible }: MenuHeaderProps) {
  return (
    <div className={`text-center mb-12 transform transition-all duration-1000 ease-out ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`}>
      <h2 
        id="menu-heading"
        className="text-4xl md:text-5xl font-bold mb-4 font-oswald uppercase tracking-wide text-primary"
      >
        Our Menu
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
        Explore our diverse selection of signature dishes and crowd favorites, 
        crafted with locally-sourced ingredients and our proprietary smoke techniques.
      </p>
    </div>
  );
}