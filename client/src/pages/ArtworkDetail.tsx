import { ArrowLeft, Download, Film, LockKeyhole, Share2, Tag } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ArtworkCard, ArtworkVisual, AdSlot } from "@/components/ArtworkCard";
import { PageFrame } from "@/components/InkprowlChrome";
import { getArtwork, relatedArtworks } from "@/data/catalog";

export default function ArtworkDetail() {
  const [, params] = useRoute("/art/:slug");
  const artwork = getArtwork(params?.slug || "");
  const [shareStatus, setShareStatus] = useState("");
  if (!artwork) return <PageFrame><div className="not-found-copy"><h1>This edition has left the archive.</h1><Link href="/gallery" className="button-dark">Return to gallery</Link></div></PageFrame>;
  const related = relatedArtworks(artwork);
  const assetDownloadUrl = artwork.imageUrl?.replace("/upload/", "/upload/fl_attachment/");
  const shareArtwork = async () => {
    const shareData = { title: `${artwork.title} — INKPROWL`, text: artwork.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied");
        window.setTimeout(() => setShareStatus(""), 1800);
      }
    } catch {
      setShareStatus("");
    }
  };
  return <PageFrame><section className="detail-wrap"><Link href="/gallery" className="back-link"><ArrowLeft size={16} /> Back to gallery</Link><div className="detail-grid"><div className="detail-art"><ArtworkVisual artwork={artwork} large /></div><div className="detail-copy"><div className="eyebrow"><Tag size={14} /> {artwork.category}</div><h1>{artwork.title}</h1><p>{artwork.description}</p><div className="detail-divider" /><dl><div><dt>FORMAT</dt><dd>High-resolution digital edition</dd></div><div><dt>STYLE</dt><dd>Vintage line art / cross-hatching</dd></div><div><dt>DELIVERY</dt><dd>{artwork.isPremium ? "Collector access required" : "Direct download"}</dd></div></dl>{artwork.isPremium ? <button className="button-dark wide"><LockKeyhole size={17} /> Request collector access</button> : assetDownloadUrl ? <a className="button-outline wide" href={assetDownloadUrl} download><Download size={17} /> Free download</a> : <button className="button-outline wide" onClick={() => setShareStatus("This edition is being prepared in Cloudinary.")}><Download size={17} /> Prepare download</button>}<button type="button" className="share-button" onClick={shareArtwork}><Share2 size={15} /> Share this edition</button>{shareStatus && <span className="detail-action-status" role="status">{shareStatus}</span>}<small className="detail-note">Media delivery is served exclusively from Cloudinary once the edition has been published by the owner.</small></div></div></section><AdSlot label="A refined placement beside a collectible edition" /><section className="detail-video section-wrap"><div><span className="eyebrow">IN MOTION</span><h2>Watch the<br /><em>edition evolve.</em></h2><p>Each artwork detail page can feature a Cloudinary-hosted film, interview, or short process reel.</p></div><div className="detail-video-frame"><Film size={26} /><span>Cloudinary video player</span></div></section>{related.length > 0 && <section className="section-wrap related-section"><div className="section-heading"><div><span className="eyebrow">FROM THE SAME CASE</span><h2>Related artwork</h2></div></div><div className="related-grid">{related.map((item) => <ArtworkCard key={item.slug} artwork={item} />)}</div></section>}</PageFrame>;
}
