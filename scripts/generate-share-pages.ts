import fs from "node:fs";
import path from "node:path";
import { getArtworkShareUrl, publishedArtworks, siteBranding } from "../client/src/data/catalog";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(projectRoot, "client", "public", "art");
const fallbackPreview = publishedArtworks.find((artwork) => artwork.imageUrl)?.imageUrl ?? "";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

fs.rmSync(outputRoot, { recursive: true, force: true });

for (const artwork of publishedArtworks) {
  const shareUrl = getArtworkShareUrl(artwork.slug);
  const imageUrl = artwork.imageUrl ?? siteBranding.heroBannerUrl ?? fallbackPreview;
  const title = `${artwork.title} — INKPROWL`;
  const description = `${artwork.description} Browse and download this free INKPROWL edition.`;
  const redirectUrl = `https://inkprowl.github.io/inkprowl/#/art/${artwork.slug}`;
  const destination = path.join(outputRoot, artwork.slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, "index.html"), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${shareUrl}">
<meta property="og:type" content="website"><meta property="og:site_name" content="INKPROWL"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${shareUrl}"><meta property="og:image" content="${imageUrl}"><meta property="og:image:alt" content="${escapeHtml(artwork.title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${imageUrl}">
<meta http-equiv="refresh" content="0; url=${redirectUrl}">
</head><body><p>Opening <a href="${redirectUrl}">${escapeHtml(title)}</a>…</p><script>window.location.replace(${JSON.stringify(redirectUrl)});</script></body></html>`, "utf8");
}

console.log(`Generated ${publishedArtworks.length} INKPROWL social preview pages.`);
