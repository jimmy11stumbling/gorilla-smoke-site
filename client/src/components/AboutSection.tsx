import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import burgerImg from '@assets/image_1773351652639.png';
import chefImg from '@assets/image_1773351647458.png';
import memeImg from '@assets/image_1773351650306.png';

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

const paragraphs = [
  'Gorilla Smoke and Grill began as a passion project by Chef Ramiro Garza, who loved cooking for family and friends. What started as a humble hobby quickly gained popularity, and in February 2017, Ramiro officially established the Gorilla Smoke and Grill brand.',
  'Around the same time, the Gorilla Barbecue Team was formed—an incredible group of friends and pitmasters who brought their talents to barbecue competitions across Texas and Mexico. We started small, catering local events for 10 to 15 people.',
  "As our reputation grew, so did the scale of our events, eventually serving banquets for 300 to 400 guests. In July 2020, we launched Gorilla's Food Truck, combining the best of Mexican and American flavors.",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -40]);
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -50]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-10, 0]);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-block text-primary font-semibold uppercase tracking-widest text-sm mb-4 px-4 py-2 border border-primary/30 rounded-full"
          >
            Our Story
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-5xl md:text-6xl font-bold font-oswald uppercase tracking-wide"
          >
            About <span className="text-primary">Gorilla</span>
            <br />
            <span className="text-primary">Smoke & Grill</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"
          />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                transition: { duration: 0.3 },
              }}
              className="text-center bg-card border border-border rounded-xl py-8 px-4 shadow-sm hover:bg-card/80 transition-colors cursor-default"
            >
              <motion.div
                whileInView={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-4xl font-oswald font-bold text-primary"
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-foreground/60 mt-2 uppercase tracking-wider font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row items-start gap-16">

          {/* LEFT: Text content */}
          <motion.div
            className="lg:w-1/2 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="text-lg mb-6 text-foreground/80 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            <motion.div
              className="flex flex-col gap-4 mt-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{
                    x: 12,
                    backgroundColor: 'rgba(var(--primary), 0.05)',
                    transition: { duration: 0.3 },
                  }}
                  className="flex items-center bg-card p-5 rounded-xl border border-border shadow-sm cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 20, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0"
                  >
                    <i className={`${f.icon} text-lg text-primary`} />
                  </motion.div>
                  <div>
                    <h3 className="font-oswald text-lg font-bold">{f.title}</h3>
                    <p className="text-foreground/60 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Three images with enhanced animations */}
          <motion.div
            className="lg:w-1/2 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Layout: large image left + two stacked right */}
            <div className="flex gap-5" style={{ height: '560px' }}>

              {/* Large image — left, full height */}
              <motion.div
                style={{
                  y: y1,
                  scale: scale1,
                  flex: '1 1 55%',
                }}
                variants={imageVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.4 },
                }}
                className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              >
                <img
                  src={burgerImg}
                  alt="Gorilla Burger"
                  data-testid="img-about-burger"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-6 left-6"
                >
                  <span className="text-white font-oswald font-bold text-2xl drop-shadow-xl">Gorilla Burger</span>
                </motion.div>
              </motion.div>

              {/* Right column: two stacked images */}
              <div className="flex flex-col gap-5" style={{ flex: '1 1 45%' }}>
                {/* Top-right: Chef / Now Hiring */}
                <motion.div
                  style={{
                    y: y2,
                    scale: scale2,
                    flex: 1,
                  }}
                  variants={imageVariants}
                  transition={{ ...imageVariants.visible.transition, delay: 0.15 }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.4 },
                  }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
                >
                  <img
                    src={chefImg}
                    alt="Gorilla Grill Kitchen"
                    data-testid="img-about-chef"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  />
                </motion.div>

                {/* Bottom-right: Meme / Social post */}
                <motion.div
                  style={{
                    y: y3,
                    rotate: rotate1,
                    flex: 1,
                  }}
                  variants={imageVariants}
                  transition={{ ...imageVariants.visible.transition, delay: 0.3 }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.4 },
                  }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
                >
                  <img
                    src={memeImg}
                    alt="Gorilla Smoke and Grill Social"
                    data-testid="img-about-social"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-4"
                  >
                    <span className="bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md">
                      ¡Así de grandes, compa! 🔥
                    </span>
                  </motion.div>
                </motion.div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
