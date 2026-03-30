import { useEffect, useState, useCallback, useRef } from "react";
const logoImage = "/images/logo/gorilla-logo.jpg";
import DeliveryButtons from "./DeliveryButtons";
import OrderModal from "./OrderModal";

const heroImages = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
];

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left:     `${5 + (i * 6.5) % 90}%`,
  width:    2 + (i % 4),
  height:   3 + (i % 5),
  delay:    `${(i * 0.5) % 6}s`,
  duration: `${4.5 + (i % 4) + (i % 3) * 0.5}s`,
  g:        80 + (i % 5) * 22,
  opacity:  0.3 + (i % 4) * 0.12,
}));

const TAGLINE_WORDS = ["Unleash", "your", "appetite", "with", "our", "flame-grilled", "perfection."];

export default function HeroSection() {
  const [curtainOpen, setCurtainOpen]       = useState(false);
  const [punchDone, setPunchDone]           = useState(false);
  const [isVisible, setIsVisible]           = useState(false);
  const [titleGlitch, setTitleGlitch]       = useState(false);
  const [wordsVisible, setWordsVisible]     = useState(0);
  const [currentIdx, setCurrentIdx]         = useState(0);
  const [prevIdx, setPrevIdx]               = useState<number | null>(null);
  const [wipeDir, setWipeDir]               = useState<"right" | "left">("right");
  const [transitioning, setTransitioning]   = useState(false);
  const [wipeKey, setWipeKey]               = useState(0);
  const [isPaused, setIsPaused]             = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const parallaxRef = useRef<HTMLDivElement>(null);

  /* ── GPU-accelerated parallax via direct DOM mutation (no React state) ── */
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (parallaxRef.current) {
          parallaxRef.current.style.transform =
            `translateY(${window.scrollY * 0.28}px) scale(1.18) translateZ(0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Entry animations ── */
  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true),  80);
    const t2 = setTimeout(() => setPunchDone(true),    200);
    const t3 = setTimeout(() => setIsVisible(true),    700);
    const t4 = setTimeout(() => {
      setTitleGlitch(true);
      setTimeout(() => setTitleGlitch(false), 900);
    }, 1200);
    let wordTimer: ReturnType<typeof setInterval>;
    const t5 = setTimeout(() => {
      let count = 0;
      wordTimer = setInterval(() => {
        count++;
        setWordsVisible(count);
        if (count >= TAGLINE_WORDS.length) clearInterval(wordTimer);
      }, 110);
    }, 1500);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
      clearInterval(wordTimer);
    };
  }, []);

  const goToImage = useCallback(
    (newIdx: number, dir: "right" | "left") => {
      if (transitioning) return;
      setTransitioning(true);
      setPrevIdx(currentIdx);
      setWipeDir(dir);
      setCurrentIdx(newIdx);
      setWipeKey((k) => k + 1);
      setTimeout(() => {
        setPrevIdx(null);
        setTransitioning(false);
      }, 950);
    },
    [currentIdx, transitioning]
  );

  const nextImage = useCallback(() => {
    if (!isPaused) goToImage((currentIdx + 1) % heroImages.length, "right");
  }, [isPaused, currentIdx, goToImage]);

  const prevImage = useCallback(() => {
    goToImage(currentIdx === 0 ? heroImages.length - 1 : currentIdx - 1, "left");
  }, [currentIdx, goToImage]);

  useEffect(() => {
    const id = setInterval(nextImage, 5500);
    return () => clearInterval(id);
  }, [nextImage]);

  return (
    <section
      id="home"
      className="relative h-screen bg-secondary overflow-hidden"
      style={{ contain: "layout style" }}
    >

      {/* ── CURTAIN REVEAL ── */}
      <div
        className="absolute inset-0 z-50 pointer-events-none flex"
        aria-hidden="true"
      >
        <div
          className="w-1/2 h-full bg-black"
          style={{
            transform:  curtainOpen ? "translateX(-101%)" : "translateX(0)",
            transition: "transform 0.9s cubic-bezier(0.77,0,0.175,1)",
            willChange: "transform",
          }}
        />
        <div
          className="w-1/2 h-full bg-black"
          style={{
            transform:  curtainOpen ? "translateX(101%)" : "translateX(0)",
            transition: "transform 0.9s cubic-bezier(0.77,0,0.175,1)",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── EMBER PARTICLES ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ contain: "strict" }}
      >
        {EMBERS.map((e) => (
          <div
            key={e.id}
            className="absolute bottom-0 rounded-full animate-ember-rise"
            style={{
              left:              e.left,
              width:             e.width,
              height:            e.height,
              backgroundColor:   `rgba(255,${e.g},0,${e.opacity})`,
              animationDelay:    e.delay,
              animationDuration: e.duration,
              willChange:        "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* ── GRADIENT OVERLAY ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/50 to-black/85 opacity-90 z-10" />

      {/* ── PARALLAX + CINEMATIC WIPE CAROUSEL ── */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 z-0"
        style={{ transform: "translateY(0) scale(1.18) translateZ(0)", willChange: "transform" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {prevIdx !== null && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <img
              src={heroImages[prevIdx]}
              alt={`Gorilla Smoke & Grill – slide ${prevIdx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          key={wipeKey}
          className={`absolute inset-0 ${wipeDir === "right" ? "animate-wipe-in-right" : "animate-wipe-in-left"}`}
          style={{ zIndex: 2, willChange: "clip-path" }}
        >
          <img
            src={heroImages[currentIdx]}
            alt={`Gorilla Smoke & Grill – slide ${currentIdx + 1}`}
            className="w-full h-full object-cover animate-kenBurns"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>

      {/* ── NOISE TEXTURE ── */}
      <div
        className="absolute inset-0 opacity-[0.07] z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNyIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA2Ii8+PC9zdmc+")`,
        }}
        aria-hidden="true"
      />

      {/* ── NAV ARROWS ── */}
      <button
        onClick={prevImage}
        data-testid="button-hero-prev"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left" />
      </button>
      <button
        onClick={nextImage}
        data-testid="button-hero-next"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right" />
      </button>

      {/* ── SLIDE INDICATORS ── */}
      <div className="absolute bottom-24 left-0 right-0 z-20 flex flex-col items-center gap-3">
        <div className="flex justify-center space-x-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              data-testid={`button-hero-dot-${i}`}
              onClick={() => goToImage(i, i > currentIdx ? "right" : "left")}
              className={`rounded-full transition-all duration-300 ${
                currentIdx === i
                  ? "w-6 h-2 bg-primary shadow-[0_0_8px_rgba(255,136,0,0.8)]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          data-testid="button-hero-pause"
          onClick={() => setIsPaused((p) => !p)}
          className="bg-black/30 hover:bg-primary/60 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-primary"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          <i className={`fas ${isPaused ? "fa-play" : "fa-pause"} text-xs`} />
        </button>
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20 text-center">

        <div
          className={`mb-6 transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{
            animation: punchDone ? "punch-in 0.75s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "none",
            willChange: "transform",
          }}
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse opacity-70" />
            <img
              src={logoImage}
              alt="Gorilla Smoke & Grill Logo"
              className="h-full w-full object-contain relative z-10 drop-shadow-xl animate-float"
              style={{ willChange: "transform" }}
            />
          </div>
        </div>

        <h1
          className={`text-5xl md:text-7xl font-bold font-oswald text-white uppercase mb-4 tracking-wider drop-shadow-xl transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          } ${titleGlitch ? "animate-glitch" : ""}`}
          data-testid="text-hero-title"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="inline-block">Gorilla</span>{" "}
          <span className="inline-block text-accent animate-pulse-slow">&amp;</span>{" "}
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_auto]">
            Smoke&nbsp;&amp;&nbsp;Grill
          </span>
        </h1>

        <p
          className={`text-xl md:text-2xl text-white/90 mb-10 max-w-2xl drop-shadow-xl transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          data-testid="text-hero-tagline"
        >
          {TAGLINE_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.3em] transition-all duration-300"
              style={{
                opacity:   wordsVisible > i ? 1 : 0,
                transform: wordsVisible > i ? "translateY(0)" : "translateY(8px)",
                transitionDelay: `${i * 40}ms`,
                willChange: "transform, opacity",
              }}
            >
              {word === "flame-grilled" ? (
                <span className="text-accent font-semibold">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </p>

        <div
          className={`flex flex-col items-center gap-4 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md">
            <button
              data-testid="button-hero-view-menu"
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="relative px-6 py-3 font-oswald uppercase tracking-wider rounded-md shadow-lg overflow-hidden group text-base sm:text-lg flex-1 bg-white text-primary font-bold hover:bg-white/90 transition-colors"
            >
              <span className="relative flex items-center justify-center gap-2">
                <i className="fas fa-utensils text-sm" />
                View Menu
              </span>
            </button>

            <button
              data-testid="button-hero-order-now"
              onClick={() => setOrderModalOpen(true)}
              className="px-6 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent/90 transition-colors animate-pulse-slow flex-1 relative group overflow-hidden"
            >
              <span className="absolute inset-[-2px] bg-gradient-to-r from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105" />
              <span className="relative font-oswald uppercase tracking-wider flex items-center justify-center gap-2 z-10">
                <i className="fas fa-fire-alt text-sm" />
                Order Now
              </span>
            </button>
          </div>

          <OrderModal open={orderModalOpen} onOpenChange={setOrderModalOpen} locationId="delmar" />
        </div>
      </div>

      {/* ── LOCATIONS CALLOUT ── */}
      <div className="absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-center items-center text-white/90">
          <div className="flex items-center group">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
              <i className="fas fa-map-marker-alt" />
            </span>
            <span className="group-hover:text-white transition-colors duration-300">
              <span className="text-accent font-semibold">Three Laredo locations</span> — find the one nearest you
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
