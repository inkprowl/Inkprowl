# INKPROWL GitHub Owner Uploads

The owner workspace is [the unlinked INKPROWL admin page](https://inkprowl.github.io/inkprowl/#/admin). It opens the GitHub repository for the account that has write access. GitHub is the owner control surface; public media delivery and every visitor download use Cloudinary URLs.

## One-time protected setup

Open **GitHub repository → Settings → Secrets and variables → Actions**, select **New repository secret**, set the name to `CLOUDINARY_URL`, and paste the real Cloudinary API environment value in the format `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. Save it as a GitHub Actions secret. Do not post this value in GitHub source files, issues, the static admin page, browser storage, or messages. The synchronization script rejects placeholder examples such as `cloudinary://<your_api_key>:<your_api_secret>@cloud_name` rather than uploading media with an incomplete credential.

## Upload media

Open [the upload queue](https://github.com/inkprowl/inkprowl/upload/main/incoming), sign in to GitHub, select a file, and commit it to `main`. The **Sync INKPROWL media to Cloudinary** Action starts automatically. It uploads the media to Cloudinary, records the delivery URL in `client/src/data/generated-catalog.json`, removes the upload-queue working file, and triggers the normal GitHub Pages deployment.

Use the exact filename patterns below. The Action rejects unsupported filenames and formats rather than publishing an unclear asset.

| Asset to add | Filename pattern | Result |
|---|---|---|
| Artwork image | `art--business-animals--buffalo-tailor.png` | Creates an always-free artwork with a title, category, tags, JPG/PNG/WebP downloads, and a Cloudinary delivery URL. |
| Soundtrack | `song--evening-edition.mp3` | Replaces the floating player soundtrack with a Cloudinary-hosted audio file. |
| Home video | `hero-film--spring-release.mp4` | Sets the Cloudinary-hosted home video. |
| Hero banner | `hero-banner--spring-release.png` | Sets the Cloudinary-hosted hero image. |
| Logo | `logo--inkprowl.png` | Sets the Cloudinary-hosted site logo. |
| Sponsor video | `sponsor-video--partner-name.mp4` | Publishes the sponsor player and enables that campaign. |
| Artwork video | `edition-video--bear-bull-market.mp4` | Attaches a Cloudinary video to an existing artwork slug. |

The category portion of an artwork filename must be one of: `business-animals`, `mafia-bosses`, `funny-animals`, `collectible-art`, `tailored-animals`, `vintage-comic-art`, `cross-hatching`, `2d-line-art`, `animal-characters`, `fashion-animals`, or `free-art`.

## Edit titles, descriptions, categories, and advertising

Open [`client/src/data/generated-catalog.json`](https://github.com/inkprowl/inkprowl/blob/main/client/src/data/generated-catalog.json), use the GitHub pencil button, make the edit, and commit it. `artworks` stores generated editions; `siteMedia`, `siteBranding`, `sponsoredCampaign`, and `advertisingSettings` control site-level media and ad placement settings. Every artwork should remain `isPremium: false` and keep `downloadFormats` set to `jpg`, `png`, and `webp`.

The static public page can display provider placements but cannot safely store provider account credentials. Keep AdSense or Adsterra account credentials private, and add only an approved public placement configuration after you have reviewed the provider’s policy requirements.

## Delete a managed Cloudinary asset

Open [the sync workflow](https://github.com/inkprowl/inkprowl/actions/workflows/sync-cloudinary-media.yml), select **Run workflow**, choose `delete`, and paste the relevant key from the `assets` object in `generated-catalog.json`. The workflow removes the Cloudinary asset with cache invalidation, removes the generated public configuration, commits the change, and the next site deployment excludes it.

GitHub receives the original file only as a controlled ingestion commit. The action removes it from the active branch after Cloudinary confirms the upload; public visitors never receive media from GitHub.
