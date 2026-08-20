import { ExternalLink, FilePenLine, KeyRound, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { Mark } from "@/components/InkprowlChrome";
import { activeAdvertisementProviders, advertisingSettings, artworks, siteBranding, siteMedia, sponsoredCampaign } from "@/data/catalog";

const repositoryUrl = "https://github.com/inkprowl/inkprowl";
const catalogueUrl = `${repositoryUrl}/blob/main/client/src/data/catalog.ts`;
const uploadUrl = `${repositoryUrl}/upload/main/incoming`;
const actionsUrl = `${repositoryUrl}/actions`;

export default function Admin() {
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

  return (
    <div className="admin-shell">
      <div className="admin-login">
        <Mark />
        <span className="eyebrow">OWNER ACCESS</span>
        <h1>Good work<br /><em>needs a key.</em></h1>
        <p>Open the owner workspace with the GitHub account that owns or has write access to the INKPROWL repository.</p>
        <a className="button-light wide" href={repositoryUrl} target="_blank" rel="noreferrer"><KeyRound size={16} /> Open GitHub owner workspace <ExternalLink size={15} /></a>
        <a className="reset-link" href="https://github.com/password_reset" target="_blank" rel="noreferrer"><RotateCcw size={14} /> Recover GitHub access</a>
        <p className="admin-message">This GitHub Pages address has no stored browser password. Your GitHub account is the real owner login, so the access button opens an authentic sign-in flow instead of accepting an inspectable public password.</p>
      </div>
      <div className="admin-guide">
        <div>
          <span className="eyebrow">OWNER CONTROL MAP</span>
          <h2>One public site.<br /><em>One owner workflow.</em></h2>
          <p className="admin-config-status">Live public configuration: <strong>{activeProviders.join(" + ") || "advertising off"}</strong> · {mediaStatus}.</p>
        </div>
        <div className="management-cards">
          <a href={`${repositoryUrl}/blob/main/OWNER_WORKFLOW.md`} target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>Owner operations guide</strong><p>Review the public catalogue, advertising, category, and Cloudinary delivery workflow in the repository.</p><ExternalLink size={16} /></a>
          <a href={uploadUrl} target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>GitHub media upload queue</strong><p>Choose image, audio, or video files in the repository upload screen. The Cloudinary sync workflow is activated after its protected secret is configured.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><FilePenLine size={20} /><strong>Edition metadata & downloads</strong><p>Edit the title, description, slug, tags, category, and always-free JPEG/PNG/WebP download-format list.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><SlidersHorizontal size={20} /><strong>Categories & related editions</strong><p>Rename a category, update matching editions, and only then delete it. Matching category values create the related-artwork rail.</p><ExternalLink size={16} /></a>
          <a href={catalogueUrl} target="_blank" rel="noreferrer"><SlidersHorizontal size={20} /><strong>Brand, sponsor & media</strong><p>Set a Cloudinary logo, hero banner, soundtrack, edition film, or direct-sponsor campaign and video placement.</p><ExternalLink size={16} /></a>
          <a href={actionsUrl} target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>Sync & deployment activity</strong><p>Monitor media synchronization and the GitHub Pages build after an owner change is committed.</p><ExternalLink size={16} /></a>
        </div>
        <div className="admin-codebox">
          <span className="eyebrow">CONFIGURATION PREVIEW</span>
          <pre>{`advertisingSettings = { adsenseEnabled: ${advertisingSettings.adsenseEnabled}, adsterraEnabled: ${advertisingSettings.adsterraEnabled} }
siteBranding = { logoUrl: ${Boolean(siteBranding.logoUrl)}, heroBannerUrl: ${Boolean(siteBranding.heroBannerUrl)}, heroTitle: "${siteBranding.heroTitle}" }
sponsoredCampaign = { enabled: ${sponsoredCampaign.enabled}, videoUrl: ${Boolean(sponsoredCampaign.videoUrl)} }
downloadFormats = ${JSON.stringify(freeEdition?.downloadFormats ?? ["jpg", "png", "webp"])}
ownerLogin = "GitHub repository write access"
cloudinarySecret = "GitHub Actions secret only"`}</pre>
          <p>All live public editions are free downloads. Keep Cloudinary credentials out of the public page and catalogue. The owner-upload automation needs one protected GitHub Actions secret before it can transfer media from the GitHub upload queue to Cloudinary.</p>
        </div>
      </div>
    </div>
  );
}
