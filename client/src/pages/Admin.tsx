import { Eye, EyeOff, ExternalLink, FilePenLine, KeyRound, LockKeyhole, RotateCcw, SlidersHorizontal } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Mark } from "@/components/InkprowlChrome";
import { activeAdvertisementProviders, advertisingSettings, artworks, siteBranding, siteMedia, sponsoredCampaign } from "@/data/catalog";

const repositoryUrl = "https://github.com/inkprowl/inkprowl";
const catalogueUrl = `${repositoryUrl}/blob/main/client/src/data/catalog.ts`;

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const activeProviders = activeAdvertisementProviders();
  const mediaStatus = [
    siteMedia.heroFilmUrl && "hero film",
    siteMedia.defaultArtworkFilmUrl && "edition film",
    siteMedia.soundtrackUrl && "soundtrack",
  ].filter(Boolean).join(", ") || "no media URLs configured";
  const freeEdition = artworks.find((artwork) => !artwork.isPremium);

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    robots.dataset.inkprowlAdmin = "true";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("For security, INKPROWL owner actions happen through your authenticated GitHub repository and Cloudinary account—not a public browser password.");
  };

  return (
    <div className="admin-shell">
      <div className="admin-login">
        <Mark />
        <span className="eyebrow">OWNER WORKFLOW</span>
        <h1>Good work<br /><em>needs a key.</em></h1>
        <p>Use your authenticated GitHub and Cloudinary accounts to manage public INKPROWL content and media.</p>
        <form onSubmit={submit}>
          <label>LOGIN ID<input defaultValue="INKPROWL" aria-label="Login ID" /></label>
          <label>PASSWORD<div className="password-row"><input type={showPassword ? "text" : "password"} placeholder="Owner password" aria-label="Password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          <button className="button-light wide" type="submit"><LockKeyhole size={16} /> Continue securely</button>
        </form>
        <button className="reset-link" onClick={() => setMessage("Password recovery is handled by GitHub or Cloudinary through their account recovery flows.")}><RotateCcw size={14} /> Reset password</button>
        {message && <p className="admin-message">{message}</p>}
      </div>
      <div className="admin-guide">
        <div>
          <span className="eyebrow">OWNER CONTROL MAP</span>
          <h2>One public site.<br /><em>One secure workflow.</em></h2>
          <p className="admin-config-status">Live public configuration: <strong>{activeProviders.join(" + ") || "advertising off"}</strong> · {mediaStatus}.</p>
        </div>
        <div className="management-cards">
          <a href={`${repositoryUrl}/blob/main/OWNER_WORKFLOW.md`} target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>Owner operations guide</strong><p>Follow the approved GitHub and Cloudinary workflow for editing, review, and publishing.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><FilePenLine size={20} /><strong>Edition metadata & downloads</strong><p>Turn an uploaded filename into an editable title, description, slug, tags, category, and always-free JPEG/PNG/WebP download-format list.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><SlidersHorizontal size={20} /><strong>Categories & related editions</strong><p>Rename a category, update matching artworks, and only then delete it. Matching category values create the public related-artwork rail.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><SlidersHorizontal size={20} /><strong>Brand, sponsor & media</strong><p>Set a Cloudinary logo, hero banner, soundtrack, edition film, or approved direct-sponsor campaign and video placement.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>Ad provider handoff</strong><p>Toggle approved providers in the catalogue. Review consent and policy requirements before placing a provider-supplied snippet in the HTML shell.</p><ExternalLink size={16} /></a>
          <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer"><LockKeyhole size={20} /><strong>Cloudinary library</strong><p>Bulk upload, replace, organize, and delete permanent image, music, and video assets.</p><ExternalLink size={16} /></a>
        </div>
        <div className="admin-codebox">
          <span className="eyebrow">CONFIGURATION PREVIEW</span>
          <pre>{`advertisingSettings = { adsenseEnabled: ${advertisingSettings.adsenseEnabled}, adsterraEnabled: ${advertisingSettings.adsterraEnabled} }
siteBranding = { logoUrl: ${Boolean(siteBranding.logoUrl)}, heroBannerUrl: ${Boolean(siteBranding.heroBannerUrl)}, heroTitle: "${siteBranding.heroTitle}" }
sponsoredCampaign = { enabled: ${sponsoredCampaign.enabled}, videoUrl: ${Boolean(sponsoredCampaign.videoUrl)} }
downloadFormats = ${JSON.stringify(freeEdition?.downloadFormats ?? ["jpg", "png", "webp"])}
providerCodeHandoff = "Review provider snippet, consent, and policy before client/index.html"`}</pre>
          <p>Keep provider credentials out of GitHub Pages. Add only approved Cloudinary delivery URLs and configuration values to the catalogue, then commit and publish. Use the owner guide before deleting a category or a permanent Cloudinary asset.</p>
        </div>
      </div>
    </div>
  );
}
