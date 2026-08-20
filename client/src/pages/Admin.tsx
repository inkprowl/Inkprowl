import { ArrowUpRight, Eye, EyeOff, FilePenLine, ImagePlus, KeyRound, LogIn, LogOut, Megaphone, Music2, Palette, RotateCcw, ShieldCheck, SlidersHorizontal, Tags, Trash2, Video, type LucideIcon } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Mark } from "@/components/InkprowlChrome";
import { activeAdvertisementProviders, artworks, categories, publishedArtworks, siteMedia } from "@/data/catalog";

type ActionId = "media" | "artwork" | "video" | "brand" | "categories" | "ads";
type DeskAction = { id: ActionId; title: string; description: string; detail: string; icon: LucideIcon; accent: "gold" | "ink" | "paper" };

function OwnerLogin({ onUnlock }: { onUnlock: () => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (identifier.trim() && password) {
      onUnlock();
      return;
    }
    setError("Enter an owner ID and password to open this local admin session.");
  }

  return <main className="owner-login-screen">
    <section className="owner-login-panel">
      <div className="owner-login-topline"><Mark /><span>INKPROWL / OWNER ADMIN</span></div>
      <div className="owner-login-copy"><span className="eyebrow light">PRIVATE ACCESS</span><h1>Enter the<br /><em>prowl desk.</em></h1><p>One editorial management room for artwork, sound, film, branding, categories, and advertising settings.</p></div>
      <div className="owner-login-fact"><ShieldCheck size={17} /><span>Cloudinary delivers public files. GitHub confirms permanent owner changes.</span></div>
    </section>
    <section className="owner-login-form-panel">
      <div className="owner-login-form-head"><span className="eyebrow">OWNER SIGN IN</span><h2>Welcome<br /><em>back.</em></h2><p>Open the branded management desk, then use its protected workflow to prepare permanent publishing.</p></div>
      <form className="owner-login-form" onSubmit={submit} noValidate>
        <label htmlFor="owner-id">Owner ID<input id="owner-id" autoComplete="username" placeholder="INKPROWL" value={identifier} onChange={(event) => setIdentifier(event.target.value)} /></label>
        <label htmlFor="owner-password">Password<span className="owner-password-field"><input id="owner-password" autoComplete="current-password" placeholder="Enter your password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
        {error && <p className="owner-login-error" role="alert">{error}</p>}
        <button className="owner-login-submit" type="submit"><LogIn size={16} /> Open admin desk <ArrowUpRight size={16} /></button>
      </form>
      <button type="button" className="owner-recovery-trigger" onClick={() => { setRecovery(true); window.location.href = "mailto:makwanasudatt56@gmail.com?subject=INKPROWL%20Admin%20reset%20request&body=Please%20send%20a%20reset%20confirmation%20for%20the%20INKPROWL%20owner%20admin."; }}><RotateCcw size={14} /> Request reset access</button>
      {recovery && <div className="owner-recovery-note"><strong>Reset request ready.</strong><p>Your email application has opened a request addressed to the owner email. Send it from your own mail account; reset confirmation remains under owner control.</p></div>}
      <p className="owner-login-boundary">This opens a local admin session only. It creates no browser storage or media storage; protected publishing remains separate from this public screen.</p>
    </section>
  </main>;
}

function ActionCard({ action, onOpen }: { action: DeskAction; onOpen: (id: ActionId) => void }) {
  const Icon = action.icon;
  return <button type="button" className={`desk-action ${action.accent}`} onClick={() => onOpen(action.id)}><span className="desk-action-icon"><Icon size={21} /></span><span className="desk-action-copy"><strong>{action.title}</strong><small>{action.description}</small></span><span className="desk-action-footer"><em>{action.detail}</em><ArrowUpRight size={17} /></span></button>;
}

const panelCopy: Record<ActionId, { eyebrow: string; title: string; description: string }> = {
  media: { eyebrow: "MEDIA INTAKE", title: "Add a Cloudinary asset.", description: "Select an image, song, video, logo, or banner and prepare its public role from INKPROWL Admin." },
  artwork: { eyebrow: "ARTWORK DESK", title: "Refine an edition.", description: "Choose a public edition and prepare title, description, tags, and category updates without leaving this desk." },
  video: { eyebrow: "MUSIC & VIDEO", title: "Program the room.", description: "Prepare a soundtrack, hero film, sponsor reel, or individual edition film for Cloudinary delivery." },
  brand: { eyebrow: "BRAND STUDIO", title: "Set the editorial frame.", description: "Prepare a logo, hero banner, headline, and visual direction update." },
  categories: { eyebrow: "CATEGORIES", title: "Keep the archive orderly.", description: "Prepare a category rename, new label, or retirement while keeping public collections coherent." },
  ads: { eyebrow: "ADS & SPONSORS", title: "Control placements.", description: "Prepare AdSense, Adsterra, and sponsor placement settings without exposing any provider secret." },
};

function ManagerPanel({ active, onClose }: { active: ActionId; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [edition, setEdition] = useState(publishedArtworks[0]?.slug ?? "");
  const [adsense, setAdsense] = useState(activeAdvertisementProviders().includes("AdSense"));
  const [adsterra, setAdsterra] = useState(activeAdvertisementProviders().includes("Adsterra"));
  const selected = publishedArtworks.find((item) => item.slug === edition);
  const copy = panelCopy[active];
  const prepared = (message: string) => setNotice(message);

  return <section className="in-admin-manager" aria-live="polite">
    <div className="in-admin-manager-head"><div><span className="eyebrow">{copy.eyebrow}</span><h3>{copy.title}</h3><p>{copy.description}</p></div><button type="button" onClick={onClose} aria-label="Close panel">×</button></div>
    {active === "media" && <div className="in-admin-form-grid"><label className="admin-file-drop">{file ? <><ImagePlus size={24} /><strong>{file.name}</strong><span>{Math.round(file.size / 1024)} KB selected in this session</span></> : <><ImagePlus size={24} /><strong>Choose media from your device</strong><span>Image, soundtrack, video, logo, or banner</span></>}<input type="file" accept="image/*,audio/*,video/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label><div className="admin-form-stack"><label>Public role<select defaultValue="Artwork edition"><option>Artwork edition</option><option>Floating soundtrack</option><option>Hero banner or film</option><option>Artwork detail film</option><option>Sponsor film</option><option>INKPROWL logo</option></select></label><label>Category<select defaultValue={categories[0]?.name}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label><button type="button" className="admin-primary-action" onClick={() => prepared(file ? `${file.name} is prepared for protected Cloudinary publishing. The public catalogue will refresh after confirmation.` : "Choose a file first to prepare its Cloudinary publishing details.")}>Prepare protected publish <ArrowUpRight size={16} /></button></div></div>}
    {active === "artwork" && <div className="in-admin-form-grid"><div className="admin-form-stack"><label>Published edition<select value={edition} onChange={(event) => setEdition(event.target.value)}>{publishedArtworks.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label><label>Title<input defaultValue={selected?.title} /></label><label>Category<select defaultValue={selected?.category}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label></div><div className="admin-form-stack"><label>Description<textarea rows={4} defaultValue={selected?.description} /></label><label>Tags<input defaultValue={selected?.tags.join(", ")} /></label><button type="button" className="admin-primary-action" onClick={() => prepared("Artwork edits are prepared for protected catalogue publishing. Every published edition remains a free Cloudinary download.")}>Prepare edition update <ArrowUpRight size={16} /></button></div></div>}
    {active === "video" && <div className="in-admin-form-grid"><div className="admin-form-stack"><label>Media role<select><option>Floating soundtrack</option><option>Home hero film</option><option>Artwork detail film</option><option>Sponsor campaign film</option></select></label><label>Display title<input placeholder="e.g. The INKPROWL soundtrack" /></label><button type="button" className="admin-primary-action" onClick={() => prepared("Media settings are prepared. Add the matching file through Media intake, then protected publishing assigns its Cloudinary delivery URL.")}>Prepare media setting <ArrowUpRight size={16} /></button></div><div className="admin-readonly-card"><Music2 size={21} /><strong>Always-free delivery</strong><p>When a soundtrack is published, the floating player provides listening and a direct Cloudinary download. Image editions remain free in JPG, PNG, and WebP.</p></div></div>}
    {active === "brand" && <div className="in-admin-form-grid"><div className="admin-form-stack"><label>Hero headline<input placeholder="INKPROWL" /></label><label>Hero subheading<textarea rows={3} placeholder="Set the next editorial story." /></label><button type="button" className="admin-primary-action" onClick={() => prepared("Brand details are prepared. Add the matching logo or hero asset through Media intake before protected publishing.")}>Prepare brand update <ArrowUpRight size={16} /></button></div><div className="admin-readonly-card"><Palette size={21} /><strong>Cloudinary visual delivery</strong><p>The approved logo and hero visual use permanent Cloudinary delivery URLs only after the protected workflow confirms the update.</p></div></div>}
    {active === "categories" && <div className="in-admin-form-grid"><div className="admin-form-stack"><label>Existing category<select>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label><label>New or renamed label<input placeholder="e.g. Editorial Animals" /></label><button type="button" className="admin-primary-action" onClick={() => prepared("Category changes are prepared. Move related editions before retiring a label, then publish through the protected workflow.")}>Prepare category change <ArrowUpRight size={16} /></button></div><div className="admin-readonly-card"><Tags size={21} /><strong>Archive rule</strong><p>Categories power gallery filters and related artwork. Keep editions grouped before renaming or retiring a public category.</p></div></div>}
    {active === "ads" && <div className="in-admin-form-grid"><div className="admin-form-stack"><label className="admin-toggle"><span><strong>AdSense</strong><small>Prepare the approved placement state.</small></span><input type="checkbox" checked={adsense} onChange={(event) => setAdsense(event.target.checked)} /></label><label className="admin-toggle"><span><strong>Adsterra</strong><small>Prepare the approved placement state.</small></span><input type="checkbox" checked={adsterra} onChange={(event) => setAdsterra(event.target.checked)} /></label><button type="button" className="admin-primary-action" onClick={() => prepared(`Advertising state prepared: AdSense ${adsense ? "on" : "off"}; Adsterra ${adsterra ? "on" : "off"}. Provider code and credentials remain protected.`)}>Prepare ad settings <ArrowUpRight size={16} /></button></div><div className="admin-readonly-card"><Megaphone size={21} /><strong>Safe provider handoff</strong><p>Do not paste provider secrets into this public dashboard. Protected publishing applies reviewed settings while the site shows approved public placements only.</p></div></div>}
    {notice && <p className="admin-inline-notice"><ShieldCheck size={16} /> {notice}</p>}
    <p className="admin-manager-boundary">This branded admin keeps preparation inside INKPROWL. Final upload, deletion, or permanent catalogue update goes through the protected GitHub-to-Cloudinary workflow and never stores credentials or files in browser storage.</p>
  </section>;
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<ActionId | null>(null);
  const activeProviders = activeAdvertisementProviders();
  const mediaStatus = [siteMedia.heroFilmUrl && "hero film", siteMedia.defaultArtworkFilmUrl && "edition film", siteMedia.soundtrackUrl && "soundtrack"].filter(Boolean);
  const actions: DeskAction[] = [
    { id: "media", title: "Add media", description: "Choose an artwork image, soundtrack, video, hero banner, or logo from your device.", detail: "In-admin intake", icon: ImagePlus, accent: "gold" },
    { id: "artwork", title: "Artwork desk", description: "Rename a title, refine a description, set tags, move a category, and preserve free formats.", detail: "Edit edition", icon: FilePenLine, accent: "paper" },
    { id: "video", title: "Music & video", description: "Program the floating soundtrack, home film, sponsor reel, or individual edition film.", detail: "Set media role", icon: Video, accent: "ink" },
    { id: "brand", title: "Brand studio", description: "Set the INKPROWL logo, hero banner, headline, and visual direction from one place.", detail: "Shape masthead", icon: Palette, accent: "paper" },
    { id: "categories", title: "Categories", description: "Rename category labels, keep related artwork together, and retire obsolete labels carefully.", detail: "Organize archive", icon: Tags, accent: "ink" },
    { id: "ads", title: "Ads & sponsors", description: "Control provider state, sponsor copy, and film settings without raw code pages.", detail: "Review placements", icon: Megaphone, accent: "gold" },
  ];

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    robots.dataset.inkprowlAdmin = "true";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  if (!unlocked) return <OwnerLogin onUnlock={() => setUnlocked(true)} />;

  return <div className="owner-desk-shell"><aside className="owner-desk-sidebar"><div className="owner-desk-brand"><Mark /><span>INKPROWL</span></div><div className="owner-desk-intro"><span className="eyebrow light">OWNER ADMIN</span><h1>The<br /><em>prowl desk.</em></h1><p>One editorial control room for every public edition, soundtrack, campaign, placement, and visual setting.</p></div><div className="owner-access-state"><ShieldCheck size={18} /><div><strong>Branded admin open</strong><span>Prepare every operation here. Protected publishing synchronizes confirmed changes to GitHub and Cloudinary.</span></div></div><button type="button" className="owner-github-link" onClick={() => setActive("media")}><KeyRound size={16} /> Protected publishing ready <ArrowUpRight size={15} /></button><p className="owner-sidebar-note">No raw GitHub pages are used for owner preparation. Credentials, media, and permanent source writes are never stored in this browser.</p></aside><main className="owner-desk-main"><header className="owner-desk-header"><div><span className="eyebrow">CONTROL ROOM / CLOUDINARY DELIVERY</span><h2>Manage the <em>archive.</em></h2></div><div className="owner-header-actions"><span className="workflow-pill"><span /> Protected workflow ready</span><button type="button" className="owner-logout" onClick={() => { setActive(null); setUnlocked(false); }}><LogOut size={15} /> Log out</button></div></header><section className="owner-stat-strip" aria-label="Current owner configuration"><div><span>PUBLIC EDITIONS</span><strong>{publishedArtworks.length}</strong><small>always free</small></div><div><span>UPLOAD PIPELINE</span><strong>Ready</strong><small>GitHub → Cloudinary</small></div><div><span>LIVE MEDIA</span><strong>{mediaStatus.length || "—"}</strong><small>{mediaStatus.join(" · ") || "waiting for media"}</small></div><div><span>AD PLACEMENTS</span><strong>{activeProviders.length || "Off"}</strong><small>{activeProviders.join(" + ") || "owner controlled"}</small></div></section><section className="owner-desk-heading"><div><span className="eyebrow">YOUR CONTROL BOARD</span><h3>Start with an<br /><em>owner action.</em></h3></div><p>Every public file remains a Cloudinary delivery asset. All artwork downloads stay free in JPG, PNG, and WebP.</p></section><section className="owner-action-grid">{actions.map((action) => <ActionCard key={action.id} action={action} onOpen={setActive} />)}</section>{active && <ManagerPanel active={active} onClose={() => setActive(null)} />}<section className="owner-workflow-grid"><article className="owner-workflow-card upload-prep"><div className="workflow-card-label"><Music2 size={17} /><span>UPLOAD PREPARATION</span></div><h3>Name it once.<br /><em>Publish it everywhere.</em></h3><p>Choose Add media and select an image, song, video, logo, banner, or sponsor reel. Protected publishing creates the Cloudinary delivery URL and refreshes public configuration.</p><code>art--business-animals--your-title.png</code><button type="button" onClick={() => setActive("media")}>Open media intake <ArrowUpRight size={14} /></button></article><article className="owner-workflow-card edition-control"><div className="workflow-card-label"><SlidersHorizontal size={17} /><span>PUBLIC EDITION POLICY</span></div><h3>Free by<br /><em>default.</em></h3><ul><li>All public images expose JPG, PNG, and WebP downloads.</li><li>Cloudinary is the public delivery source.</li><li>Unpublished records stay out of the gallery.</li></ul><button type="button" onClick={() => setActive("artwork")}>Review edition settings <ArrowUpRight size={14} /></button></article><article className="owner-workflow-card delete-control"><div className="workflow-card-label"><Trash2 size={17} /><span>REMOVE AN ASSET</span></div><h3>Delete with<br /><em>intent.</em></h3><p>Prepare an asset removal in the media desk. The protected sync workflow deletes the Cloudinary asset and the next public build excludes it.</p><button type="button" onClick={() => setActive("media")}>Open media controls <ArrowUpRight size={14} /></button></article></section><section className="owner-safety-note"><ShieldCheck size={18} /><p><strong>How this dashboard stays safe.</strong> The branded owner desk does not expose Cloudinary credentials, browser storage, or raw GitHub pages. GitHub remains the protected confirmation boundary for permanent changes.</p></section><footer className="owner-desk-footer">Cloudinary public delivery · protected owner workflow · {artworks.length} catalogue records</footer></main></div>;
}
