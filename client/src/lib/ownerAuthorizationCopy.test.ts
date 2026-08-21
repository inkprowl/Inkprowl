import { describe, expect, it } from "vitest";
import { ownerAuthorizationCopy } from "./ownerAuthorizationCopy";

describe("owner authorization copy", () => {
  it("plainly names the required token and limits it to an in-page permanent-save authorization", () => {
    expect(ownerAuthorizationCopy.label).toContain("GitHub Classic Personal Access Token");
    expect(ownerAuthorizationCopy.explanation).toContain("permanent");
    expect(ownerAuthorizationCopy.boundary).toContain("open page");
    expect(ownerAuthorizationCopy.boundary).toContain("never written to local or session storage");
  });
});
