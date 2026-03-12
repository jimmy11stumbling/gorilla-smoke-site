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

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -25]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -15]);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <span className="inline-block text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Our Story
          </span>
          <h2 className="text-5xl font-bold font-oswald uppercase tracking-wide">
            About <span className="text-primary">Gorilla Smoke & Grill</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Stats bar */}
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

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row items-start gap-12">

          {/* LEFT: Text content */}
          <div className="lg:w-1/2 w-full">
            {paragraphs.map((text, i) => (
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

            <div className="flex flex-col gap-3 mt-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: 'easeOut' }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="flex items-center bg-card p-4 rounded-xl border border-border shadow-sm cursor-default"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <i className={`${f.icon} text-lg text-primary`} />
                  </div>
                  <div>
                    <h3 className="font-oswald text-lg font-bold">{f.title}</h3>
                    <p className="text-foreground/60 text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Three images */}
          <div className="lg:w-1/2 w-full">
            {/* Layout: large image left + two stacked right */}
            <div className="flex gap-4" style={{ height: '520px' }}>

              {/* Large image — left, full height */}
              <motion.div
                style={{ y: y1, flex: '1 1 55%' }}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-2xl shadow-xl group"
              >
                <img
                  src={burgerImg}
                  alt="Gorilla Burger"
                  data-testid="img-about-burger"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-oswald font-bold text-xl drop-shadow-lg">Gorilla Burger</span>
                </div>
              </motion.div>

              {/* Right column: two stacked images */}
              <div className="flex flex-col gap-4" style={{ flex: '1 1 45%' }}>
                {/* Top-right: Chef / Now Hiring */}
                <motion.div
                  style={{ y: y2, flex: 1 }}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-2xl shadow-xl group"
                >
                  <img
                    src={chefImg}
                    alt="Gorilla Grill Kitchen"
                    data-testid="img-about-chef"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Bottom-right: Meme / Social post */}
                <motion.div
                  style={{ y: y3, flex: 1 }}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-2xl shadow-xl group"
                >
                  <img
                    src={memeImg}
                    alt="Gorilla Smoke and Grill Social"
                    data-testid="img-about-social"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/75 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                      ¡Así de grandes, compa! 🔥
                    </span>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
