import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearOwnerPublishingCredential, persistOwnerPublishingConnection, persistOwnerPublishingCredential, readOwnerAdminSession, readOwnerPublishingConnection, readOwnerPublishingCredential, restoreOwnerPublishingSessionForTest, unlockOwnerAdminSession } from "./ownerPublishingSession";

describe("owner publishing authorization", () => {
  let values = new Map<string, string>();

  beforeEach(() => {
    values = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    });
    clearOwnerPublishingCredential();
  });

  afterEach(() => {
    clearOwnerPublishingCredential();
    vi.unstubAllGlobals();
  });

  it("retains a credential only in JavaScript memory until it is cleared", () => {
    expect(readOwnerPublishingCredential()).toBeNull();
    persistOwnerPublishingCredential(" owner-token ");
    expect(readOwnerPublishingCredential()).toBe("owner-token");
    clearOwnerPublishingCredential();
    expect(readOwnerPublishingCredential()).toBeNull();
  });

  it("reuses a completed owner sign-in and verified connection during in-tab navigation only", () => {
    expect(readOwnerAdminSession()).toBe(false);
    expect(readOwnerPublishingConnection()).toBeNull();
    unlockOwnerAdminSession();
    persistOwnerPublishingConnection("owner-token", { login: "inkprowl" });
    expect(readOwnerAdminSession()).toBe(true);
    expect(readOwnerPublishingConnection()).toEqual({ token: "owner-token", identity: { login: "inkprowl" } });
    clearOwnerPublishingCredential();
    expect(readOwnerAdminSession()).toBe(false);
    expect(readOwnerPublishingConnection()).toBeNull();
  });

  it("restores a verified owner connection after refresh only for the current browser tab", () => {
    unlockOwnerAdminSession();
    persistOwnerPublishingConnection("owner-token", { login: "inkprowl", avatar_url: "https://example.test/owner.png" });
    restoreOwnerPublishingSessionForTest();
    expect(readOwnerAdminSession()).toBe(true);
    expect(readOwnerPublishingConnection()).toEqual({ token: "owner-token", identity: { login: "inkprowl", avatar_url: "https://example.test/owner.png" } });
    clearOwnerPublishingCredential();
    expect(values.size).toBe(0);
  });
});
