import { MenuCategory } from "@/lib/data";

interface MenuCategoriesProps {
  categories: { id: MenuCategory | "all"; label: string; icon: string }[];
  activeCategory: MenuCategory | "all";
  isVisible: boolean;
  setActiveCategory: (category: MenuCategory | "all") => void;
}

export default function MenuCategories({
  categories,
  activeCategory,
  isVisible,
  setActiveCategory,
}: MenuCategoriesProps) {
  return (
    <div className={`mb-12 transform transition-all duration-1000 delay-300 ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`}>
      <div 
        className="flex flex-wrap justify-center gap-4" 
        role="tablist" 
        aria-label="Menu categories"
      >
        {categories.map((category) => (
          <button 
            key={category.id}
            className={`flex items-center px-6 py-2 font-oswald uppercase tracking-wider rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
              activeCategory === category.id 
                ? "bg-primary text-white shadow-lg" 
                : "bg-card text-white hover:bg-primary/80 hover:scale-105"
            }`}
            onClick={() => setActiveCategory(category.id)}
            onKeyDown={(e) => {
              // Handle left/right arrow keys for keyboard navigation between tabs
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = categories.findIndex(c => c.id === activeCategory);
                const nextIndex = e.key === 'ArrowLeft' 
                  ? (currentIndex - 1 + categories.length) % categories.length
                  : (currentIndex + 1) % categories.length;
                setActiveCategory(categories[nextIndex].id);
              }
            }}
            aria-label={`Show ${category.label} menu items`}
            aria-pressed={activeCategory === category.id}
            role="tab"
            id={`tab-${category.id}`}
            aria-controls={`tabpanel-${category.id}`}
            aria-selected={activeCategory === category.id}
            tabIndex={activeCategory === category.id ? 0 : -1}
          >
            <i className={`fas ${category.icon} mr-2`} aria-hidden="true"></i>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}