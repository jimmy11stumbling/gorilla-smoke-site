import { useState } from "react";
import { Link } from "wouter";
import { SiTiktok } from "react-icons/si";
import { Play, Heart, MessageCircle, Share2, ArrowLeft, ExternalLink } from "lucide-react";

const TIKTOK_HANDLE = "@gorigorilaredo";
const TIKTOK_URL    = "https://www.tiktok.com/@gorigorilaredo";

const videos = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    caption: "Watch the smoke roll on these baby back ribs 🔥 #BBQ #Laredo #GorillaSmokeAndGrill",
    likes: "12.4K",
    comments: "238",
    shares: "941",
    duration: "0:47",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    caption: "Brisket so tender it falls apart 😤 Come try it at any of our 3 Laredo locations! #Brisket #TexasBBQ",
    likes: "28.7K",
    comments: "512",
    shares: "2.1K",
    duration: "0:32",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    caption: "Gorilla Elote — the side dish you never knew you needed 🌽🔥 #Elote #MexicanFood #Laredo",
    likes: "9.1K",
    comments: "174",
    shares: "603",
    duration: "0:24",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80",
    caption: "Loaded BBQ Nachos — the crowd pleaser every time 🧀🌶️ #Nachos #BBQNachos #GorillaSmokeGrill",
    likes: "6.8K",
    comments: "97",
    shares: "428",
    duration: "0:19",
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    caption: "Friday nights hit different at Gorilla 🦍🔥 Come through! #GorillaSmokeAndGrill #Laredo #Weekend",
    likes: "41.2K",
    comments: "889",
    shares: "3.6K",
    duration: "0:58",
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    caption: "Behind the smoke — how El Miro puts together the perfect plate every single time 👨‍🍳 #Chef #BBQLife",
    likes: "19.5K",
    comments: "331",
    shares: "1.4K",
    duration: "1:02",
  },
];

const highlights = [
  { icon: "🔥", label: "Pitmaster Tips", count: "24 videos" },
  { icon: "🥩", label: "Brisket Drops",  count: "18 videos" },
  { icon: "🌽", label: "Menu Features",  count: "31 videos" },
  { icon: "🏆", label: "Competitions",   count: "12 videos" },
];

function VideoCard({ video }: { video: typeof videos[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group bg-black shadow-xl border border-white/10"
      style={{ aspectRatio: "9/16" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(TIKTOK_URL, "_blank")}
      data-testid={`card-tiktok-video-${video.id}`}
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.caption}
        className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
      />

      {/* Gradient overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* TikTok-style top bar */}
      <div className="absolute top-3 right-3">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-mono">
          {video.duration}
        </span>
      </div>

      {/* Play button on hover */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-2xl">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Handle */}
        <p className="text-white text-xs font-semibold mb-2 opacity-80">{TIKTOK_HANDLE}</p>
        {/* Caption */}
        <p className="text-white text-sm leading-snug mb-3 line-clamp-2">{video.caption}</p>
        {/* Stats */}
        <div className="flex items-center gap-4 text-white/80 text-xs">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#fe2c55] text-[#fe2c55]" />
            {video.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {video.comments}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            {video.shares}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TikTokPage() {
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
        {/* Background blur from one of the video thumbnails */}
        <div
          className="absolute inset-0 scale-110 opacity-25 blur-2xl"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 py-16">
          {/* Avatar */}
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-[#fe2c55] via-[#25f4ee] to-[#fe2c55] animate-spin" style={{ animationDuration: "4s" }} />
            <img
              src="/images/logo/gorilla-logo.jpg"
              alt="Gorilla Smoke & Grill"
              className="relative w-28 h-28 rounded-full object-cover border-2 border-black"
            />
          </div>

          {/* Handle & name */}
          <h1 className="text-2xl font-bold tracking-tight mb-1" data-testid="text-tiktok-handle">
            {TIKTOK_HANDLE}
          </h1>
          <p className="text-white/60 text-sm mb-4">Gorilla Smoke &amp; Grill — Laredo, TX</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            {[
              { value: "148", label: "Following" },
              { value: "24.6K", label: "Followers" },
              { value: "318.4K", label: "Likes" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold" data-testid={`text-tiktok-stat-${s.label.toLowerCase()}`}>{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <p className="text-white/80 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
            🦍 Gorilla Smoke &amp; Grill | Laredo, TX<br />
            🔥 BBQ &amp; Grill since 2017<br />
            📍 3 locations — come find us!
          </p>

          {/* Follow CTA */}
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

      {/* ── HIGHLIGHTS ── */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {highlights.map((h) => (
            <a
              key={h.label}
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none flex flex-col items-center gap-2 cursor-pointer group"
              data-testid={`link-tiktok-highlight-${h.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-[#fe2c55] transition-colors flex items-center justify-center text-2xl bg-white/5">
                {h.icon}
              </div>
              <span className="text-white/60 text-xs text-center leading-tight w-16">{h.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── VIDEO GRID ── */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4 border-t border-white/10 pt-6">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Latest Videos</h2>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="max-w-xl mx-auto text-center px-4 py-12">
          <SiTiktok className="w-10 h-10 mx-auto mb-4 text-white/40" />
          <h3 className="text-xl font-bold mb-2">See us in action every day</h3>
          <p className="text-white/50 text-sm mb-6">
            Behind-the-scenes smoke sessions, pitmaster tips, new menu drops, and more — follow us on TikTok so you never miss a thing.
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
