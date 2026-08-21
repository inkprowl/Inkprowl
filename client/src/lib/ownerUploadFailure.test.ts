import { describe, expect, it } from "vitest";
import { ownerUploadFailureMessage } from "./ownerUploadFailure";

describe("owner upload failure messages", () => {
  it("turns a browser fetch failure into a retryable owner instruction", () => {
    expect(ownerUploadFailureMessage(new Error("Failed to fetch"), "lion.webp")).toContain("protected GitHub upload service");
  });

  it("explains an existing queue file without exposing raw GitHub API wording", () => {
    expect(ownerUploadFailureMessage(new Error("sha wasn't supplied"), "night-song.mp3")).toContain("already waiting");
  });
});
