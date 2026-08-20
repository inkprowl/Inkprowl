# INKPROWL owner workflow

The public **inkprowl** repository is the editable source for the GitHub Pages site. Cloudinary is the only permanent store for images, songs, logo files, hero banners, and video. Repository write access and your Cloudinary login are the secure control boundary; never add passwords, API secrets, upload presets, or provider account credentials to the public static site.

## Publish and remove media

Use the Cloudinary Media Library to bulk-upload, organize, replace, or delete permanent images, music, logos, hero banners, and client-sponsored films. Copy the stable `https://res.cloudinary.com/.../image/upload/...` or `https://res.cloudinary.com/.../video/upload/...` URL after publication. When deleting media, first remove or replace the matching URL in `client/src/data/catalog.ts`, commit the change, and then delete the Cloudinary asset. This prevents a broken public page.

## Edit collections, filenames, and metadata

Open [`client/src/data/catalog.ts`](./client/src/data/catalog.ts) in GitHub and use the authenticated **Edit** control. Add an artwork by copying an existing entry and updating its `slug`, `title`, `description`, `category`, `tags`, `isPremium`, `imageUrl`, `audioUrl`, `videoUrl`, and optional `downloadFormats`. Use the uploaded filename as a starting point for the readable title and slug, then manually refine title, description, and tags for accurate search and social-sharing metadata.

| Owner action | Location | Public outcome |
|---|---|---|
| Bulk image/song/video upload or delete | Cloudinary Media Library | Cloudinary holds every permanent media byte. |
| Title, description, tag, free/premium, and format edits | `artworks` in `catalog.ts` | Gallery, detail page, download controls, related work, and social preview refresh. |
| Rename or delete a category | `categories` and matching `artworks` records | Filters and related-art rules use the edited category value. Move editions before deleting a category. |
| Logo and hero banner | `siteBranding` in `catalog.ts` | The square brand seal and hero visual use the approved Cloudinary image. |
| Soundtrack, artwork film, or sponsor video | `siteMedia` / `sponsoredCampaign` in `catalog.ts` | Cloudinary media players appear only when valid URLs are configured. |
| AdSense / Adsterra state | `advertisingSettings` in `catalog.ts` | Public placement labels reflect approved provider toggles. |

## Downloads and social sharing

Free editions expose Cloudinary attachment derivatives in JPEG, PNG, and WebP through the detail page. Keep `downloadFormats` limited to approved values. Every published edition generates a static public page at `https://inkprowl.github.io/inkprowl/art/<slug>/`. That page includes Open Graph and Twitter metadata with the artwork image, title, and description, then redirects visitors to the interactive individual-edition screen. This is the URL to share on WhatsApp, X, Facebook, and similar services.

## Advertising and direct sponsors

Use `advertisingSettings` to enable only an approved provider. The public static site intentionally does not store third-party account IDs or credentials. If you add a vetted AdSense or Adsterra snippet, put it in `client/index.html` only after reviewing privacy, consent, and policy obligations. For a direct sponsor, set `sponsoredCampaign.enabled`, client label, and a Cloudinary `videoUrl`; do not publish a client film until written approval and its intended placement are confirmed.

## Publish and check

Commit the edit to `main`. GitHub Pages runs the deployment workflow, including static social-preview generation. Wait for the workflow to finish in **Actions**, then inspect the public site and at least one shared edition URL. The public app uses hash navigation (for example `/#/art/buffalo-tailor-shop`), while the share page uses the crawler-friendly non-hash edition URL above.
