import { describe, expect, it } from "vitest";
import { reconcileMissingCloudinaryAssets } from "./cloudinary-reconciliation.ts";

describe("reconcileMissingCloudinaryAssets", () => {
  it("removes only catalogue records whose managed Cloudinary resources are missing", async () => {
    const catalogue = {
      artworks: [{ slug: "missing", assetKey: "artwork:missing" }, { slug: "kept", assetKey: "artwork:kept" }],
      artworkOverrides: {}, artworkMedia: {}, siteMedia: {}, siteBranding: {}, sponsoredCampaign: {},
      assets: {
        "artwork:missing": { publicId: "inkprowl/missing", resourceType: "image", deliveryUrl: "https://example.test/missing" },
        "artwork:kept": { publicId: "inkprowl/kept", resourceType: "image", deliveryUrl: "https://example.test/kept" },
      },
    };
    const removed = await reconcileMissingCloudinaryAssets(catalogue, async (asset) => asset.publicId === "inkprowl/kept");
    expect(removed).toEqual(["artwork:missing"]);
    expect(catalogue.artworks).toEqual([{ slug: "kept", assetKey: "artwork:kept" }]);
    expect(catalogue.assets).toEqual({ "artwork:kept": expect.any(Object) });
  });
});
