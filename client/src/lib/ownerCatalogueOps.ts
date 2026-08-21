import type { OwnerGeneratedCatalogue } from "./githubOwnerSession";

export type CategoryOperation = "add" | "rename" | "retire";

function cleanLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function canonicalCategory(label: string, aliases: Record<string, string>) {
  return Object.entries(aliases).find(([, alias]) => alias === label)?.[0] ?? label;
}

export function resolvedCategoryNames(baseNames: string[], catalogue: OwnerGeneratedCatalogue) {
  const aliases = catalogue.categoryAliases ?? {};
  return Array.from(new Set([...baseNames, ...(catalogue.categories ?? []).map((category) => category.name)]
    .map((name) => aliases[name] ?? name)
    .filter(Boolean)));
}

export function applyCategoryOperation(catalogue: OwnerGeneratedCatalogue, baseNames: string[], operation: CategoryOperation, source: string, label: string) {
  const target = cleanLabel(label);
  if (!target) throw new Error("Enter a category label before saving.");

  catalogue.categories ??= [];
  catalogue.categoryAliases ??= {};
  const available = resolvedCategoryNames(baseNames, catalogue);

  if (operation === "add") {
    if (available.some((name) => name.toLowerCase() === target.toLowerCase())) throw new Error("That category already exists.");
    catalogue.categories.push({ name: target, icon: "✦" });
    return target;
  }

  const selected = cleanLabel(source);
  if (!selected || !available.includes(selected)) throw new Error("Choose an existing category to update.");
  if (selected.toLowerCase() === target.toLowerCase()) throw new Error("Choose a different category label.");
  if (operation === "rename" && available.some((name) => name.toLowerCase() === target.toLowerCase())) throw new Error("That category already exists.");

  const canonical = canonicalCategory(selected, catalogue.categoryAliases);
  catalogue.categoryAliases[canonical] = target;
  catalogue.artworks = (catalogue.artworks ?? []).map((artwork) => artwork.category === selected || artwork.category === canonical ? { ...artwork, category: target } : artwork);
  catalogue.artworkOverrides = Object.fromEntries(Object.entries(catalogue.artworkOverrides ?? {}).map(([slug, override]) => [slug, override.category === selected || override.category === canonical ? { ...override, category: target } : override]));

  if (operation === "retire") {
    catalogue.categories = catalogue.categories.filter((category) => category.name !== selected && category.name !== canonical);
  }
  return target;
}

export function categoryOperationValidationMessage(catalogue: OwnerGeneratedCatalogue, baseNames: string[], operation: CategoryOperation, source: string, label: string) {
  try {
    applyCategoryOperation(structuredClone(catalogue), baseNames, operation, source, label);
    return "";
  } catch (reason) {
    return reason instanceof Error ? reason.message : "This category change is not valid.";
  }
}
