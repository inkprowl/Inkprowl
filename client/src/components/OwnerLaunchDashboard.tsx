import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Film, ImagePlus, LoaderCircle, LogOut, Music2, Pencil, Plus, Save, Tags, Trash2, UploadCloud, XCircle } from "lucide-react";
import { artworks, categories } from "@/data/catalog";
import { GENERATED_CATALOGUE_PATH, type OwnerGeneratedCatalogue, dispatchCloudinaryDeletion, normalizeOwnerCatalogue, queueIncomingFile, readRepositoryJson, writeRepositoryJson } from "@/lib/githubOwnerSession";
import { applyCategoryOperation, resolvedCategoryNames } from "@/lib/ownerCatalogueOps";

type OwnerConnection = { token: string; identity: { login: string } };
type PublishRole = "artwork" | "soundtrack" | "sponsor-video";
type PublishState = { percent: number; tone: "idle" | "working" | "success" | "error"; message: string };

const initialState: PublishState = { percent: 0, tone: "idle", message: "Choose a file, review its filename-derived details, then select Upload & Publish." };

function titleFromFilename(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
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
  return `sponsor-video--${recordTitle}.${extension}`;
}

export function OwnerLaunchDashboard({ connection, requestAuthorization, onLogout }: { connection: OwnerConnection | null; requestAuthorization: () => void; onLogout: () => void }) {
  const [catalogue, setCatalogue] = useState<OwnerGeneratedCatalogue | null>(null);
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [artworkCategory, setArtworkCategory] = useState(categories[0]?.name ?? "Business Animals");
  const [status, setStatus] = useState<PublishState>(initialState);
  const [selectedSlug, setSelectedSlug] = useState(artworks[0]?.slug ?? "");
  const selectedArtwork = artworks.find((artwork) => artwork.slug === selectedSlug) ?? artworks[0];
  const [editTitle, setEditTitle] = useState(selectedArtwork?.title ?? "");
  const [editDescription, setEditDescription] = useState(selectedArtwork?.description ?? "");
  const [editCategory, setEditCategory] = useState(selectedArtwork?.category ?? categories[0]?.name ?? "Business Animals");
  const [editTags, setEditTags] = useState(selectedArtwork?.tags.join(", ") ?? "");
  const [categoryMode, setCategoryMode] = useState<"add" | "rename" | "retire">("add");
  const [categorySource, setCategorySource] = useState(categories[0]?.name ?? "Business Animals");
  const [categoryLabel, setCategoryLabel] = useState("");

  const categoryNames = useMemo(() => resolvedCategoryNames(categories.map((category) => category.name), catalogue ?? normalizeOwnerCatalogue({})), [catalogue]);
  const managedAssets = useMemo(() => Object.entries(catalogue?.assets ?? {}), [catalogue]);

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

  function requiresAuthorization() {
    if (connection) return false;
    setStatus({ percent: 0, tone: "idle", message: "Select Authorise this save once, then return to this visible dashboard and publish your selected files." });
    requestAuthorization();
    return true;
  }

  async function mutateCatalogue(message: string, success: string, mutate: (next: OwnerGeneratedCatalogue) => void) {
    if (requiresAuthorization() || !connection) return;
    try {
      setStatus({ percent: 25, tone: "working", message: "Saving your permanent catalogue change…" });
      const document = await readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(connection.token, GENERATED_CATALOGUE_PATH);
      const next = normalizeOwnerCatalogue(document.value);
      mutate(next);
      await writeRepositoryJson(connection.token, GENERATED_CATALOGUE_PATH, next, message, document.sha);
      setCatalogue(next);
      setStatus({ percent: 100, tone: "success", message: `${success} GitHub Pages will rebuild automatically from this permanent catalogue commit.` });
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The permanent catalogue change could not be saved." });
    }
  }

  async function publish(role: PublishRole, files: File[], title: string) {
    if (requiresAuthorization() || !connection) return;
    if (!files.length) { setStatus({ percent: 0, tone: "error", message: `Choose ${role === "artwork" ? "at least one image" : role === "soundtrack" ? "one song" : "one sponsor video"} first.` }); return; }
    if (role !== "artwork" && files.length !== 1) { setStatus({ percent: 0, tone: "error", message: "Select one file for this media placement." }); return; }
    const invalid = files.find((file) => file.size > 85 * 1024 * 1024 || !file.type.startsWith(role === "artwork" ? "image/" : role === "soundtrack" ? "audio/" : "video/"));
    if (invalid) { setStatus({ percent: 0, tone: "error", message: `${invalid.name} has the wrong file type or exceeds the 85 MB upload limit.` }); return; }
    try {
      setStatus({ percent: 8, tone: "working", message: "Preparing the secure publish handoff…" });
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]!;
        const derivedTitle = files.length === 1 ? title : titleFromFilename(file.name);
        const incomingFilename = filenameFor(role, file, derivedTitle, artworkCategory);
        setStatus({ percent: Math.round(15 + (index / files.length) * 65), tone: "working", message: `Uploading ${file.name} to the protected publish handoff…` });
        await queueIncomingFile(connection.token, incomingFilename, file);
      }
      setStatus({ percent: 100, tone: "success", message: `${files.length} ${files.length === 1 ? "file is" : "files are"} queued. The protected workflow now transfers it to permanent Cloudinary storage, writes the delivery URL to the catalogue, and rebuilds the public site.` });
      if (role === "artwork") { setArtworkFiles([]); setArtworkTitle(""); }
      if (role === "soundtrack") { setSongFile(null); setSongTitle(""); }
      if (role === "sponsor-video") { setVideoFile(null); setVideoTitle(""); }
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The upload handoff failed. Your media was not published." });
    }
  }

  function chooseArtworkFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setArtworkFiles(files);
    if (files.length === 1) setArtworkTitle(titleFromFilename(files[0]!.name));
  }

  async function removeManagedAsset(assetKey: string) {
    if (requiresAuthorization() || !connection) return;
    try {
      setStatus({ percent: 45, tone: "working", message: "Requesting permanent Cloudinary removal…" });
      await dispatchCloudinaryDeletion(connection.token, assetKey);
      setStatus({ percent: 100, tone: "success", message: "Removal requested. The protected workflow will delete the Cloudinary asset, update the catalogue, and rebuild the site." });
    } catch (reason) {
      setStatus({ percent: 0, tone: "error", message: reason instanceof Error ? reason.message : "The permanent removal request failed." });
    }
  }

  return <main className="owner-launch-dashboard" aria-label="INKPROWL media publishing dashboard">
    <header className="owner-launch-topbar"><div className="owner-desk-brand"><span className="brand-seal">IP</span><span>INKPROWL</span></div><span>OWNER ADMIN / CLOUDINARY DELIVERY</span><button type="button" className="owner-logout" onClick={onLogout}><LogOut size={15} /> Log out</button></header>
    <div className="owner-launch-heading"><div><span className="eyebrow">UPLOAD & PUBLISH</span><h3>Your permanent<br /><em>media desk.</em></h3><p>Choose files from your device. File names create draft titles; you can refine artwork content before publishing.</p></div><div className="owner-publish-session"><strong>{connection ? `Publishing session ready · ${connection.identity.login}` : "Publishing session ready when you save"}</strong><small>{connection ? "Your owner connection remains available during this browser session." : "Authorisation is requested only when you select an Upload & Publish or Save button."}</small></div></div>
    <div className={`owner-publish-status ${status.tone}`}><div><span>{status.tone === "success" ? <CheckCircle2 size={17} /> : status.tone === "error" ? <XCircle size={17} /> : status.tone === "working" ? <LoaderCircle size={17} /> : <UploadCloud size={17} />}</span><p>{status.message}</p></div><progress value={status.percent} max="100" aria-label="Publishing progress" /></div>
    <div className="owner-upload-grid">
      <article className="owner-upload-card"><div className="owner-upload-icon"><ImagePlus size={22} /></div><span className="eyebrow">ARTWORK IMAGES</span><h4>Images Upload & Publish</h4><p>PNG, JPG, JPEG, WebP, or image files. Select multiple images for a batch upload.</p><label className="launch-file-picker"><input type="file" accept="image/*" multiple onChange={chooseArtworkFiles} /><span>{artworkFiles.length ? `${artworkFiles.length} image${artworkFiles.length === 1 ? "" : "s"} selected` : "Choose artwork image files"}</span></label><label>Title <input value={artworkTitle} disabled={artworkFiles.length > 1} onChange={(event) => setArtworkTitle(event.target.value)} placeholder={artworkFiles.length > 1 ? "Filename-derived for each file" : "Auto-generated from filename"} /></label><label>Category <select value={artworkCategory} onChange={(event) => setArtworkCategory(event.target.value)}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label><button type="button" className="admin-primary-action" onClick={() => void publish("artwork", artworkFiles, artworkTitle)}><UploadCloud size={16} /> Upload & Publish images</button></article>
      <article className="owner-upload-card"><div className="owner-upload-icon"><Music2 size={22} /></div><span className="eyebrow">FLOATING MUSIC PLAYER</span><h4>Song Upload & Publish</h4><p>Upload one MP3, WAV, M4A, or audio file for the public movable music player.</p><label className="launch-file-picker"><input type="file" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0] ?? null; setSongFile(file); if (file) setSongTitle(titleFromFilename(file.name)); }} /><span>{songFile?.name ?? "Choose your song file"}</span></label><label>Song title <input value={songTitle} onChange={(event) => setSongTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("soundtrack", songFile ? [songFile] : [], songTitle)}><Music2 size={16} /> Upload & Publish song</button></article>
      <article className="owner-upload-card"><div className="owner-upload-icon"><Film size={22} /></div><span className="eyebrow">SPONSORED VIDEO PLAYER</span><h4>Video Upload & Publish</h4><p>Upload one landscape video file for the public sponsor stage and individual artwork film fallback.</p><label className="launch-file-picker"><input type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0] ?? null; setVideoFile(file); if (file) setVideoTitle(titleFromFilename(file.name)); }} /><span>{videoFile?.name ?? "Choose sponsor video file"}</span></label><label>Campaign title <input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} placeholder="Auto-generated from filename" /></label><div className="launch-spacer" /><button type="button" className="admin-primary-action" onClick={() => void publish("sponsor-video", videoFile ? [videoFile] : [], videoTitle)}><Film size={16} /> Upload & Publish video</button></article>
    </div>
    <div className="owner-management-grid"><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">ARTWORK INVENTORY</span><h4>Thumbnails, title & metadata</h4></div><span>{artworks.length} editions</span></div><div className="owner-artwork-list">{artworks.map((artwork) => <button type="button" key={artwork.slug} className={selectedSlug === artwork.slug ? "selected" : ""} onClick={() => setSelectedSlug(artwork.slug)}><img src={artwork.imageUrl} alt="" /><span><strong>{artwork.title}</strong><small>{artwork.category}</small></span><Pencil size={15} /></button>)}</div></article><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">EDIT SELECTED EDITION</span><h4>{selectedArtwork?.title}</h4></div></div><div className="owner-edit-form"><label>Title <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} /></label><label>Description <textarea rows={3} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} /></label><label>Category <select value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label><label>Tags <input value={editTags} onChange={(event) => setEditTags(event.target.value)} placeholder="vintage, animals, tailored" /></label><div className="meta-preview"><strong>Automatic public metadata</strong><span>Title: INKPROWL — {editTitle || selectedArtwork?.title}</span><span>Description: {(editDescription || selectedArtwork?.description || "").slice(0, 150)}</span></div><button type="button" className="admin-primary-action" onClick={() => void mutateCatalogue("chore: update INKPROWL artwork metadata", "Artwork title, description, category, tags, and public metadata are saved.", (next) => { if (!selectedArtwork) return; next.artworkOverrides[selectedArtwork.slug] = { ...(next.artworkOverrides[selectedArtwork.slug] ?? {}), title: editTitle.trim(), description: editDescription.trim(), category: editCategory, tags: editTags.split(",").map((tag) => tag.trim()).filter(Boolean), isPublished: true }; })}><Save size={16} /> Save artwork details</button><button type="button" className="admin-secondary-action" onClick={() => void mutateCatalogue("chore: unpublish INKPROWL artwork", "Artwork is now hidden from the public gallery.", (next) => { if (!selectedArtwork) return; next.artworkOverrides[selectedArtwork.slug] = { ...(next.artworkOverrides[selectedArtwork.slug] ?? {}), isPublished: false }; })}>Hide from public gallery</button></div></article></div>
    <div className="owner-management-grid"><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">CATEGORIES</span><h4>Add, rename, or retire</h4></div><Tags size={19} /></div><div className="owner-edit-form"><label>Action <select value={categoryMode} onChange={(event) => setCategoryMode(event.target.value as "add" | "rename" | "retire")}><option value="add">Add category</option><option value="rename">Rename category</option><option value="retire">Retire into another category</option></select></label>{categoryMode !== "add" && <label>Existing category <select value={categorySource} onChange={(event) => setCategorySource(event.target.value)}>{categoryNames.map((name) => <option key={name}>{name}</option>)}</select></label>}<label>{categoryMode === "retire" ? "Replacement category" : "Category label"}<input value={categoryLabel} onChange={(event) => setCategoryLabel(event.target.value)} placeholder="e.g. Editorial Animals" /></label><button type="button" className="admin-primary-action" onClick={() => void mutateCatalogue("chore: update INKPROWL categories", "Category change saved.", (next) => { applyCategoryOperation(next, categories.map((category) => category.name), categoryMode, categorySource, categoryLabel); })}><Plus size={16} /> Save category action</button></div></article><article className="owner-record-card"><div className="owner-card-title"><div><span className="eyebrow">PERMANENT ASSET REMOVAL</span><h4>Cloudinary-managed files</h4></div><Trash2 size={19} /></div>{managedAssets.length ? <div className="managed-asset-list">{managedAssets.map(([key, asset]) => <div key={key}><span><strong>{key}</strong><small>{asset.resourceType} · Cloudinary</small></span><button type="button" className="admin-danger-action" onClick={() => void removeManagedAsset(key)}><Trash2 size={14} /> Delete</button></div>)}</div> : <p className="empty-managed-assets">Authorise a save to load the managed Cloudinary asset inventory.</p>}</article></div>
  </main>;
}
