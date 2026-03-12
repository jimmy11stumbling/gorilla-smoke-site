import { motion } from 'framer-motion';

const featuredItems = [
  {
    id: 1,
    name: 'St. Louis Style Ribs',
    price: 24.99,
    description: 'Fall-off-the-bone pork ribs glazed with our signature sweet and smoky BBQ sauce.',
    image: '/popular-ribs.png'
  },
  {
    id: 2,
    name: 'Loaded Nachos',
    price: 15.99,
    description: 'Crispy tortilla chips with melted cheese, jalapeños, sour cream, guacamole, and pulled pork.',
    image: '/popular-nachos.png'
  },
  {
    id: 3,
    name: 'BBQ Grilled Chicken',
    price: 18.99,
    description: 'Juicy grilled chicken breast topped with BBQ sauce, cheese, bacon, and fresh herbs.',
    image: '/popular-bbq-chicken.png'
  },
  {
    id: 4,
    name: 'Fish & Chips',
    price: 16.99,
    description: 'Golden crispy battered fish fillet served with thick cut fries and lemon wedges.',
    image: '/popular-fish-chips.png'
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
                  data-testid={`img-popular-${item.id}`}
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
                  data-testid={`btn-order-${item.id}`}
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
            data-testid="btn-see-menu"
          >
            See Full Menu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
