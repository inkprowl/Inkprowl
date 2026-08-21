import { describe, expect, it } from "vitest";
import { ownerUploadAccept, validateOwnerUploadFiles } from "./ownerUploadRules";

describe("owner upload rules", () => {
  it("accepts each artwork image extension supported by the Cloudinary sync workflow", () => {
    for (const filename of ["edition.jpg", "edition.jpeg", "edition.png", "edition.webp", "edition.avif"]) {
      expect(validateOwnerUploadFiles("artwork", [{ name: filename, size: 1 }])).toBe("");
    }
  });

  it("blocks SVG artwork in the browser before it can create a failed Cloudinary workflow", () => {
    expect(validateOwnerUploadFiles("artwork", [{ name: "edition.svg", size: 1 }])).toContain("not supported");
    expect(validateOwnerUploadFiles("artwork", [{ name: "edition.svg", size: 1 }])).toContain(".PNG");
    expect(ownerUploadAccept.artwork).not.toContain("svg");
  });

  it("keeps the upload-size guard in the browser", () => {
    expect(validateOwnerUploadFiles("artwork", [{ name: "edition.webp", size: 85 * 1024 * 1024 + 1 }])).toContain("85 MB");
  });
});
