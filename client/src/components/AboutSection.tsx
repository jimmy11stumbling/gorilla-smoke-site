import teamImage from "@assets/46485514_2064326156920825_1943796516204314624_n.jpg";
import storeFrontImg from "@assets/348s (1).jpg";
import chefGrillImage from "@assets/download (21).jpg";
// Chef portrait removed for separate feature page

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-4xl font-bold font-oswald uppercase mb-6 tracking-wide">
              About <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Gorilla Smoke & Grill</span>
            </h2>
            <p className="text-lg mb-6 text-foreground/90">
              Gorilla Smoke and Grill began as a passion project by Chef Ramiro Garza, who loved cooking for family and friends. What started as a humble hobby quickly gained popularity, and in February 2017, Ramiro officially established the Gorilla Smoke and Grill brand.
            </p>
            <p className="text-lg mb-6 text-foreground/90">
              Around the same time, the Gorilla Barbecue Team was formed—an incredible group of friends and pitmasters who brought their talents to barbecue competitions across Texas and Mexico. We started small, catering local events for 10 to 15 people.
            </p>
            <p className="text-lg mb-6 text-foreground/90">
              As our reputation grew, so did the scale of our events, eventually serving banquets for 300 to 400 guests. In July 2020, we launched Gorilla's Food Truck, combining the best of Mexican and American flavors.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center bg-card p-4 rounded-lg border border-border">
                <i className="fas fa-utensils text-3xl text-primary mr-4"></i>
                <div>
                  <h3 className="font-oswald text-xl font-bold">Fresh Ingredients</h3>
                  <p className="text-foreground/70">Locally sourced when possible</p>
                </div>
              </div>
              <div className="flex items-center bg-card p-4 rounded-lg border border-border">
                <i className="fas fa-fire-alt text-3xl text-primary mr-4"></i>
                <div>
                  <h3 className="font-oswald text-xl font-bold">Cooked to Order</h3>
                  <p className="text-foreground/70">Always fresh, never frozen</p>
                </div>
              </div>
              <div className="flex items-center bg-card p-4 rounded-lg border border-border">
                <i className="fas fa-cocktail text-3xl text-primary mr-4"></i>
                <div>
                  <h3 className="font-oswald text-xl font-bold">Craft Drinks</h3>
                  <p className="text-foreground/70">Unique house specialties</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border group relative">
                <img 
                  src={teamImage} 
                  alt="Gorilla Smoke & Grill team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x600/222/fff?text=Image+Unavailable";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border group relative">
                <img 
                  src={storeFrontImg} 
                  alt="Gorilla Smoke & Grill storefront" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x600/222/fff?text=Image+Unavailable";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border group relative">
                <img 
                  src={chefGrillImage} 
                  alt="Gorilla Smoke & Grill cooking" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x600/222/fff?text=Image+Unavailable";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border group relative">
                <img 
                  src={storeFrontImg} 
                  alt="Gorilla Smoke & Grill exterior" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x600/222/fff?text=Image+Unavailable";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}