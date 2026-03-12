import { motion } from 'framer-motion';

const featuredItems = [
  {
    id: 1,
    name: 'BBQ Burger with Fries',
    price: 13.99,
    description: 'Juicy beef patty with our signature BBQ sauce served with a side of seasoned fries.',
    image: '/menu-item-bbq-burger.png'
  },
  {
    id: 2,
    name: 'Brisket Tacos',
    price: 14.99,
    description: 'Premium smoked brisket in fresh corn tortillas with cilantro, onions, and lime.',
    image: '/menu-item-brisket-tacos.png'
  },
  {
    id: 3,
    name: 'Signature Sandwich',
    price: 16.99,
    description: 'Our famous signature sandwich loaded with premium pulled pork, brisket, and our special sauce.',
    image: '/menu-item-signature-sandwich.png'
  },
  {
    id: 4,
    name: 'Gorilla Elote',
    price: 8.99,
    description: 'Mexican street corn covered with melted cheese and our special spicy seasoning.',
    image: '/menu-item-elote.png'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeaturedItems() {
  const handleOrderClick = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="text-5xl font-bold font-oswald uppercase mb-3 tracking-wide">
            Popular <span className="text-primary">Picks</span>
          </h2>
          <p className="text-card-foreground/80 max-w-2xl mx-auto text-lg">
            Our most loved selections that keep our customers coming back for more
          </p>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group bg-secondary rounded-xl shadow-lg overflow-hidden border border-border transition-all hover:shadow-2xl cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-lg font-bold font-oswald tracking-wide text-white flex-1">
                    {item.name}
                  </h3>
                  <span className="text-primary font-bold text-lg shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-5 line-clamp-2">
                  {item.description}
                </p>

                <motion.button
                  onClick={handleOrderClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-primary text-white font-oswald uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <motion.button
            onClick={handleOrderClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 bg-accent text-accent-foreground font-oswald uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-colors text-lg font-bold"
          >
            See Full Menu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
