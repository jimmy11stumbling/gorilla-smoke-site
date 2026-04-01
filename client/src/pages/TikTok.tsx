import { useEffect } from "react";
import { Link } from "wouter";
import { SiTiktok } from "react-icons/si";
import { ArrowLeft, ExternalLink } from "lucide-react";

const TIKTOK_HANDLE = "@gorigorilaredo";
const TIKTOK_URL    = "https://www.tiktok.com/@gorigorilaredo";

export default function TikTokPage() {

  useEffect(() => {
    const existing = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const s = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (s) s.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <Link
          href="/"
          data-testid="button-tiktok-back"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
        <div className="flex-1 flex justify-center">
          <SiTiktok className="w-6 h-6 text-white" />
        </div>
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-tiktok-follow-top"
          className="text-sm font-bold bg-[#fe2c55] hover:bg-[#e0253f] text-white px-4 py-1.5 rounded-full transition-colors"
        >
          Follow
        </a>
      </div>

      {/* ── PROFILE HERO ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 scale-110 opacity-25 blur-2xl"
          style={{
            backgroundImage: `url(/images/menu/bbq-ribs.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 py-16">
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#fe2c55] via-[#25f4ee] to-[#fe2c55] animate-spin" style={{ animationDuration: "4s" }} />
            <img
              src="/images/logo/gorilla-logo.jpg"
              alt="Gorilla Smoke & Grill"
              className="relative w-36 h-36 rounded-xl object-contain border-2 border-black bg-black"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1" data-testid="text-tiktok-handle">
            {TIKTOK_HANDLE}
          </h1>
          <p className="text-white/60 text-sm mb-4">Gorillas Barbecue Laredo</p>

          <div className="flex justify-center gap-8 mb-6">
            {[
              { value: "128",   label: "Following" },
              { value: "1,180", label: "Followers" },
              { value: "4,554", label: "Likes" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold" data-testid={`text-tiktok-stat-${s.label.toLowerCase()}`}>{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-white/80 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
            The best BBQ, Burgers and Tacos
          </p>

          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-tiktok-follow-main"
            className="inline-flex items-center gap-2 bg-[#fe2c55] hover:bg-[#e0253f] text-white font-bold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-[0_0_24px_rgba(254,44,85,0.4)] hover:shadow-[0_0_32px_rgba(254,44,85,0.6)]"
          >
            <SiTiktok className="w-4 h-4" />
            Follow on TikTok
          </a>
        </div>
      </div>

      {/* ── FEATURED VIDEO ── */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5 border-t border-white/10 pt-8">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Featured Video</h2>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#25f4ee] text-sm hover:underline"
            data-testid="link-tiktok-view-all"
          >
            View all <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex justify-center" data-testid="embed-tiktok-video">
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@gorigorilaredo/video/7615062039144271118"
            data-video-id="7615062039144271118"
            style={{ maxWidth: "605px", minWidth: "325px" }}
          >
            <section>
              <a
                target="_blank"
                title="@gorigorilaredo"
                href="https://www.tiktok.com/@gorigorilaredo?refer=embed"
              >
                @gorigorilaredo
              </a>{" "}
              El dinero no compra la felicidad… pero sí compra comida bien sabrosa 😏🍔🍟 Y la neta… eso se le parece mucho. 🔥 Ven por tu dosis de felicidad en Gorilla 🦍 Aquí se viene a comer como se debe.{" "}
              <a title="gorillasmokeandgrill" target="_blank" href="https://www.tiktok.com/tag/gorillasmokeandgrill?refer=embed">#GorillaSmokeAndGrill</a>{" "}
              <a title="burgerlovers" target="_blank" href="https://www.tiktok.com/tag/burgerlovers?refer=embed">#BurgerLovers</a>{" "}
              <a title="foodreels" target="_blank" href="https://www.tiktok.com/tag/foodreels?refer=embed">#FoodReels</a>{" "}
              <a title="antojo" target="_blank" href="https://www.tiktok.com/tag/antojo?refer=embed">#Antojo</a>{" "}
              <a title="comidaqueenamora" target="_blank" href="https://www.tiktok.com/tag/comidaqueenamora?refer=embed">#ComidaQueEnamora</a>{" "}
              <a target="_blank" title="♬ sonido original - Gorillas Barbecue Laredo" href="https://www.tiktok.com/music/sonido-original-7615062081209617166?refer=embed">♬ sonido original - Gorillas Barbecue Laredo</a>
            </section>
          </blockquote>
        </div>
      </div>

      {/* ── CREATOR PROFILE EMBED ── */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-5 border-t border-white/10 pt-8">
          Our TikTok Profile
        </h2>

        <div className="flex justify-center" data-testid="embed-tiktok-creator">
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@gorigorilaredo"
            data-unique-id="gorigorilaredo"
            data-embed-type="creator"
            style={{ maxWidth: "780px", minWidth: "288px" }}
          >
            <section>
              <a target="_blank" href="https://www.tiktok.com/@gorigorilaredo?refer=creator_embed">
                @gorigorilaredo
              </a>
            </section>
          </blockquote>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="max-w-xl mx-auto text-center px-4 py-12">
          <SiTiktok className="w-10 h-10 mx-auto mb-4 text-white/40" />
          <h3 className="text-xl font-bold mb-2">The best BBQ, Burgers and Tacos</h3>
          <p className="text-white/50 text-sm mb-6">
            Follow Gorillas Barbecue Laredo on TikTok for the latest drops, behind-the-scenes pitmaster sessions, game day specials, and more.
          </p>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-tiktok-follow-bottom"
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-full text-sm hover:bg-white/90 transition-colors"
          >
            <SiTiktok className="w-4 h-4" />
            {TIKTOK_HANDLE}
          </a>
        </div>
      </div>

    </div>
  );
}
