import { describe, expect, it } from "vitest";
import { sponsorDisplayName } from "./sponsorPresentation";

describe("sponsorDisplayName", () => {
  it("replaces filename-like sponsor names with concise public copy", () => {
    expect(sponsorDisplayName("Vid 20260604 Wa0295")).toBe("Sponsored film");
    expect(sponsorDisplayName("video--summer-campaign")).toBe("Sponsored film");
  });

  it("keeps a deliberately named sponsor for public presentation", () => {
    expect(sponsorDisplayName("Wildline Studio")).toBe("Wildline Studio");
  });
});
