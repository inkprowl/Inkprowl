import { describe, expect, it } from "vitest";
import { isConfiguredOwnerAccess } from "./ownerAdminAccess";

describe("configured INKPROWL owner entry", () => {
  it("accepts only the configured local owner ID and password", () => {
    expect(isConfiguredOwnerAccess("INKPROWL", "INKPROWL@2027")).toBe(true);
    expect(isConfiguredOwnerAccess("inkprowl", "INKPROWL@2027")).toBe(true);
    expect(isConfiguredOwnerAccess("INKPROWL", "not-the-password")).toBe(false);
    expect(isConfiguredOwnerAccess("other-owner", "INKPROWL@2027")).toBe(false);
  });
});
