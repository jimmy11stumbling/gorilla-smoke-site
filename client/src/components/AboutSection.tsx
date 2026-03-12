import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const BURGER_IMG = '/images/about-burger.png';
const CHEF_IMG = '/images/about-chef.png';
const MEME_IMG = '/images/about-meme.png';

const stats = [
  { value: '2017', label: 'Est. Year' },
  { value: '400+', label: 'Guests Served' },
  { value: '3', label: 'Locations' },
  { value: '100%', label: 'Fresh Daily' },
];

const features = [
  { icon: 'fas fa-utensils', title: 'Fresh Ingredients', desc: 'Locally sourced when possible' },
  { icon: 'fas fa-fire-alt', title: 'Cooked to Order', desc: 'Always fresh, never frozen' },
  { icon: 'fas fa-cocktail', title: 'Craft Drinks', desc: 'Unique house specialties' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <span className="inline-block text-primary font-semibold uppercase tracking-widest text-sm mb-3">Our Story</span>
          <h2 className="text-5xl font-bold font-oswald uppercase tracking-wide">
            About <span className="text-primary">Gorilla Smoke & Grill</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="text-center bg-card border border-border rounded-xl py-6 px-4 shadow-sm"
            >
              <div className="text-3xl font-oswald font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-foreground/60 mt-1 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row items-start gap-16">

          {/* Left: text */}
          <div className="lg:w-1/2">
            {[
              'Gorilla Smoke and Grill began as a passion project by Chef Ramiro Garza, who loved cooking for family and friends. What started as a humble hobby quickly gained popularity, and in February 2017, Ramiro officially established the Gorilla Smoke and Grill brand.',
              'Around the same time, the Gorilla Barbecue Team was formed—an incredible group of friends and pitmasters who brought their talents to barbecue competitions across Texas and Mexico. We started small, catering local events for 10 to 15 people.',
              'As our reputation grew, so did the scale of our events, eventually serving banquets for 300 to 400 guests. In July 2020, we launched Gorilla\'s Food Truck, combining the best of Mexican and American flavors.',
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                className="text-lg mb-5 text-foreground/85 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            <div className="flex flex-col gap-4 mt-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.45 + i * 0.12, ease: 'easeOut' }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex items-center bg-card p-4 rounded-xl border border-border shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <i className={`${f.icon} text-xl text-primary`}></i>
                  </div>
                  <div>
                    <h3 className="font-oswald text-lg font-bold">{f.title}</h3>
                    <p className="text-foreground/60 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: images */}
          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-2 gap-4" style={{ height: '560px' }}>

              {/* Tall image - left column, spans both rows */}
              <motion.div
                style={{ y: y1 }}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="row-span-2 overflow-hidden rounded-2xl shadow-xl group relative"
                style={{ y: y1, gridRow: 'span 2' }}
              >
                <img
                  src={BURGER_IMG}
                  alt="Gorilla Burger"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-oswald font-bold text-lg drop-shadow-lg">Gorilla Burger</span>
                </div>
              </motion.div>

              {/* Top-right image */}
              <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                className="overflow-hidden rounded-2xl shadow-xl group relative"
              >
                <img
                  src={CHEF_IMG}
                  alt="Gorilla Grill Kitchen"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Bottom-right image */}
              <motion.div
                style={{ y: y3 }}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="overflow-hidden rounded-2xl shadow-xl group relative"
              >
                <img
                  src={MEME_IMG}
                  alt="Gorilla Smoke and Grill Social"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                    ¡Así de grandes, compa! 🔥
                  </span>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
