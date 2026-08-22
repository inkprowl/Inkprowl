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

  it("keeps sponsor and artwork films in a crop-safe 16:9 landscape frame", () => {
    const css = source("client/src/index.css");
    expect(css).toContain(".cloudinary-video.full-video-fit{display:block;min-height:0;aspect-ratio:16/9");
    expect(css).toContain(".cloudinary-video.full-video-fit>.video-ratio-frame>video");
    expect(css).toContain("object-fit:cover;object-position:center center");
  });

  it("hides unrelated owner workspaces after the owner chooses a focused task", () => {
    const css = source("client/src/index.css");
    expect(css).toContain('.owner-launch-dashboard[data-workspace="home"] .owner-upload-grid');
    expect(css).toContain('.owner-launch-dashboard[data-workspace="inventory"] .owner-upload-grid');
    expect(css).toContain('.owner-launch-dashboard[data-workspace="categories"] .workspace-inventory');
  });
});
