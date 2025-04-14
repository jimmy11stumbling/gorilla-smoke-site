export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-4xl font-bold font-oswald uppercase mb-6 tracking-wide">
              About <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Gorilla Bar & Grill</span>
            </h2>
            <p className="text-lg mb-6 text-foreground/90">
              Founded in 2015, Gorilla Bar & Grill has quickly become Laredo's premier destination for flame-grilled favorites and craft beverages. What started as a passion project has grown into a beloved local institution.
            </p>
            <p className="text-lg mb-6 text-foreground/90">
              Our commitment to quality is unwavering. We source the freshest ingredients, prepare everything in-house, and take pride in offering exceptional service in a warm, inviting atmosphere.
            </p>
            <p className="text-lg mb-6 text-foreground/90">
              Whether you're joining us for a casual lunch, family dinner, or evening drinks with friends, our team is dedicated to making your experience memorable.
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
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Restaurant interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Bar area" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1529417305485-480f579e7578?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Grill cooking" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg shadow-lg border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Happy customers" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
