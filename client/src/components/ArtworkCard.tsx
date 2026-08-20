import { Download, LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import type { Artwork } from "@/data/catalog";

export function ArtworkVisual({ artwork, large = false }: { artwork: Artwork; large?: boolean }) {
  if (artwork.imageUrl) return <img src={artwork.imageUrl} alt={artwork.title} className="art-image" />;
  return (
    <div className={`art-placeholder ${artwork.accent} ${artwork.orientation} ${large ? "large" : ""}`} aria-label={`${artwork.title} visual placeholder awaiting Cloudinary source`}>
      <div className="placeholder-halo" />
      <div className="placeholder-ink">{artwork.title.split(" ")[0].slice(0, 2).toUpperCase()}</div>
      <div className="placeholder-lines" />
      <span>INKPROWL<br />ORIGINAL</span>
    </div>
  );
}

export function ArtworkCard({ artwork, feature = false }: { artwork: Artwork; feature?: boolean }) {
  return (
    <article className={`art-card ${feature ? "art-card-feature" : ""}`}>
      <Link href={`/art/${artwork.slug}`} className="art-card-image"><ArtworkVisual artwork={artwork} large={feature} />{artwork.isPremium && <span className="edition-badge premium"><LockKeyhole size={12} /> PREMIUM</span>}</Link>
      <div className="art-card-copy">
        <div className="art-meta"><span>{artwork.category}</span><span>{artwork.isPremium ? "Edition" : "Free use"}</span></div>
        <Link href={`/art/${artwork.slug}`} className="art-title">{artwork.title}</Link>
        <div className="art-card-actions"><span>{artwork.isPremium ? "Collector access" : "Free download"}</span>{artwork.isPremium ? <LockKeyhole size={15} /> : <Download size={16} />}</div>
      </div>
    </article>
  );
}

export function AdSlot({ label = "Collectible editions deserve a generous frame" }: { label?: string }) {
  return <aside className="ad-slot" aria-label="Advertisement placement"><span>ADVERTISEMENT</span><strong>{label}</strong><small>Ad placement can be enabled by the owner from the GitHub management workspace.</small></aside>;
}
