# INKPROWL owner workflow

The branded [INKPROWL Owner Admin](https://inkprowl.github.io/inkprowl/#/admin) is the owner control surface. Cloudinary is the permanent public delivery layer for images, songs, logo files, hero banners, and video. The admin never opens raw GitHub pages. A GitHub token is requested only when the owner commits a permanent change and exists only in that open tab’s memory.

## Publish and remove media

Open **Add media** in the Owner Admin and choose files from the device. Artwork images support bulk selection; songs, sponsor films, detail films, hero media, banners, and logos are selected one file at a time. The admin writes each selected file to the protected GitHub intake queue; the synchronization workflow sends it to Cloudinary, records the stable delivery URL, and removes the ingestion file from the active branch. Use the same in-admin panel to request permanent removal of an owned Cloudinary asset. Public visitors never download the working GitHub upload; they receive Cloudinary delivery URLs only.

## Edit collections, filenames, and metadata

Use **Artwork desk**, **Music & video**, **Brand studio**, **Categories**, and **Ads & sponsors** in the Owner Admin. The filename creates a starting title, category, slug, and tags; refine those values in the matching in-admin desk before publishing. Keep every public edition free and retain the approved `jpg`, `png`, and `webp` download formats.

| Owner action | Location | Public outcome |
|---|---|---|
| Upload an image, song, or video | **Add media** in Owner Admin | The protected synchronization Action creates a Cloudinary delivery URL and generated catalogue record. |
| Delete a managed asset | **Add media** → **Request permanent removal** | Cloudinary deletes the managed asset and the public catalogue removes its matching configuration. |
| Title, description, tags, category, and visibility edits | **Artwork desk** | Gallery, detail page, download controls, related work, and social preview refresh. |
| Add, rename, or retire a category | **Categories** | Filters and related-art rules use the edited category value. Move editions before retiring a category. |
| Logo, hero banner, soundtrack, artwork film, or sponsor video | **Add media** with the matching public role | The public page uses the matching Cloudinary delivery URL. |
| AdSense / Adsterra state | **Ads & sponsors** | Public placement labels reflect approved provider toggles. |

## Downloads and social sharing

Free editions expose Cloudinary attachment derivatives in JPEG, PNG, and WebP through the detail page. Keep `downloadFormats` limited to approved values. Every published edition generates a static public page at `https://inkprowl.github.io/inkprowl/art/<slug>/`. That page includes Open Graph and Twitter metadata with the artwork image, title, and description, then redirects visitors to the interactive individual-edition screen. This is the URL to share on WhatsApp, X, Facebook, and similar services.

## Advertising and direct sponsors

Use **Ads & sponsors** to enable only an approved provider. The public static site intentionally does not store third-party account IDs or credentials. For a direct sponsor, use **Music & video** to set the client label and approved HTTPS destination, then upload the sponsor film as a file through **Add media**. Do not publish a client film until written approval and its intended placement are confirmed.

## Publish and check

Connect publishing in the Owner Admin with either a classic GitHub token scoped to `repo` and `workflow`, or a fine-grained token scoped to `inkprowl/inkprowl` with Contents and Actions read/write access. The token is retained only while that tab is open. Each admin save commits to `main`; the synchronization workflow runs for media actions and GitHub Pages runs the static build, including social-preview generation. Wait for the matching Action to finish, then inspect the public site and at least one shared edition URL. The public app uses hash navigation (for example `/#/art/buffalo-tailor-shop`), while the share page uses the crawler-friendly non-hash edition URL above. A later custom domain changes only the public address; the INKPROWL Owner Admin and Cloudinary delivery architecture stay the same.
