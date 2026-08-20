import { Link, useLocation } from "wouter";
import { Menu, Music2, Pause, Play, Search, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Gallery", href: "/gallery" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="INKPROWL home">
      <span className="brand-seal">IP</span>
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
  return (
    <div className="floating-player" aria-label="INKPROWL music player">
      <button onClick={() => setPlaying(!playing)} className="floating-play" aria-label={playing ? "Pause soundtrack" : "Play soundtrack"}>
        {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
      </button>
      <div className="player-copy"><span><Music2 size={12} /> AUDIO EDITION</span><strong>{playing ? "The Prowl, Side A" : "Curated sound"}</strong></div>
      <span className="player-dot" aria-hidden="true" />
    </div>
  );
}

export function PageFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={`site-shell ${dark ? "dark-surface" : ""}`}><Header /><main>{children}</main><Footer /><FloatingPlayer /></div>;
}
