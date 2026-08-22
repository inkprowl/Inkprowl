import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("public media layout contracts", () => {
  it("keeps a Cloudinary hero image inside a defined stage and falls back only if delivery fails", () => {
    const home = source("client/src/pages/Home.tsx");
    const css = source("client/src/index.css");
    expect(home).toContain("function HeroBanner");
    expect(home).toContain("onError={() => setFailed(true)}");
    expect(home).toContain('className="hero-art-stage"');
    expect(css).toContain(".hero-art-stage{position:relative;display:block;width:100%");
    expect(css).toContain(".hero-art-stage>.hero-banner");
  });

  it("keeps sponsor and artwork films in a subject-safe 16:9 landscape frame", () => {
    const css = source("client/src/index.css");
    const subjectSafeCss = source("client/src/components/subjectSafeVideo.css");
    expect(css).toContain(".cloudinary-video.full-video-fit{display:block;min-height:0;aspect-ratio:16/9");
    expect(css).toContain(".cloudinary-video.full-video-fit>.video-ratio-frame>video");
    expect(css).toContain(".cloudinary-video.full-video-fit>.video-ratio-frame>video,\n.cloudinary-video.hero-video>.video-ratio-frame>video");
    expect(css).toContain("object-fit:contain;object-position:center;background:#110d0b");
    expect(subjectSafeCss).toContain("object-fit: contain !important");
    expect(subjectSafeCss).toContain("object-position: center center !important");
    expect(subjectSafeCss).toContain(".cloudinary-video.full-video-fit.is-portrait-source");
    expect(subjectSafeCss).toContain("height: auto !important");
    const chrome = source("client/src/components/InkprowlChrome.tsx");
    expect(chrome).toContain("setPortraitAspectRatio(isPortrait && videoWidth && videoHeight");
    expect(chrome).toContain('style={portraitAspectRatio ? { aspectRatio: portraitAspectRatio } : undefined}');
    expect(subjectSafeCss).toContain("position: relative !important");
  });

  it("hides unrelated owner workspaces after the owner chooses a focused task", () => {
    const css = source("client/src/index.css");
    expect(css).toContain('.owner-launch-dashboard[data-workspace="home"] .owner-upload-grid');
    expect(css).toContain('.owner-launch-dashboard[data-workspace="inventory"] .owner-upload-grid');
    expect(css).toContain('.owner-launch-dashboard[data-workspace="categories"] .workspace-inventory');
  });

  it("keeps mobile hero copy compact and starts the soundtrack control minimized on small screens", () => {
    const css = source("client/src/index.css");
    const chrome = source("client/src/components/InkprowlChrome.tsx");
    expect(css).toContain(".hero-copy p{display:none}");
    expect(css).toContain("-webkit-line-clamp:3");
    expect(chrome).toContain('window.matchMedia("(max-width: 800px)").matches');
  });

  it("removes a public artwork card if its Cloudinary image no longer delivers", () => {
    const card = source("client/src/components/ArtworkCard.tsx");
    expect(card).toContain('onImageError={() => setImageFailed(true)}');
    expect(card).toContain("if (imageFailed) return null;");
    expect(card).toContain("if (imageFailed && onImageError) return null;");
  });
});
