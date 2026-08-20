# INKPROWL GitHub Pages deployment

This repository publishes the public INKPROWL site as a static GitHub Pages application. The public site uses hash URLs, so every public route remains available after refresh. For example, the gallery is available at `/#/gallery` and an artwork edition is available at `/#/art/panther-in-pinstripe-suit`.

## Enable the public URL

Open the repository’s **Settings → Pages** and set the source to **GitHub Actions**. The included workflow deploys the production static build on every push to `main`. For an account named `inkprowl` and repository named `inkprowl`, the expected public URL is:

`https://inkprowl.github.io/inkprowl/`

GitHub Pages custom domain configuration can be added later from the same Settings → Pages screen. Keep HTTPS enforcement enabled when the domain is connected.

## Permanent media rule

**Cloudinary is INKPROWL’s only permanent media store.** Do not commit images, video, music, downloads, or generated art files to this repository. Upload permanent media through Cloudinary, then store only its stable HTTPS delivery URL in `client/src/data/catalog.ts`.

The public gallery uses intentional **1:1 editorial crops** to make a calm, single-column mobile grid. The individual artwork page uses the original Cloudinary asset without a crop, so the full uploaded proportions remain visible in the large preview and download.

To remove an edition permanently, delete it through the authenticated Cloudinary Media Library first, then remove or replace its catalog entry in this repository. No public browser, static site, or GitHub Pages configuration contains Cloudinary credentials.

## Updating the public collection

Use the protected GitHub repository editing workflow for titles, descriptions, categories, free/premium flags, related work, advertisement settings, and Cloudinary URLs. A commit to `main` automatically triggers a new public static build. Use the authenticated Cloudinary account for all media uploads, replacements, organization, and deletion.

The owner-facing `/admin` design route is an interface and workflow guide only; GitHub and Cloudinary remain the sources of real authentication and management authority.

## Owner workflow and media players

The public **inkprowl** repository also contains the owner workflow. Use [`OWNER_WORKFLOW.md`](./OWNER_WORKFLOW.md) and `client/src/data/catalog.ts` while authenticated to GitHub; repository write permissions, not the published static page, protect the ability to change source content. The `siteMedia.heroFilmUrl`, `siteMedia.defaultArtworkFilmUrl`, and `siteMedia.soundtrackUrl` fields accept only stable Cloudinary delivery URLs. An empty field leaves the corresponding player in its ready-to-configure state without requesting any non-Cloudinary asset.

Use the `advertisingSettings` fields in the same catalog as the approved source of truth before adding real AdSense or Adsterra snippets. Never place Cloudinary credentials, upload presets, API secrets, or account passwords in this static repository or its published pages.
