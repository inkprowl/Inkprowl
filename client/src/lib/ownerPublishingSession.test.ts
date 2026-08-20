import { describe, expect, it } from "vitest";
import { clearOwnerPublishingCredential, persistOwnerPublishingCredential, readOwnerPublishingCredential } from "./ownerPublishingSession";

describe("owner publishing session", () => {
  it("is safe to evaluate outside a browser and retains no value there", () => {
    expect(readOwnerPublishingCredential()).toBeNull();
    expect(() => persistOwnerPublishingCredential("token")).not.toThrow();
    expect(() => clearOwnerPublishingCredential()).not.toThrow();
  });
});
