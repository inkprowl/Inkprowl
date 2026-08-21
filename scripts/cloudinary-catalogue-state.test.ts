import { describe, expect, it } from "vitest";
import { removeCatalogueAssetState } from "./cloudinary-catalogue-state";

describe("removeCatalogueAssetState", () => {
  it("removes a deleted artwork and its override so it cannot remain in the owner inventory", () => {
    const catalogue = {
      assets: { "artwork:temporary-edition": { publicId: "inkprowl/temporary-edition" } },
      artworks: [{ slug: "temporary-edition", assetKey: "artwork:temporary-edition" }],
      artworkOverrides: { "temporary-edition": { title: "Temporary", isPublished: false } },
      artworkMedia: { "temporary-edition": { videoUrl: "https://res.cloudinary.com/y1pc8ocl/video/upload/temporary.mp4" } },
    };

    removeCatalogueAssetState(catalogue, "artwork:temporary-edition");

    expect(catalogue.assets).not.toHaveProperty("artwork:temporary-edition");
    expect(catalogue.artworks).toEqual([]);
    expect(catalogue.artworkOverrides).not.toHaveProperty("temporary-edition");
    expect(catalogue.artworkMedia).not.toHaveProperty("temporary-edition");
  });

  it("preserves non-video artwork media while deleting an edition-video pointer", () => {
    const catalogue = {
      assets: { "artworkVideo:panther": { publicId: "inkprowl/panther-film" } },
      artworkMedia: { panther: { videoUrl: "https://res.cloudinary.com/y1pc8ocl/video/upload/panther.mp4", caption: "Film" } },
    };

    removeCatalogueAssetState(catalogue, "artworkVideo:panther");

    expect(catalogue.assets).not.toHaveProperty("artworkVideo:panther");
    expect(catalogue.artworkMedia.panther).toEqual({ caption: "Film" });
  });

  it("clears soundtrack title, URL, and artist data when the managed song is deleted", () => {
    const catalogue = {
      assets: { "siteMedia:soundtrack": { publicId: "inkprowl/song" } },
      siteMedia: { soundtrackUrl: "https://res.cloudinary.com/y1pc8ocl/video/upload/song.mp3", soundtrackTitle: "Night Prowl", soundtrackArtist: "INKPROWL Ensemble" },
    };

    removeCatalogueAssetState(catalogue, "siteMedia:soundtrack");

    expect(catalogue.assets).not.toHaveProperty("siteMedia:soundtrack");
    expect(catalogue.siteMedia).toEqual({ soundtrackTitle: "Curated sound" });
  });
});
