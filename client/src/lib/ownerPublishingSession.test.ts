import { afterEach, describe, expect, it } from "vitest";
import { clearOwnerPublishingCredential, persistOwnerPublishingCredential, readOwnerPublishingCredential } from "./ownerPublishingSession";

describe("owner publishing authorization", () => {
  afterEach(() => clearOwnerPublishingCredential());

  it("retains a credential only in JavaScript memory until it is cleared", () => {
    expect(readOwnerPublishingCredential()).toBeNull();
    persistOwnerPublishingCredential(" owner-token ");
    expect(readOwnerPublishingCredential()).toBe("owner-token");
    clearOwnerPublishingCredential();
    expect(readOwnerPublishingCredential()).toBeNull();
  });
});
