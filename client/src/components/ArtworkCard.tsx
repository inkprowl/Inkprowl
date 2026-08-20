import { Download } from "lucide-react";
import { Link } from "wouter";
import { activeAdvertisementProviders, advertisingSettings, type Artwork } from "@/data/catalog";

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
      <Link href={`/art/${artwork.slug}`} className="art-card-image"><ArtworkVisual artwork={artwork} large={feature} /></Link>
      <div className="art-card-copy">
        <div className="art-meta"><span>{artwork.category}</span><span>Free use</span></div>
        <Link href={`/art/${artwork.slug}`} className="art-title">{artwork.title}</Link>
        <div className="art-card-actions"><span>Free download</span><Download size={16} /></div>
      </div>
    </article>
  );
}

export function AdSlot({ label = "Collectible editions deserve a generous frame" }: { label?: string }) {
  const providers = activeAdvertisementProviders(advertisingSettings);
  const providerCopy = providers.length > 0
    ? `${providers.join(" + ")} placement enabled by the owner.`
    : "Placement held until the owner enables an approved provider in the GitHub workspace.";
  return <aside className="ad-slot" aria-label="Advertisement placement" data-providers={providers.join(",")}><span>{providers.length > 0 ? "ADVERTISEMENT" : "PLACEMENT HELD"}</span><strong>{label}</strong><small>{providerCopy}</small></aside>;
}
