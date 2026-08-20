import { ArrowDownRight, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ArtworkCard, ArtworkVisual, AdSlot } from "@/components/ArtworkCard";
import { CloudinaryVideoPlayer, PageFrame } from "@/components/InkprowlChrome";
import { categories, publishedArtworks, siteBranding, siteMedia, sponsoredCampaign } from "@/data/catalog";

export default function Home() {
  const lead = publishedArtworks[0];
  return (
    <PageFrame dark>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow light"><Sparkles size={14} /> {siteBranding.heroKicker}</div>
          <h1>{siteBranding.heroTitle}</h1>
          <p>INKPROWL makes collectible animal characters in the language of old engravings, sharp tailoring, and editorial wit.</p>
          <div className="hero-cta-row"><Link href="/gallery" className="button-light">Explore the gallery <ArrowRight size={16} /></Link><Link href="/categories" className="text-link-light">Browse categories <ArrowDownRight size={17} /></Link></div>
        </div>
        <div className="hero-art-wrap"><div className="hero-stats"><span><ShieldCheck size={16} /> COLLECTIBLE EDITIONS</span><span>4K / 600 DPI</span></div>{siteBranding.heroBannerUrl ? <img className="hero-banner" src={siteBranding.heroBannerUrl} alt="INKPROWL hero banner" /> : <ArtworkVisual artwork={lead} large />}<div className="hero-art-caption"><span>01 — FEATURED EDITION</span><strong>{lead.title}</strong></div></div>
      </section>
      <section className="media-section section-wrap"><div className="section-heading inverse"><div><span className="eyebrow light">IN MOTION</span><h2>A moving image,<br />beneath the ink.</h2></div><p>Use this player for a Cloudinary-hosted studio reel or a seasonal visual essay.</p></div><div className="video-stage"><CloudinaryVideoPlayer className="hero-video" src={siteMedia.heroFilmUrl} title="INKPROWL studio reel" /><div className="video-note">The owner adds a stable Cloudinary video URL to the public catalog, then GitHub Pages publishes the player automatically.</div></div></section>
      {sponsoredCampaign.enabled && sponsoredCampaign.videoUrl && sponsoredCampaign.clientUrl && <section className="sponsor-film-section section-wrap"><div className="section-heading"><div><span className="eyebrow">{sponsoredCampaign.label}</span><h2>{sponsoredCampaign.clientName}</h2></div><p>Sponsored content. The visit control opens the approved client website in a new tab.</p></div><CloudinaryVideoPlayer className="sponsor-video" src={sponsoredCampaign.videoUrl} title={`${sponsoredCampaign.clientName} sponsored film`} clientUrl={sponsoredCampaign.clientUrl} clientName={sponsoredCampaign.clientName} /></section>}
      <section className="section-wrap light-section featured-section"><div className="section-heading"><div><span className="eyebrow">THE EDITOR’S DESK</span><h2>Featured works</h2></div><Link href="/gallery" className="text-link">View all works <ArrowRight size={16} /></Link></div><div className="feature-grid">{publishedArtworks.slice(0, 3).map((artwork, index) => <ArtworkCard key={artwork.slug} artwork={artwork} feature={index === 0} />)}</div></section>
      <AdSlot label="A considered home for a considered advertisement" />
      <section className="section-wrap categories-preview"><div className="section-heading"><div><span className="eyebrow">FIND YOUR PROWL</span><h2>Categories with<br /><em>character.</em></h2></div><Link href="/categories" className="text-link">All categories <ArrowRight size={16} /></Link></div><div className="category-strip">{categories.slice(0, 6).map((category, index) => <Link href={`/gallery?category=${encodeURIComponent(category.name)}`} key={category.name} className="category-poster"><span className="category-number">0{index + 1}</span><span className="category-icon">{category.icon}</span><strong>{category.name}</strong><small>{category.count} WORKS</small></Link>)}</div></section>
      <section className="manifesto"><div className="manifesto-rule" /><span className="eyebrow light">THE INKPROWL STANDARD</span><h2>Made to be <em>looked at slowly.</em></h2><p>Each piece is composed by a human eye, then crafted with generative tools and refined for collection. No noise. No generic stock imagery. Just character, line, and intent.</p></section>
    </PageFrame>
  );
}
