import { describe, expect, it } from "vitest";
import { INKPROWL_PATHS } from "./App";

describe("INKPROWL GitHub Pages routes", () => {
  it("registers every public page and the separate owner path", () => {
    expect(INKPROWL_PATHS).toEqual([
      "/",
      "/gallery",
      "/categories",
      "/art/:slug",
      "/about",
      "/contact",
      "/terms",
      "/privacy",
      "/admin",
      "/404",
    ]);
  });

  it("keeps the owner workspace outside the public navigation path set", () => {
    const publicPaths = INKPROWL_PATHS.filter((path) => path !== "/admin");

    expect(publicPaths).not.toContain("/admin");
    expect(INKPROWL_PATHS).toContain("/admin");
  });
});
