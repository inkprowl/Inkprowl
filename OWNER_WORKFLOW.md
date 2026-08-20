# INKPROWL owner workflow

The public **inkprowl** repository is the editable source for the GitHub Pages site and the owner control surface. Cloudinary is the permanent public delivery layer for images, songs, logo files, hero banners, and video. Sign in to GitHub with an account that has write access to `inkprowl/inkprowl`; never add passwords, API secrets, upload presets, or provider account credentials to the published static site.

## Publish and remove media

Use [the GitHub upload queue](https://github.com/inkprowl/inkprowl/upload/main/incoming) to select images, music, logos, hero banners, and client-sponsored films. The protected synchronization workflow sends each accepted file to Cloudinary, records the stable delivery URL, and removes the ingestion file from the active branch. Use [the dedicated GitHub owner upload guide](./OWNER_GITHUB_UPLOADS.md) for filename patterns and delete operations. Public visitors never download the working GitHub upload; they receive Cloudinary delivery URLs only.

## Edit collections, filenames, and metadata

Open [`client/src/data/generated-catalog.json`](./client/src/data/generated-catalog.json) in GitHub and use the authenticated **Edit** control for owner-uploaded records. The filename creates a starting title, category, slug, and tags; refine the title, description, tags, category, media settings, or advertising state in GitHub before publishing. Keep `isPremium` as `false` and retain the approved `jpg`, `png`, and `webp` download formats for every public artwork.

| Owner action | Location | Public outcome |
|---|---|---|
| Upload an image, song, or video | `incoming/` upload queue in GitHub | The synchronization Action creates a Cloudinary delivery URL and generated catalogue record. |
| Delete a managed asset | Run the Cloudinary sync workflow with its stored asset key | Cloudinary deletes the managed asset and the public catalogue removes its matching configuration. |
| Title, description, tags, category, and format edits | `generated-catalog.json` in GitHub | Gallery, detail page, download controls, related work, and social preview refresh. |
| Rename or delete a manual category | `categories` and matching artwork records in `catalog.ts` | Filters and related-art rules use the edited category value. Move editions before deleting a category. |
| Logo, hero banner, soundtrack, artwork film, or sponsor video | Correctly named GitHub upload, then `generated-catalog.json` | The public page uses the matching Cloudinary delivery URL. |
| AdSense / Adsterra state | `advertisingSettings` in `generated-catalog.json` | Public placement labels reflect approved provider toggles. |

## Downloads and social sharing

Free editions expose Cloudinary attachment derivatives in JPEG, PNG, and WebP through the detail page. Keep `downloadFormats` limited to approved values. Every published edition generates a static public page at `https://inkprowl.github.io/inkprowl/art/<slug>/`. That page includes Open Graph and Twitter metadata with the artwork image, title, and description, then redirects visitors to the interactive individual-edition screen. This is the URL to share on WhatsApp, X, Facebook, and similar services.

## Advertising and direct sponsors

Use `advertisingSettings` to enable only an approved provider. The public static site intentionally does not store third-party account IDs or credentials. If you add a vetted AdSense or Adsterra snippet, put it in `client/index.html` only after reviewing privacy, consent, and policy obligations. For a direct sponsor, set `sponsoredCampaign.enabled`, client label, and a Cloudinary `videoUrl`; do not publish a client film until written approval and its intended placement are confirmed.

## Publish and check

Commit the edit to `main`. The media synchronization workflow runs for `incoming/` files; GitHub Pages runs the static build, including social-preview generation. Wait for both workflows to finish in **Actions**, then inspect the public site and at least one shared edition URL. The public app uses hash navigation (for example `/#/art/buffalo-tailor-shop`), while the share page uses the crawler-friendly non-hash edition URL above. A later custom domain changes only the public address; the GitHub owner workflow and Cloudinary delivery architecture stay the same.
