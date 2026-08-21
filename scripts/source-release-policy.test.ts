import { describe, expect, it } from "vitest";
import { assertSourceReleasePaths, OWNER_MANAGED_CATALOGUE_PATH } from "./source-release-policy.mjs";

describe("source release policy", () => {
  it("blocks source releases from overwriting owner-managed Cloudinary catalogue state", () => {
    expect(() => assertSourceReleasePaths(["client/src/pages/Home.tsx", OWNER_MANAGED_CATALOGUE_PATH])).toThrow(/owner-managed Cloudinary state/);
  });

  it("allows ordinary source files to be released", () => {
    expect(assertSourceReleasePaths(["client/src/pages/Home.tsx", "client/src/data/catalog.ts"])).toEqual(["client/src/pages/Home.tsx", "client/src/data/catalog.ts"]);
  });
});
