export const OWNER_MANAGED_CATALOGUE_PATH = "client/src/data/generated-catalog.json";

/** Source-only releases must preserve the current remote owner catalogue exactly. */
export function assertSourceReleasePaths(paths) {
  if (paths.includes(OWNER_MANAGED_CATALOGUE_PATH)) {
    throw new Error(`${OWNER_MANAGED_CATALOGUE_PATH} is owner-managed Cloudinary state and must not be included in a source release.`);
  }
  return paths;
}
