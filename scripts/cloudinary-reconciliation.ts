import { removeCatalogueAssetState, type GeneratedCatalogueState } from "./cloudinary-catalogue-state.ts";

export type ReconciledCloudinaryAsset = { publicId: string; resourceType: "image" | "video"; deliveryUrl: string };

/**
 * Removes managed catalogue records only after the caller has positively
 * confirmed that their Cloudinary resource no longer exists. This keeps a
 * manual Cloudinary deletion from leaving a stale public catalogue entry.
 */
export async function reconcileMissingCloudinaryAssets(
  catalogue: GeneratedCatalogueState,
  resourceExists: (asset: ReconciledCloudinaryAsset) => Promise<boolean>,
) {
  const removedKeys: string[] = [];
  for (const [key, asset] of Object.entries(catalogue.assets ?? {}) as Array<[string, ReconciledCloudinaryAsset]>) {
    if (!asset?.publicId || !asset?.resourceType) continue;
    if (await resourceExists(asset)) continue;
    removeCatalogueAssetState(catalogue, key);
    removedKeys.push(key);
  }
  return removedKeys;
}
