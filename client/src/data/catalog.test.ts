import { describe, expect, it } from "vitest";
import { activeAdvertisementProviders, advertisingSettings, artworks, categories, getArtwork, isCloudinaryDeliveryUrl, relatedArtworks, siteMedia, validateArtworkMedia, validateSiteMedia } from "./catalog";

describe("INKPROWL catalog", () => {
  it("contains all requested public browsing categories", () => {
    expect(categories.map((category) => category.name)).toEqual([
      "Business Animals",
      "Mafia Bosses",
      "Funny Animals",
      "Collectible Art",
      "Tailored Animals",
      "Vintage Comic Art",
      "Cross-Hatching",
      "2D Line Art",
      "Animal Characters",
      "Fashion Animals",
      "Premium Art",
      "Free Art",
    ]);
  });

  it("keeps a Cloudinary-backed collectible edition in the catalog", () => {
    const panther = getArtwork("panther-in-pinstripe-suit");

    expect(panther?.isPremium).toBe(true);
    expect(panther?.imageUrl).toMatch(/^https:\/\/res\.cloudinary\.com\//);
  });

  it("distinguishes both free and premium editions", () => {
    expect(artworks.some((artwork) => artwork.isPremium)).toBe(true);
    expect(artworks.some((artwork) => !artwork.isPremium)).toBe(true);
  });

  it("never recommends the active artwork as related work", () => {
    const current = artworks[0]!;
    const related = relatedArtworks(current);

    expect(related.every((artwork) => artwork.slug !== current.slug)).toBe(true);
  });

  it("accepts only Cloudinary URLs for permanent image, audio, and video fields", () => {
    expect(isCloudinaryDeliveryUrl("https://res.cloudinary.com/inkprowl/image/upload/v1/panther.png")).toBe(true);
    expect(isCloudinaryDeliveryUrl("https://res.cloudinary.com/inkprowl/video/upload/v1/score.mp3")).toBe(true);
    expect(isCloudinaryDeliveryUrl("https://example.com/panther.png")).toBe(false);
    expect(() => validateArtworkMedia({
      ...artworks[0]!,
      imageUrl: "https://example.com/panther.png",
    })).toThrow(/Cloudinary delivery URL/);
  });

  it("keeps optional site-wide soundtrack and film settings Cloudinary-only", () => {
    expect(() => validateSiteMedia(siteMedia)).not.toThrow();
    expect(() => validateSiteMedia({ ...siteMedia, soundtrackUrl: "https://example.com/score.mp3" })).toThrow(/Cloudinary delivery URL/);
  });

  it("exposes only explicitly enabled advertising providers to public placements", () => {
    expect(activeAdvertisementProviders(advertisingSettings)).toEqual([]);
    expect(activeAdvertisementProviders({ adsenseEnabled: true, adsterraEnabled: false })).toEqual(["Google AdSense"]);
    expect(activeAdvertisementProviders({ adsenseEnabled: true, adsterraEnabled: true })).toEqual(["Google AdSense", "Adsterra"]);
  });
});
