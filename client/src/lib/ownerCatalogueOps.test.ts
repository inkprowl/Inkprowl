import { describe, expect, it } from "vitest";
import { applyCategoryOperation, categoryOperationValidationMessage, resolvedCategoryNames } from "./ownerCatalogueOps";
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

  it("permits an owner-created category to be renamed and then retired using the live resolved list", () => {
    const catalogue = emptyOwnerCatalogue();
    applyCategoryOperation(catalogue, baseCategories, "add", "", "INKPROWL Audit Category");
    const liveNames = resolvedCategoryNames(baseCategories, catalogue);
    expect(categoryOperationValidationMessage(catalogue, liveNames, "rename", "INKPROWL Audit Category", "INKPROWL Audit Category Renamed")).toBe("");
    applyCategoryOperation(catalogue, liveNames, "rename", "INKPROWL Audit Category", "INKPROWL Audit Category Renamed");
    const renamedLiveNames = resolvedCategoryNames(baseCategories, catalogue);
    expect(categoryOperationValidationMessage(catalogue, renamedLiveNames, "retire", "INKPROWL Audit Category Renamed", "Business Animals")).toBe("");
    applyCategoryOperation(catalogue, renamedLiveNames, "retire", "INKPROWL Audit Category Renamed", "Business Animals");
    expect(resolvedCategoryNames(baseCategories, catalogue)).not.toContain("INKPROWL Audit Category Renamed");
  });

  it("returns an immediate validation error without mutating the current catalogue", () => {
    const catalogue = emptyOwnerCatalogue();
    expect(categoryOperationValidationMessage(catalogue, baseCategories, "add", "", "")).toBe("Enter a category label before saving.");
    expect(categoryOperationValidationMessage(catalogue, baseCategories, "add", "", "Business Animals")).toBe("That category already exists.");
    expect(catalogue.categories).toEqual([]);
  });

  it("preflights an owner-created category rename against the live list without mutating the catalogue", () => {
    const catalogue = emptyOwnerCatalogue();
    applyCategoryOperation(catalogue, baseCategories, "add", "", "Owner Archive");
    const beforeValidation = structuredClone(catalogue);
    const liveNames = resolvedCategoryNames(baseCategories, catalogue);

    expect(categoryOperationValidationMessage(catalogue, liveNames, "rename", "Owner Archive", "Owner Archive Updated")).toBe("");
    expect(catalogue).toEqual(beforeValidation);
  });
});
