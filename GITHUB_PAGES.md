# INKPROWL GitHub Pages deployment

This repository publishes the public INKPROWL site as a static GitHub Pages application. The public site uses hash URLs, so every public route remains available after refresh. For example, the gallery is available at `/#/gallery` and an artwork edition is available at `/#/art/panther-in-pinstripe-suit`.

## Enable the public URL

Open the repository’s **Settings → Pages** and set the source to **GitHub Actions**. The included workflow deploys the production static build on every push to `main`. For an account named `inkprowl` and repository named `inkprowl`, the expected public URL is:

`https://inkprowl.github.io/inkprowl/`

GitHub Pages custom domain configuration can be added later from the same Settings → Pages screen. Keep HTTPS enforcement enabled when the domain is connected.

## Permanent media rule

**Cloudinary is INKPROWL’s only public permanent media delivery store.** Use the authenticated GitHub [`incoming/`](./incoming/) upload queue for owner uploads; the protected GitHub Action transfers accepted files to Cloudinary, writes only their delivery URLs to `client/src/data/generated-catalog.json`, then removes the working upload from the active branch. Do not add media files to website source folders or link any visitor to a GitHub media URL.

The public gallery uses intentional **1:1 editorial crops** to make a calm, single-column mobile grid. The individual artwork page uses the original Cloudinary asset without a crop, so the full uploaded proportions remain visible in the large preview and download.

To remove a generated edition permanently, run the authenticated **Sync INKPROWL media to Cloudinary** workflow with its stored asset key. No public browser, static site, or GitHub Pages configuration contains Cloudinary credentials.

## Updating the public collection

Use the protected GitHub repository editing workflow for titles, descriptions, categories, always-free download settings, related work, advertisement settings, and generated Cloudinary delivery URLs. A commit to `main` automatically triggers the required media synchronization and a new public static build. The owner’s GitHub account is the authentication boundary.

The owner-facing `/admin` design route is an interface and workflow guide only; GitHub sign-in is the real owner authentication boundary. A later custom domain can point to this same GitHub Pages site without changing the GitHub upload queue or Cloudinary delivery design.

## Owner workflow and media players

The public **inkprowl** repository also contains the owner workflow. Use [`OWNER_GITHUB_UPLOADS.md`](./OWNER_GITHUB_UPLOADS.md) and `client/src/data/generated-catalog.json` while authenticated to GitHub; repository write permissions, not the published static page, protect the ability to change source content. The `siteMedia.heroFilmUrl`, `siteMedia.defaultArtworkFilmUrl`, and `siteMedia.soundtrackUrl` fields accept only stable Cloudinary delivery URLs. An empty field leaves the corresponding player in its ready-to-configure state without requesting any non-Cloudinary asset.

Use the `advertisingSettings` fields in the same catalog as the approved source of truth before adding real AdSense or Adsterra snippets. Never place Cloudinary credentials, upload presets, API secrets, or account passwords in this static repository or its published pages.
