import { Link, useLocation } from "wouter";
import { Film, Menu, Music2, Pause, Play, Search, X } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { siteBranding, siteMedia } from "@/data/catalog";

const navItems = [
  { label: "Gallery", href: "/gallery" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="INKPROWL home">
      <span className="brand-seal">{siteBranding.logoUrl ? <img className="brand-logo" src={siteBranding.logoUrl} alt="INKPROWL logo" /> : "IP"}</span>
      {!compact && <span className="brand-word">INKPROWL</span>}
    </Link>
  );
}

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Mark />
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={location === item.href ? "active" : ""} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search artwork"><Search size={20} strokeWidth={1.7} /></button>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={23} strokeWidth={1.7} /> : <Menu size={25} strokeWidth={1.7} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Mark />
          <p>Human-directed animal editions, made for generous walls and curious collections.</p>
        </div>
        <div className="footer-links">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 INKPROWL</span><span>Cloudinary-delivered editions</span></div>
    </footer>
  );
}

export function FloatingPlayer() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundtrackReady = Boolean(siteMedia.soundtrackUrl);
  const togglePlayback = async () => {
    if (!audioRef.current || !soundtrackReady) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };
  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, offsetX: position.x, offsetY: position.y };
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    setPosition({ x: dragStart.current.offsetX + event.clientX - dragStart.current.x, y: dragStart.current.offsetY + event.clientY - dragStart.current.y });
  };
  const endDrag = () => { dragStart.current = null; };
  return (
    <div className="floating-player" aria-label="INKPROWL music player" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
      {siteMedia.soundtrackUrl && <audio ref={audioRef} src={siteMedia.soundtrackUrl} onEnded={() => setPlaying(false)} />}
      <button onClick={togglePlayback} disabled={!soundtrackReady} className="floating-play" aria-label={playing ? "Pause soundtrack" : soundtrackReady ? "Play soundtrack" : "Soundtrack is not configured"} title={soundtrackReady ? "Play soundtrack" : "Owner can add a Cloudinary audio URL in the catalog"}>
        {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
      </button>
      <div className="player-copy"><span><Music2 size={12} /> AUDIO EDITION</span><strong>{playing ? siteMedia.soundtrackTitle : soundtrackReady ? siteMedia.soundtrackTitle : "Curated sound"}</strong></div>
      <span className="player-dot" aria-hidden="true" />
    </div>
  );
}

export function CloudinaryVideoPlayer({ src, title, className = "" }: { src?: string; title: string; className?: string }) {
  if (!src) {
    return <div className={`cloudinary-video empty-video ${className}`}><Film size={25} /><strong>Film awaiting release</strong><span>{title} will play here once its owner adds a Cloudinary video URL.</span></div>;
  }
  return <div className={`cloudinary-video ${className}`}><video controls preload="metadata" playsInline aria-label={title}><source src={src} />Your browser does not support HTML5 video.</video></div>;
}

export function PageFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={`site-shell ${dark ? "dark-surface" : ""}`}><Header /><main>{children}</main><Footer /><FloatingPlayer /></div>;
}
