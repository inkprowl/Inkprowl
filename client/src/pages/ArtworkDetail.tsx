import { ArrowLeft, Download, Share2, Tag } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ArtworkCard, ArtworkVisual, AdSlot } from "@/components/ArtworkCard";
import { CloudinaryVideoPlayer, PageFrame } from "@/components/InkprowlChrome";
import { availableDownloadFormats, getArtwork, getArtworkShareUrl, getCloudinaryDownloadUrl, relatedArtworks, siteMedia, type DownloadFormat } from "@/data/catalog";

export default function ArtworkDetail() {
  const [, params] = useRoute("/art/:slug");
  const artwork = getArtwork(params?.slug || "");
  const [shareStatus, setShareStatus] = useState("");
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("jpg");

  if (!artwork) return <PageFrame><div className="not-found-copy"><h1>This edition has left the archive.</h1><Link href="/gallery" className="button-dark">Return to gallery</Link></div></PageFrame>;

  const related = relatedArtworks(artwork);
  const formats = availableDownloadFormats(artwork);
  const downloadUrl = getCloudinaryDownloadUrl(artwork.imageUrl, artwork.slug, downloadFormat);
  const shareUrl = getArtworkShareUrl(artwork.slug);
  const shareText = `${artwork.title} — INKPROWL`;
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Share link copied");
      window.setTimeout(() => setShareStatus(""), 1800);
    } catch { setShareStatus("Copy this link from the address bar"); }
  };
  const nativeShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: shareText, text: artwork.description, url: shareUrl });
      else await copyShareUrl();
    } catch { setShareStatus(""); }
  };
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return <PageFrame>
    <section className="detail-wrap">
      <Link href="/gallery" className="back-link"><ArrowLeft size={16} /> Back to gallery</Link>
      <div className="detail-grid">
        <div className="detail-art"><ArtworkVisual artwork={artwork} large /></div>
        <div className="detail-copy">
          <div className="eyebrow"><Tag size={14} /> {artwork.category}</div>
          <h1>{artwork.title}</h1><p>{artwork.description}</p><div className="detail-divider" />
          <dl><div><dt>FORMAT</dt><dd>High-resolution digital edition</dd></div><div><dt>STYLE</dt><dd>Vintage line art / cross-hatching</dd></div><div><dt>DELIVERY</dt><dd>Direct Cloudinary download</dd></div></dl>
          {downloadUrl ? <div className="download-panel"><span className="eyebrow">CHOOSE YOUR FILE</span><div className="format-picker" aria-label="Download format">{formats.map((format) => <button type="button" key={format} onClick={() => setDownloadFormat(format)} className={downloadFormat === format ? "selected" : ""}>{format.toUpperCase()}</button>)}</div><a className="button-outline wide" href={downloadUrl}><Download size={17} /> Free {downloadFormat.toUpperCase()} download</a></div> : <button className="button-outline wide" onClick={() => setShareStatus("This edition is being prepared in Cloudinary.")}><Download size={17} /> Prepare download</button>}
          <div className="share-cluster"><button type="button" className="share-button" onClick={nativeShare}><Share2 size={15} /> Share this edition</button><a href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer">X</a><button type="button" onClick={copyShareUrl}>Copy link</button></div>
          {shareStatus && <span className="detail-action-status" role="status">{shareStatus}</span>}
          <small className="detail-note">Shared edition links open a dedicated preview page with the artwork image, title, and description before landing in the INKPROWL archive.</small>
        </div>
      </div>
    </section>
    <AdSlot label="A refined placement beside a collectible edition" />
    <section className="detail-video section-wrap"><div><span className="eyebrow">IN MOTION</span><h2>Watch the<br /><em>edition evolve.</em></h2><p>Each artwork detail page can feature a Cloudinary-hosted film, interview, or short process reel.</p></div><CloudinaryVideoPlayer className="detail-video-frame" src={artwork.videoUrl ?? siteMedia.defaultArtworkFilmUrl} title={`${artwork.title} film`} /></section>
    {related.length > 0 && <section className="section-wrap related-section"><div className="section-heading"><div><span className="eyebrow">FROM THE SAME CASE</span><h2>Related artwork</h2></div></div><div className="related-grid">{related.map((item) => <ArtworkCard key={item.slug} artwork={item} />)}</div></section>}
  </PageFrame>;
}
