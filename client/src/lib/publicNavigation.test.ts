import { describe, expect, it } from "vitest";
import { publicNavigationItems, shouldShowFloatingPlayer } from "./publicNavigation";

describe("public navigation", () => {
  it("provides an explicit Home control in the primary navigation", () => {
    expect(publicNavigationItems[0]).toEqual({ label: "Home", href: "/" });
  });

  it("keeps the persistent player available on every public route but not the owner admin", () => {
    expect(shouldShowFloatingPlayer("/")).toBe(true);
    expect(shouldShowFloatingPlayer("/gallery")).toBe(true);
    expect(shouldShowFloatingPlayer("/art/panther-in-pinstripe-suit")).toBe(true);
    expect(shouldShowFloatingPlayer("/admin")).toBe(false);
  });
});
