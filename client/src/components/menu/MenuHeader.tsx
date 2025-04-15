interface MenuHeaderProps {
  isVisible: boolean;
}

export default function MenuHeader({ isVisible }: MenuHeaderProps) {
  return (
    <header className={`text-center mb-12 transform transition-all duration-1000 ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`}>
      <h2 id="menu-heading" className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide text-white">
        Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Menu</span>
      </h2>
      <p className="text-foreground/80 max-w-2xl mx-auto">
        Savor our wide selection of house specialties, all made with fresh ingredients and cooked to perfection
      </p>
    </header>
  );
}