import { ArrowDownRight, ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ArtworkCard, ArtworkVisual, AdSlot } from "@/components/ArtworkCard";
import { PageFrame } from "@/components/InkprowlChrome";
import { artworks, categories } from "@/data/catalog";

export default function Home() {
  const lead = artworks[0];
  return (
    <PageFrame dark>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow light"><Sparkles size={14} /> HUMAN-DIRECTED / AI-CRAFTED</div>
          <h1>Art that prowls<br /><em>past the ordinary.</em></h1>
          <p>INKPROWL makes collectible animal characters in the language of old engravings, sharp tailoring, and editorial wit.</p>
          <div className="hero-cta-row"><Link href="/gallery" className="button-light">Explore the gallery <ArrowRight size={16} /></Link><Link href="/categories" className="text-link-light">Browse categories <ArrowDownRight size={17} /></Link></div>
        </div>
        <div className="hero-art-wrap"><div className="hero-stats"><span><ShieldCheck size={16} /> COLLECTIBLE EDITIONS</span><span>4K / 600 DPI</span></div><ArtworkVisual artwork={lead} large /><div className="hero-art-caption"><span>01 — FEATURED EDITION</span><strong>{lead.title}</strong></div></div>
      </section>
      <section className="media-section section-wrap"><div className="section-heading inverse"><div><span className="eyebrow light">IN MOTION</span><h2>A moving image,<br />beneath the ink.</h2></div><p>Use this player for a Cloudinary-hosted studio reel or a seasonal visual essay.</p></div><div className="video-stage"><div className="video-poster"><span>INKPROWL / FILM NO. 01</span><button className="round-play" aria-label="Play INKPROWL film"><Play size={21} fill="currentColor" /></button><strong>Enter the<br /><em>quietly wild.</em></strong></div><div className="video-note">Video source is set by the owner in Cloudinary and published through the GitHub content file.</div></div></section>
      <section className="section-wrap light-section featured-section"><div className="section-heading"><div><span className="eyebrow">THE EDITOR’S DESK</span><h2>Featured works</h2></div><Link href="/gallery" className="text-link">View all works <ArrowRight size={16} /></Link></div><div className="feature-grid">{artworks.slice(0, 3).map((artwork, index) => <ArtworkCard key={artwork.slug} artwork={artwork} feature={index === 0} />)}</div></section>
      <AdSlot label="A considered home for a considered advertisement" />
      <section className="section-wrap categories-preview"><div className="section-heading"><div><span className="eyebrow">FIND YOUR PROWL</span><h2>Categories with<br /><em>character.</em></h2></div><Link href="/categories" className="text-link">All categories <ArrowRight size={16} /></Link></div><div className="category-strip">{categories.slice(0, 6).map((category, index) => <Link href={`/gallery?category=${encodeURIComponent(category.name)}`} key={category.name} className="category-poster"><span className="category-number">0{index + 1}</span><span className="category-icon">{category.icon}</span><strong>{category.name}</strong><small>{category.count} WORKS</small></Link>)}</div></section>
      <section className="manifesto"><div className="manifesto-rule" /><span className="eyebrow light">THE INKPROWL STANDARD</span><h2>Made to be <em>looked at slowly.</em></h2><p>Each piece is composed by a human eye, then crafted with generative tools and refined for collection. No noise. No generic stock imagery. Just character, line, and intent.</p></section>
    </PageFrame>
  );
}
