# INKPROWL

INKPROWL is a premium editorial archive for collectible animal artwork, built as a static React application for GitHub Pages.

## Publishing model

GitHub Pages hosts the interface. Cloudinary is the only permanent storage and delivery service for images, music, and video. Add only stable Cloudinary delivery URLs to `client/src/data/catalog.ts`; the catalog validates that permanent media URLs originate from `https://res.cloudinary.com/`.

## Local validation

Run `pnpm check`, `pnpm test`, and `GITHUB_ACTIONS=true pnpm vite build` before publishing. Refer to [GITHUB_PAGES.md](./GITHUB_PAGES.md) for first-time Pages activation and Cloudinary content-management guidance.
