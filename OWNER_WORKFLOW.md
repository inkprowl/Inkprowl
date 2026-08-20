# INKPROWL owner workflow

The **inkprowl** GitHub repository is the single source of truth for the public GitHub Pages application and its editable catalogue. The repository is public so visitors can receive the static site, while write access remains limited to authenticated repository collaborators. Do not add secrets, account passwords, API keys, Cloudinary credentials, or upload presets to this repository.

## 1. Publish permanent media in Cloudinary

Upload images, music, and video to the authenticated Cloudinary Media Library. Cloudinary is the only permanent media store for INKPROWL. After upload, copy the stable `https://res.cloudinary.com/.../image/upload/...` or `https://res.cloudinary.com/.../video/upload/...` delivery URL. If an edition needs to be removed permanently, delete it in Cloudinary first and then remove or replace the matching catalogue record.

## 2. Edit the public collection

In GitHub, open [`client/src/data/catalog.ts`](./client/src/data/catalog.ts) and use the **Edit** control. The `artworks` array holds each title, description, category, tags, free/premium designation, image URL, optional audio URL, and optional video URL. Add, edit, or remove an entry and commit the change directly to `main` once reviewed.

| Owner task | Source of truth | Public result |
|---|---|---|
| Title, description, category, tags, and premium status | `artworks` in `catalog.ts` | Gallery cards, individual artwork pages, filters, related work, and access labels refresh. |
| Image, audio, and video | Cloudinary URL fields in `catalog.ts` | The static site uses the published Cloudinary asset without storing media files in GitHub Pages. |
| Hero film, default edition film, and floating soundtrack | `siteMedia` in `catalog.ts` | The configured Cloudinary player becomes available across the intended public pages. |
| AdSense / Adsterra placement state | `advertisingSettings` in `catalog.ts` | The public placement labels show only the approved providers. |

## 3. Manage categories and related artwork

Rename or edit a category in the `categories` list and update any matching artwork category values. Remove a category only after moving or deleting its artworks. Related artwork is calculated from matching category values, so no separate relationship table or browser storage is used.

## 4. Review, publish, and validate

Every commit to `main` runs the GitHub Pages workflow. Confirm the workflow completes in the repository **Actions** tab, then open `https://inkprowl.github.io/inkprowl/` and inspect the affected page. The public site uses hash routes, such as `/#/gallery` and `/#/art/buffalo-tailor-shop`, so page navigation survives static GitHub Pages hosting.

## 5. Advertising and premium boundary

Set `adsenseEnabled` or `adsterraEnabled` to `true` only after the relevant provider is approved and your legal/privacy content is updated. Do not put advertising account identifiers or unreviewed provider scripts in the repository. The static site can label and reserve placements, but any third-party code should be reviewed before adding it.

Premium designations control the site’s call-to-action only. GitHub Pages and public Cloudinary delivery URLs cannot provide cryptographically protected paid downloads. If an asset must never be public, do not publish an unrestricted delivery URL for it.
