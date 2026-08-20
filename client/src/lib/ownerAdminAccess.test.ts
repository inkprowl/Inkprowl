import { describe, expect, it } from "vitest";
import { hasOwnerAdminSession, isConfiguredOwnerAccess, ownerSessionClearCookieValue, ownerSessionCookieValue } from "./ownerAdminAccess";

describe("configured INKPROWL owner entry", () => {
  it("accepts only the configured local owner ID and password", () => {
    expect(isConfiguredOwnerAccess("INKPROWL", "INKPROWL@2027")).toBe(true);
    expect(isConfiguredOwnerAccess("inkprowl", "INKPROWL@2027")).toBe(true);
    expect(isConfiguredOwnerAccess("INKPROWL", "not-the-password")).toBe(false);
    expect(isConfiguredOwnerAccess("other-owner", "INKPROWL@2027")).toBe(false);
  });

  it("recognizes only the dedicated owner-session marker and never stores the password", () => {
    expect(hasOwnerAdminSession("theme=dark; inkprowl_owner_session=active; consent=yes")).toBe(true);
    expect(hasOwnerAdminSession("inkprowl_owner_session=expired")).toBe(false);
    expect(hasOwnerAdminSession("")).toBe(false);
    expect(ownerSessionCookieValue()).toContain("inkprowl_owner_session=active");
    expect(ownerSessionCookieValue()).not.toContain("INKPROWL@2027");
    expect(ownerSessionClearCookieValue()).toContain("Max-Age=0");
  });
});
