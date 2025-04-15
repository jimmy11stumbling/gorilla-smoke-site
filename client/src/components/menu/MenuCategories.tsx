import { MenuCategory } from "@/lib/data";

interface MenuCategoriesProps {
  categories: { id: MenuCategory | "all", label: string, icon: string }[];
  activeCategory: MenuCategory | "all";
  isVisible: boolean;
  setActiveCategory: (category: MenuCategory | "all") => void;
}

export default function MenuCategories({
  categories,
  activeCategory,
  isVisible,
  setActiveCategory
}: MenuCategoriesProps) {
  return (
    <div className={`mb-12 transform transition-all duration-1000 delay-300 ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`}>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
              activeCategory === category.id
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-card hover:bg-primary/10 text-muted-foreground hover:text-primary"
            }`}
            aria-pressed={activeCategory === category.id}
            aria-label={`Filter menu by ${category.label} category`}
          >
            <i className={`fas ${category.icon}`} aria-hidden="true"></i>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}