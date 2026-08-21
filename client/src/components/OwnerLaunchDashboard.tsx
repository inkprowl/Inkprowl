import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Film, ImagePlus, LoaderCircle, LogOut, Music2, Pencil, Plus, Save, Tags, Trash2, UploadCloud, XCircle } from "lucide-react";
import { artworks, categories } from "@/data/catalog";
import { GENERATED_CATALOGUE_PATH, type ManagedCloudinaryAsset, type OwnerGeneratedCatalogue, dispatchCloudinaryDeletion, normalizeOwnerCatalogue, queueIncomingFile, readRepositoryJson, writeRepositoryJson } from "@/lib/githubOwnerSession";
import { applyCategoryOperation, resolvedCategoryNames } from "@/lib/ownerCatalogueOps";

type OwnerConnection = { token: string; identity: { login: string } };
type PublishRole = "artwork" | "soundtrack" | "sponsor-video" | "logo" | "hero-banner";
type PublishState = { percent: number; tone: "idle" | "working" | "success" | "error"; message: string };
type InventoryArtwork = { slug: string; title: string; description: string; category: string; tags: string[]; imageUrl: string };
type PendingPublish = { role: PublishRole; files: File[]; title: string; category: string; description?: string; tags?: string[] };
type PendingMutation = { message: string; success: string; mutate: (next: OwnerGeneratedCatalogue) => void };
type PendingDeletion = { assetKey: string; artwork?: InventoryArtwork };

const initialState: PublishState = { percent: 0, tone: "idle", message: "Choose a file, review its filename-derived details, then select Upload & Publish." };

function titleFromFilename(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function descriptionFromFilename(title: string, category: string) {
  return `A free INKPROWL ${category.toLowerCase()} edition featuring ${title}. Available in JPEG, PNG, and WebP directly from permanent Cloudinary storage.`;
}

function tagsFromFilename(title: string, category: string) {
  return Array.from(new Set([...title.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2), ...category.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2), "inkprowl", "animal art"])).slice(0, 8);
}

function cloudinaryAssetFromDeliveryUrl(url: string): ManagedCloudinaryAsset | null {
  try {
    const parsed = new URL(url);
    const marker = "/upload/";
    const resourceType = parsed.pathname.includes("/video/upload/") ? "video" : parsed.pathname.includes("/image/upload/") ? "image" : null;
    const tail = parsed.pathname.split(marker)[1];
    if (!resourceType || !tail) return null;
    const segments = tail.split("/");
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicPath = (versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments).join("/").replace(/\.[^.]+$/, "");
    return publicPath ? { publicId: decodeURIComponent(publicPath), resourceType, deliveryUrl: url } : null;
  } catch { return null; }
}

function slug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fileExtension(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "";
}

function filenameFor(role: PublishRole, file: File, title: string, category: string) {
  const extension = fileExtension(file.name);
  if (!extension) throw new Error(`${file.name} needs a valid file extension.`);
  const recordTitle = slug(title || titleFromFilename(file.name));
  if (!recordTitle) throw new Error("Enter a title before publishing.");
  if (role === "artwork") return `art--${slug(category)}--${recordTitle}.${extension}`;
  if (role === "soundtrack") return `song--${recordTitle}.${extension}`;
  if (role === "sponsor-video") return `sponsor-video--${recordTitle}.${extension}`;
  if (role === "logo") return `logo--${recordTitle}.${extension}`;
  return `hero-banner--${recordTitle}.${extension}`;
}

export function OwnerLaunchDashboard({ connection, requestAuthorization, onLogout }: { connection: OwnerConnection | null; requestAuthorization: () => void; onLogout: () => void }) {
  const [catalogue, setCatalogue] = useState<OwnerGeneratedCatalogue | null>(null);
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [artworkDescription, setArtworkDescription] = useState("");
  const [artworkTags, setArtworkTags] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [logoTitle, setLogoTitle] = useState("");
  const [heroBannerTitle, setHeroBannerTitle] = useState("");
  const [artworkCategory, setArtworkCategory] = useState(categories[0]?.name ?? "Business Animals");
  const [status, setStatus] = useState<PublishState>(initialState);
  const [pendingPublish, setPendingPublish] = useState<PendingPublish | null>(null);
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(artworks[0]?.slug ?? "");
  const artworkInventory = useMemo<InventoryArtwork[]>(() => {
    const items = new Map<string, InventoryArtwork>(artworks.map((artwork) => [artwork.slug, { slug: artwork.slug, title: artwork.title, description: artwork.description, category: artwork.category, tags: artwork.tags, imageUrl: artwork.imageUrl ?? "" }]));
    for (const record of catalogue?.artworks ?? []) {
      const slugValue = typeof record.slug === "string" ? record.slug : "";
      const imageUrl = typeof record.imageUrl === "string" ? record.imageUrl : "";
      if (!slugValue || !imageUrl) continue;
      items.set(slugValue, {
        slug: slugValue,
        title: typeof record.title === "string" ? record.title : titleFromFilename(slugValue),
        description: typeof record.description === "string" ? record.description : "Cloudinary-synced INKPROWL edition.",
        category: typeof record.category === "string" ? record.category : categories[0]?.name ?? "Uncategorized",
        tags: Array.isArray(record.tags) ? record.tags.filter((tag): tag is string => typeof tag === "string") : [],
        imageUrl,
      });
    }
    return Array.from(items.values());
  }, [catalogue]);
  const selectedArtwork = artworkInventory.find((artwork) => artwork.slug === selectedSlug) ?? artworkInventory[0];
  const [editTitle, setEditTitle] = useState(selectedArtwork?.title ?? "");
  const [editDescription, setEditDescription] = useState(selectedArtwork?.description ?? "");
  const [editCategory, setEditCategory] = useState(selectedArtwork?.category ?? categories[0]?.name ?? "Business Animals");
  const [editTags, setEditTags] = useState(selectedArtwork?.tags.join(", ") ?? "");
  const [categoryMode, setCategoryMode] = useState<"add" | "rename" | "retire">("add");
  const [categorySource, setCategorySource] = useState(categories[0]?.name ?? "Business Animals");
  const [categoryLabel, setCategoryLabel] = useState("");

  const categoryNames = useMemo(() => resolvedCategoryNames(categories.map((category) => category.name), catalogue ?? normalizeOwnerCatalogue({})), [catalogue]);
  const managedAssets = useMemo(() => Object.entries(catalogue?.assets ?? {}), [catalogue]);
  const selectedArtworkIsPublished = catalogue?.artworkOverrides[selectedArtwork?.slug ?? ""]?.isPublished !== false;
  const selectedArtworkAssetKey = selectedArtwork ? `artwork:${selectedArtwork.slug}` : "";

  useEffect(() => {
    if (!selectedArtwork) return;
    const override = catalogue?.artworkOverrides[selectedArtwork.slug] ?? {};
    setEditTitle(String(override.title ?? selectedArtwork.title));
    setEditDescription(String(override.description ?? selectedArtwork.description));
    setEditCategory(String(override.category ?? selectedArtwork.category));
    setEditTags(Array.isArray(override.tags) ? override.tags.join(", ") : selectedArtwork.tags.join(", "));
  }, [selectedArtwork?.slug, catalogue]);

  useEffect(() => {
    if (!connection) return;
    void readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(connection.token, GENERATED_CATALOGUE_PATH)
      .then((document) => setCatalogue(normalizeOwnerCatalogue(document.value)))
      .catch((reason) => setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "Could not load the current owner catalogue." }));
  }, [connection]);

  async function saveCatalogueMutation({ message, success, mutate }: PendingMutation, activeConnection: OwnerConnection) {
    try {
      setStatus({ percent: 25, tone: "working", message: "Saving your permanent catalogue change…" });
      const document = await readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(activeConnection.token, GENERATED_CATALOGUE_PATH);
      const next = normalizeOwnerCatalogue(document.value);
      mutate(next);
      await writeRepositoryJson(activeConnection.token, GENERATED_CATALOGUE_PATH, next, message, document.sha);
      setCatalogue(next);
      setStatus({ percent: 100, tone: "success", message: `${success} GitHub Pages will rebuild automatically from this permanent catalogue commit.` });
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The permanent catalogue change could not be saved." });
    }
  }

  async function mutateCatalogue(message: string, success: string, mutate: (next: OwnerGeneratedCatalogue) => void) {
    const nextMutation = { message, success, mutate };
    if (!connection) {
      setPendingMutation(() => nextMutation);
      setStatus({ percent: 5, tone: "working", message: "Authorise this save once. Your category or artwork change will be saved automatically when authorisation is confirmed." });
      requestAuthorization();
      return;
    }
    await saveCatalogueMutation(nextMutation, connection);
  }

  function publishValidationMessage(role: PublishRole, files: File[]) {
    if (!files.length) return `Choose ${role === "artwork" ? "at least one image" : role === "soundtrack" ? "one song" : role === "sponsor-video" ? "one sponsor video" : role === "logo" ? "one logo image" : "one hero banner image"} first.`;
    if (role !== "artwork" && files.length !== 1) return "Select one file for this media placement.";
    const invalid = files.find((file) => file.size > 85 * 1024 * 1024 || !file.type.startsWith(role === "soundtrack" ? "audio/" : role === "sponsor-video" ? "video/" : "image/"));
    return invalid ? `${invalid.name} has the wrong file type or exceeds the 85 MB upload limit.` : "";
  }

  async function queuePublish({ role, files, title, category, description, tags }: PendingPublish, activeConnection: OwnerConnection) {
    try {
      setStatus({ percent: 8, tone: "working", message: "Preparing the secure publish handoff…" });
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]!;
        const derivedTitle = files.length === 1 ? title : titleFromFilename(file.name);
        const incomingFilename = filenameFor(role, file, derivedTitle, category);
        setStatus({ percent: Math.round(15 + (index / files.length) * 65), tone: "working", message: `Uploading ${file.name} to the protected publish handoff…` });
        await queueIncomingFile(activeConnection.token, incomingFilename, file);
      }
      if (role === "artwork") {
        setStatus({ percent: 88, tone: "working", message: "Saving filename-derived artwork title, description, tags, and metadata…" });
        const document = await readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(activeConnection.token, GENERATED_CATALOGUE_PATH);
        const next = normalizeOwnerCatalogue(document.value);
        for (const file of files) {
          const derivedTitle = files.length === 1 ? title : titleFromFilename(file.name);
          const derivedDescription = files.length === 1 ? description || descriptionFromFilename(derivedTitle, category) : descriptionFromFilename(derivedTitle, category);
          const derivedTags = files.length === 1 && tags?.length ? tags : tagsFromFilename(derivedTitle, category);
          const artworkSlug = slug(derivedTitle);
          next.artworkOverrides[artworkSlug] = {
            ...(next.artworkOverrides[artworkSlug] ?? {}),
            title: derivedTitle,
            description: derivedDescription,
            category,
            tags: derivedTags,
            metaTitle: `INKPROWL — ${derivedTitle}`,
            metaDescription: derivedDescription.slice(0, 155),
          };
        }
        await writeRepositoryJson(activeConnection.token, GENERATED_CATALOGUE_PATH, next, "chore: save INKPROWL artwork upload metadata", document.sha);
        setCatalogue(next);
      }
      setStatus({ percent: 100, tone: "success", message: `${files.length} ${files.length === 1 ? "file is" : "files are"} queued. The protected workflow now transfers it to permanent Cloudinary storage, writes the delivery URL to the catalogue, and rebuilds the public site.` });
      if (role === "artwork") { setArtworkFiles([]); setArtworkTitle(""); setArtworkDescription(""); setArtworkTags(""); }
      if (role === "soundtrack") { setSongFile(null); setSongTitle(""); }
      if (role === "sponsor-video") { setVideoFile(null); setVideoTitle(""); }
      if (role === "logo") { setLogoFile(null); setLogoTitle(""); }
      if (role === "hero-banner") { setHeroBannerFile(null); setHeroBannerTitle(""); }
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The upload handoff failed. Your media was not published." });
    }
  }

  async function publish(role: PublishRole, files: File[], title: string) {
    const message = publishValidationMessage(role, files);
    if (message) { setStatus({ percent: 0, tone: "error", message }); return; }
    const nextPublish = { role, files, title, category: artworkCategory, description: artworkDescription, tags: artworkTags.split(",").map((tag) => tag.trim()).filter(Boolean) };
    if (!connection) {
      setPendingPublish(nextPublish);
      setStatus({ percent: 5, tone: "working", message: "Authorise this upload once. Your selected file will start uploading automatically as soon as authorisation is confirmed." });
      requestAuthorization();
      return;
    }
    await queuePublish(nextPublish, connection);
  }

  useEffect(() => {
    if (!connection || !pendingPublish) return;
    const nextPublish = pendingPublish;
    setPendingPublish(null);
    void queuePublish(nextPublish, connection);
  }, [connection, pendingPublish]);

  useEffect(() => {
    if (!connection || !pendingMutation) return;
    const nextMutation = pendingMutation;
    setPendingMutation(null);
    void saveCatalogueMutation(nextMutation, connection);
  }, [connection, pendingMutation]);

  useEffect(() => {
    if (!connection || !pendingDeletion) return;
    const nextDeletion = pendingDeletion;
    setPendingDeletion(null);
    if (nextDeletion.artwork) void removeSelectedArtwork(nextDeletion.artwork);
    else void removeManagedAsset(nextDeletion.assetKey);
  }, [connection, pendingDeletion]);

  function chooseArtworkFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setArtworkFiles(files);
    if (files.length === 1) {
      const nextTitle = titleFromFilename(files[0]!.name);
      setArtworkTitle(nextTitle);
      setArtworkDescription(descriptionFromFilename(nextTitle, artworkCategory));
      setArtworkTags(tagsFromFilename(nextTitle, artworkCategory).join(", "));
    } else { setArtworkTitle(""); setArtworkDescription(""); setArtworkTags(""); }
  }

  async function removeManagedAsset(assetKey: string) {
    if (!connection) {
      setPendingDeletion({ assetKey });
      setStatus({ percent: 5, tone: "working", message: "Authorise this deletion once. The selected Cloudinary removal will begin automatically when authorisation is confirmed." });
      requestAuthorization();
      return;
    }
    try {
      setStatus({ percent: 45, tone: "working", message: "Requesting permanent Cloudinary removal…" });
      await dispatchCloudinaryDeletion(connection.token, assetKey);
      setStatus({ percent: 100, tone: "success", message: "Removal requested. The protected workflow will delete the Cloudinary asset, update the catalogue, and rebuild the site." });
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The permanent removal request failed." });
    }
  }

  async function removeSelectedArtwork(artwork = selectedArtwork) {
    if (!artwork) return;
    const assetKey = `artwork:${artwork.slug}`;
    if (!connection) {
      setPendingDeletion({ assetKey, artwork });
      setStatus({ percent: 5, tone: "working", message: "Authorise this deletion once. The selected image removal will begin automatically when authorisation is confirmed." });
      requestAuthorization();
      return;
    }
    if (!catalogue?.assets[assetKey]) {
      const asset = cloudinaryAssetFromDeliveryUrl(artwork.imageUrl);
      if (!asset) { setStatus({ percent: 0, tone: "error", message: "This image does not have a removable Cloudinary delivery record." }); return; }
      try {
        setStatus({ percent: 18, tone: "working", message: "Preparing the permanent Cloudinary image deletion…" });
        const document = await readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(connection.token, GENERATED_CATALOGUE_PATH);
        const next = normalizeOwnerCatalogue(document.value);
        next.assets[assetKey] = asset;
        await writeRepositoryJson(connection.token, GENERATED_CATALOGUE_PATH, next, "chore: register INKPROWL artwork for Cloudinary removal", document.sha);
        setCatalogue(next);
      } catch (reason) {
        setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The image could not be prepared for Cloudinary deletion." });
        return;
      }
    }
    await removeManagedAsset(assetKey);
  }

  return <main className="owner-launch-dashboard" aria-label="INKPROWL media publishing dashboard">
    <header className="owner-launch-topbar"><div className="owner-desk-brand"><span className="brand-seal">IP</span><span>INKPROWL</span></div><span>OWNER ADMIN / CLOUDINARY DELIVERY</span><button type="button" className="owner-logout" onClick={onLogout}><LogOut size={15} /> Log out</button></header>
    <div className="owner-launch-heading"><div><span className="eyebrow">UPLOAD & PUBLISH</span><h3>Your permanent<br /><em>media desk.</em></h3><p>Choose files from your device. File names create draft titles; you can refine artwork content before publishing.</p></div><div className="owner-publish-session"><strong>{connection ? `Publishing ready · ${connection.identity.login}` : "Ready for your first save"}</strong><small>{connection ? "Your owner connection stays ready during this browser session." : "Your selected upload, save, or deletion starts automatically after the one-time owner connection."}</small></div></div>
    <div className={`owner-publish-status ${status.tone}`} aria-live="polite"><div><span>{status.tone === "success" ? <CheckCircle2 size={17} /> : status.tone === "error" ? <XCircle size={17} /> : status.tone === "working" ? <LoaderCircle size={17} /> : <UploadCloud size={17} />}</span><p>{status.message}</p></div><progress value={status.percent} max="100" aria-label="Publishing progress" /></div>
    <div className="owner-upload-grid">
      <article className="owner-upload-card"><div className="owner-upload-icon"><ImagePlus size={22} /></div><span className="eyebrow">ARTWORK IMAGES</span><h4>Images Upload & Publish</h4><p>PNG, JPG, JPEG, WebP, or image files. Select multiple images for a batch upload.</p><label className="launch-file-picker"><input type="file" accept="image/*" multiple onChange={chooseArtworkFiles} /><span>{artworkFiles.length ? `${artworkFiles.length} image${artworkFiles.length === 1 ? "" : "s"} selected` : "Choose artwork image files"}</span></label><label>Title <input value={artworkTitle} disabled={artworkFiles.length > 1} onChange={(event) => setArtworkTitle(event.target.value)} placeholder={artworkFiles.length > 1 ? "Filename-derived for each file" : "Auto-generated from filename"} /></label><label>Category <select value={artworkCategory} onChange={(event) => { const nextCategory = event.target.value; setArtworkCategory(nextCategory); if (artworkTitle) { setArtworkDescription(descriptionFromFilename(artworkTitle, nextCategory)); setArtworkTags(tagsFromFilename(artworkTitle, nextCategory).join(", ")); } }}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label>{artworkFiles.length === 1 && <><label>Description <textarea rows={3} value={artworkDescription} onChange={(event) => setArtworkDescription(event.target.value)} placeholder="Auto-generated from filename" /></label><label>Tags <input value={artworkTags} onChange={(event) => setArtworkTags(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="meta-preview"><strong>Automatic public metadata</strong><span>Meta title: INKPROWL — {artworkTitle}</span><span>Meta description: {(artworkDescription || descriptionFromFilename(artworkTitle, artworkCategory)).slice(0, 155)}</span></div></>}<button type="button" className="admin-primary-action" onClick={() => void publish("artwork", artworkFiles, artworkTitle)}><UploadCloud size={16} /> Upload & Publish images</button></article>
      <article className="owner-upload-card"><div className="owner-upload-icon"><Music2 size={22} /></div><span className="eyebrow">FLOATING MUSIC PLAYER</span><h4>Song Upload & Publish</h4><p>Upload one MP3, WAV, M4A, or audio file for the public movable music player.</p><label className="launch-file-picker"><input type="file" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0] ?? null; setSongFile(file); if (file) setSongTitle(titleFromFilename(file.name)); }} /><span>{songFile?.name ?? "Choose your song file"}</span></label><label>Song title <input value={songTitle} onChange={(event) => setSongTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("soundtrack", songFile ? [songFile] : [], songTitle)}><Music2 size={16} /> Upload & Publish song</button></article>
      <article className="owner-upload-card"><div className="owner-upload-icon"><Film size={22} /></div><span className="eyebrow">SPONSORED VIDEO PLAYER</span><h4>Video Upload & Publish</h4><p>Upload one landscape video file for the public sponsor stage and individual artwork film fallback.</p><label className="launch-file-picker"><input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0] ?? null; setVideoFile(file); if (file) setVideoTitle(titleFromFilename(file.name)); }} /><span>{videoFile?.name ?? "Choose sponsor video file"}</span></label><label>Campaign title <input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("sponsor-video", videoFile ? [videoFile] : [], videoTitle)}><Film size={16} /> Upload & Publish video</button></article>
      <article className="owner-upload-card owner-brand-upload-card"><div className="owner-upload-icon"><ImagePlus size={22} /></div><span className="eyebrow">BRAND STUDIO</span><h4>Logo Upload & Publish</h4><p>Choose the INKPROWL logo from your device. PNG, JPG, WebP, or AVIF is queued directly for permanent Cloudinary delivery.</p><label className="launch-file-picker"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0] ?? null; setLogoFile(file); if (file) setLogoTitle(titleFromFilename(file.name)); }} /><span>{logoFile?.name ?? "Choose INKPROWL logo file"}</span></label><label>Logo label <input value={logoTitle} onChange={(event) => setLogoTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("logo", logoFile ? [logoFile] : [], logoTitle)}><UploadCloud size={16} /> Upload & Publish logo</button></article>
      <article className="owner-upload-card owner-brand-upload-card"><div className="owner-upload-icon"><ImagePlus size={22} /></div><span className="eyebrow">BRAND STUDIO</span><h4>Hero Banner Upload & Publish</h4><p>Choose the homepage hero banner from your device. PNG, JPG, WebP, or AVIF is queued directly for permanent Cloudinary delivery.</p><label className="launch-file-picker"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0] ?? null; setHeroBannerFile(file); if (file) setHeroBannerTitle(titleFromFilename(file.name)); }} /><span>{heroBannerFile?.name ?? "Choose hero banner file"}</span></label><label>Banner label <input value={heroBannerTitle} onChange={(event) => setHeroBannerTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("hero-banner", heroBannerFile ? [heroBannerFile] : [], heroBannerTitle)}><UploadCloud size={16} /> Upload & Publish hero banner</button></article>
    </div>
    <div className="owner-management-grid"><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">ARTWORK INVENTORY</span><h4>Thumbnails, title & metadata</h4></div><span>{artworkInventory.length} editions</span></div><div className="owner-artwork-list">{artworkInventory.map((artwork) => <button type="button" key={artwork.slug} className={selectedSlug === artwork.slug ? "selected" : ""} onClick={() => setSelectedSlug(artwork.slug)}><img src={artwork.imageUrl} alt="" /><span><strong>{artwork.title}</strong><small>{artwork.category}</small></span><Pencil size={15} /></button>)}</div></article><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">EDIT SELECTED EDITION</span><h4>{selectedArtwork?.title}</h4></div></div><div className="owner-edit-form"><label>Title <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} /></label><label>Description <textarea rows={3} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} /></label><label>Category <select value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label><label>Tags <input value={editTags} onChange={(event) => setEditTags(event.target.value)} placeholder="vintage, animals, tailored" /></label><div className="meta-preview"><strong>Automatic public metadata</strong><span>Title: INKPROWL — {editTitle || selectedArtwork?.title}</span><span>Description: {(editDescription || selectedArtwork?.description || "").slice(0, 150)}</span></div><button type="button" className="admin-primary-action" onClick={() => void mutateCatalogue("chore: update INKPROWL artwork metadata", "Artwork title, description, category, tags, and public metadata are saved.", (next) => { if (!selectedArtwork) return; next.artworkOverrides[selectedArtwork.slug] = { ...(next.artworkOverrides[selectedArtwork.slug] ?? {}), title: editTitle.trim(), description: editDescription.trim(), category: editCategory, tags: editTags.split(",").map((tag) => tag.trim()).filter(Boolean), metaTitle: `INKPROWL — ${editTitle.trim()}`, metaDescription: editDescription.trim().slice(0, 155), isPublished: true }; })}><Save size={16} /> Save artwork details</button><button type="button" className="admin-secondary-action" onClick={() => void mutateCatalogue(selectedArtworkIsPublished ? "chore: unpublish INKPROWL artwork" : "chore: publish INKPROWL artwork", selectedArtworkIsPublished ? "Artwork is now hidden from the public gallery." : "Artwork is now published to the public gallery.", (next) => { if (!selectedArtwork) return; next.artworkOverrides[selectedArtwork.slug] = { ...(next.artworkOverrides[selectedArtwork.slug] ?? {}), isPublished: !selectedArtworkIsPublished }; })}>{selectedArtworkIsPublished ? "Hide from public gallery" : "Publish to public gallery"}</button><button type="button" className="admin-danger-action" onClick={() => void removeSelectedArtwork()}><Trash2 size={16} /> Delete image permanently</button><p className="owner-delete-note">This deletes the Cloudinary image and hides its edition from the public gallery after the protected workflow completes.</p></div></article></div>
    <div className="owner-management-grid"><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">CATEGORIES</span><h4>Add, rename, or delete</h4></div><Tags size={19} /></div><div className="owner-edit-form"><label>Action <select value={categoryMode} onChange={(event) => setCategoryMode(event.target.value as "add" | "rename" | "retire")}><option value="add">Add category</option><option value="rename">Rename category</option><option value="retire">Delete category and move editions</option></select></label>{categoryMode !== "add" && <label>Existing category <select value={categorySource} onChange={(event) => setCategorySource(event.target.value)}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label>}<label>{categoryMode === "retire" ? "Move editions to category" : "Category label"}<input value={categoryLabel} onChange={(event) => setCategoryLabel(event.target.value)} placeholder="e.g. Editorial Animals" /></label><button type="button" className="admin-primary-action" onClick={() => void mutateCatalogue("chore: update INKPROWL categories", categoryMode === "add" ? "Category added." : categoryMode === "rename" ? "Category renamed." : "Category deleted and editions moved.", (next) => { applyCategoryOperation(next, categories.map((category) => category.name), categoryMode, categorySource, categoryLabel); })}><Plus size={16} /> {categoryMode === "add" ? "Add category" : categoryMode === "rename" ? "Rename category" : "Delete category"}</button></div></article><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">PERMANENT ASSET REMOVAL</span><h4>Cloudinary-managed files</h4></div><Trash2 size={19} /></div>{managedAssets.length ? <div className="managed-asset-list">{managedAssets.map(([key, asset]) => <div key={key}><span><strong>{key}</strong><small>{asset.resourceType} · Cloudinary</small></span><button type="button" className="admin-danger-action" onClick={() => void removeManagedAsset(key)}><Trash2 size={14} /> Delete</button></div>)}</div> : <p className="empty-managed-assets">Authorise a save to load the managed Cloudinary asset inventory.</p>}</article></div>
  </main>;
}
