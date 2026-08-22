import { describe, expect, it } from "vitest";
import { classifyIncomingFile } from "./cloudinary-filename-policy";

describe("INKPROWL owner upload filename policy", () => {
  it("creates an always-free artwork record from a correctly named image", () => {
    expect(classifyIncomingFile("art--business-animals--buffalo-tailor.png")).toEqual({
      kind: "artwork",
      category: "Business Animals",
      slug: "buffalo-tailor",
      title: "Buffalo Tailor",
      tags: ["buffalo", "tailor"],
    });
  });

  it("accepts the owner dashboard’s business, funny, premium, and market category labels", () => {
    expect(classifyIncomingFile("art--business-animal-characters--new-7.jpg")).toMatchObject({ kind: "artwork", category: "Business Animals", slug: "new-7" });
    expect(classifyIncomingFile("art--funny-animal-characters--new-3.jpg")).toMatchObject({ kind: "artwork", category: "Funny Animals", slug: "new-3" });
    expect(classifyIncomingFile("art--premium-animal-characters--new-2.jpg")).toMatchObject({ kind: "artwork", category: "Premium Art", slug: "new-2" });
    expect(classifyIncomingFile("art--bear-bull-market--billy-the-bear.jpg")).toMatchObject({ kind: "artwork", category: "BEAR & BULL MARKET", slug: "billy-the-bear" });
  });

  it("maps soundtrack and edition-video filenames to their intended public media roles", () => {
    expect(classifyIncomingFile("song--evening-edition.mp3")).toEqual({ kind: "soundtrack", title: "Evening Edition" });
    expect(classifyIncomingFile("edition-video--bear-bull-market.mp4")).toEqual({ kind: "edition-video", slug: "bear-bull-market" });
  });

  it("maps branded logo and hero-banner image filenames to permanent branding roles", () => {
    expect(classifyIncomingFile("logo--inkprowl-masthead.webp")).toEqual({ kind: "logo" });
    expect(classifyIncomingFile("hero-banner--autumn-archive.avif")).toEqual({ kind: "hero-banner" });
  });

  it("rejects unclear file names and unsupported upload types", () => {
    expect(() => classifyIncomingFile("unlabelled-image.png")).toThrow("Unsupported INKPROWL upload filename");
    expect(() => classifyIncomingFile("art--business-animals--lion-ledger.mp4")).toThrow("Artwork files must use an image extension");
  });
});
