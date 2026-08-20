import { describe, expect, it } from "vitest";
import { applyCategoryOperation, resolvedCategoryNames } from "./ownerCatalogueOps";
import { emptyOwnerCatalogue } from "./githubOwnerSession";

describe("owner category operations", () => {
  const baseCategories = ["Business Animals", "Funny Animals"];

  it("adds a permanent owner category without duplicating labels", () => {
    const catalogue = emptyOwnerCatalogue();
    expect(applyCategoryOperation(catalogue, baseCategories, "add", "", "Editorial Animals")).toBe("Editorial Animals");
    expect(resolvedCategoryNames(baseCategories, catalogue)).toContain("Editorial Animals");
    expect(() => applyCategoryOperation(catalogue, baseCategories, "add", "", "Editorial Animals")).toThrow(/already exists/);
  });

  it("renames categories and preserves their artwork assignments", () => {
    const catalogue = emptyOwnerCatalogue();
    catalogue.artworks.push({ slug: "otter", category: "Funny Animals" });
    catalogue.artworkOverrides.panther = { category: "Funny Animals" };
    applyCategoryOperation(catalogue, baseCategories, "rename", "Funny Animals", "Comic Animals");
    expect(resolvedCategoryNames(baseCategories, catalogue)).toContain("Comic Animals");
    expect(catalogue.artworks[0]?.category).toBe("Comic Animals");
    expect(catalogue.artworkOverrides.panther?.category).toBe("Comic Animals");
  });

  it("retires a category into an existing replacement while keeping its editions visible", () => {
    const catalogue = emptyOwnerCatalogue();
    catalogue.categories.push({ name: "Seasonal Animals" });
    catalogue.artworks.push({ slug: "hare", category: "Seasonal Animals" });
    applyCategoryOperation(catalogue, baseCategories, "retire", "Seasonal Animals", "Business Animals");
    expect(resolvedCategoryNames(baseCategories, catalogue)).not.toContain("Seasonal Animals");
    expect(catalogue.artworks[0]?.category).toBe("Business Animals");
  });
});
