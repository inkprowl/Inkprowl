import fs from "node:fs";
import path from "node:path";
import { classifyIncomingFile } from "./cloudinary-filename-policy.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const incomingRoot = path.join(projectRoot, "incoming");
const cataloguePath = path.join(projectRoot, "client", "src", "data", "generated-catalog.json");
const operation = process.argv[2] ?? "sync";
const requestedAssetKey = process.argv[3];

const rawCloudinaryUrl = (process.env.CLOUDINARY_URL ?? "").trim();
const cloudinaryUrl = rawCloudinaryUrl.replace(/^CLOUDINARY_URL\s*=\s*/i, "");

if (!cloudinaryUrl || /<your_api_key>|<your_api_secret>|cloud_name/i.test(cloudinaryUrl)) {
  throw new Error("CLOUDINARY_URL is empty or still uses a placeholder. Save the real Cloudinary API Environment Variable as a repository Actions secret.");
}

let cloudinaryCredentials;
try {
  cloudinaryCredentials = new URL(cloudinaryUrl);
} catch {
  throw new Error("CLOUDINARY_URL must use the Cloudinary API Environment Variable format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME");
}

if (cloudinaryCredentials.protocol !== "cloudinary:" || !cloudinaryCredentials.username || !cloudinaryCredentials.password || !cloudinaryCredentials.hostname) {
  throw new Error("CLOUDINARY_URL must include an API key, API secret, and cloud name in the Cloudinary API Environment Variable format.");
}

process.env.CLOUDINARY_URL = cloudinaryUrl;
const { v2: cloudinary } = await import("cloudinary");

cloudinary.config({
  cloud_name: cloudinaryCredentials.hostname,
  api_key: decodeURIComponent(cloudinaryCredentials.username),
  api_secret: decodeURIComponent(cloudinaryCredentials.password),
  secure: true,
});

const readCatalogue = () => JSON.parse(fs.readFileSync(cataloguePath, "utf8"));
const writeCatalogue = (catalogue) => fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`);

const allFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const entryPath = path.join(directory, entry.name);
  if (entry.isDirectory()) return allFiles(entryPath);
  return entry.name === ".gitkeep" ? [] : [entryPath];
});

const assetRecord = (result) => ({
  publicId: result.public_id,
  resourceType: result.resource_type,
  deliveryUrl: result.secure_url,
});

function applyUpload(catalogue, asset, result) {
  const record = assetRecord(result);
  catalogue.assets ??= {};
  catalogue.artworks ??= [];
  catalogue.artworkOverrides ??= {};
  catalogue.artworkMedia ??= {};
  catalogue.siteMedia ??= {};
  catalogue.siteBranding ??= {};
  catalogue.sponsoredCampaign ??= {};
  catalogue.advertisingSettings ??= {};
  catalogue.categories ??= [];
  catalogue.categoryAliases ??= {};

  if (asset.kind === "artwork") {
    if (catalogue.artworks.some((artwork) => artwork.slug === asset.slug)) throw new Error(`A generated artwork already uses the slug ${asset.slug}. Choose a different filename or remove the old artwork first.`);
    const assetKey = `artwork:${asset.slug}`;
    catalogue.artworks.push({
      slug: asset.slug,
      title: asset.title,
      category: asset.category,
      description: `A free INKPROWL edition of ${asset.title}, published from the owner upload queue and ready for direct Cloudinary download.`,
      isPremium: false,
      accent: "gold",
      imageUrl: record.deliveryUrl,
      orientation: "square",
      tags: asset.tags,
      downloadFormats: ["jpg", "png", "webp"],
      assetKey,
    });
    catalogue.assets[assetKey] = record;
    return;
  }

  const key = asset.kind === "soundtrack" ? "siteMedia:soundtrack"
    : asset.kind === "hero-film" ? "siteMedia:heroFilm"
    : asset.kind === "hero-banner" ? "siteBranding:heroBanner"
    : asset.kind === "logo" ? "siteBranding:logo"
    : asset.kind === "sponsor-video" ? "sponsoredCampaign:video"
    : `artworkVideo:${asset.slug}`;
  catalogue.assets[key] = record;

  if (asset.kind === "soundtrack") Object.assign(catalogue.siteMedia, { soundtrackUrl: record.deliveryUrl, soundtrackTitle: asset.title });
  if (asset.kind === "hero-film") catalogue.siteMedia.heroFilmUrl = record.deliveryUrl;
  if (asset.kind === "hero-banner") catalogue.siteBranding.heroBannerUrl = record.deliveryUrl;
  if (asset.kind === "logo") catalogue.siteBranding.logoUrl = record.deliveryUrl;
  if (asset.kind === "sponsor-video") Object.assign(catalogue.sponsoredCampaign, { enabled: true, clientName: asset.clientName, videoUrl: record.deliveryUrl });
  if (asset.kind === "edition-video") Object.assign(catalogue.artworkMedia, { [asset.slug]: { ...(catalogue.artworkMedia[asset.slug] ?? {}), videoUrl: record.deliveryUrl } });
}

function removeAsset(catalogue, key) {
  const asset = catalogue.assets?.[key];
  if (!asset) throw new Error(`No managed Cloudinary asset uses the key ${key}. Open generated-catalog.json to copy an available asset key.`);
  return cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.resourceType, invalidate: true }).then(() => {
    if (key.startsWith("artwork:")) {
      const slug = key.slice("artwork:".length);
      catalogue.artworks = (catalogue.artworks ?? []).filter((artwork) => artwork.assetKey !== key);
      catalogue.artworkOverrides ??= {};
      catalogue.artworkOverrides[slug] = { ...(catalogue.artworkOverrides[slug] ?? {}), isPublished: false };
    }
    if (key.startsWith("artworkVideo:")) {
      const slug = key.slice("artworkVideo:".length);
      const current = catalogue.artworkMedia?.[slug] ?? {};
      delete current.videoUrl;
      if (Object.keys(current).length) catalogue.artworkMedia[slug] = current;
      else delete catalogue.artworkMedia[slug];
    }
    if (key === "siteMedia:soundtrack") { delete catalogue.siteMedia.soundtrackUrl; catalogue.siteMedia.soundtrackTitle = "Curated sound"; }
    if (key === "siteMedia:heroFilm") delete catalogue.siteMedia.heroFilmUrl;
    if (key === "siteBranding:heroBanner") delete catalogue.siteBranding.heroBannerUrl;
    if (key === "siteBranding:logo") delete catalogue.siteBranding.logoUrl;
    if (key === "sponsoredCampaign:video") { delete catalogue.sponsoredCampaign.videoUrl; catalogue.sponsoredCampaign.enabled = false; }
    delete catalogue.assets[key];
  });
}

async function main() {
  const catalogue = readCatalogue();
  if (operation === "delete") {
    if (!requestedAssetKey) throw new Error("Provide an asset key when running the delete operation.");
    await removeAsset(catalogue, requestedAssetKey);
    writeCatalogue(catalogue);
    console.log(`Deleted Cloudinary asset ${requestedAssetKey} and updated the generated catalogue.`);
    return;
  }

  if (operation !== "sync") throw new Error(`Unsupported operation: ${operation}`);
  const files = allFiles(incomingRoot);
  if (!files.length) { console.log("No incoming media files found."); return; }

  for (const file of files) {
    const asset = classifyIncomingFile(path.basename(file));
    const result = await cloudinary.uploader.upload(file, { resource_type: "auto", folder: "inkprowl", use_filename: true, unique_filename: true, overwrite: false });
    applyUpload(catalogue, asset, result);
    fs.rmSync(file);
    console.log(`Uploaded ${path.basename(file)} as ${result.public_id}.`);
  }
  writeCatalogue(catalogue);
}

await main();
