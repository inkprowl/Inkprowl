import { afterEach, describe, expect, it } from "vitest";
import { clearOwnerPublishingCredential, persistOwnerPublishingConnection, persistOwnerPublishingCredential, readOwnerAdminSession, readOwnerPublishingConnection, readOwnerPublishingCredential, unlockOwnerAdminSession } from "./ownerPublishingSession";

describe("owner publishing authorization", () => {
  afterEach(() => clearOwnerPublishingCredential());

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
});
