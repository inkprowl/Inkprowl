import { describe, expect, it } from "vitest";
import {
  authorizationPendingStatus,
  publishFailureStatus,
  publishHandoffStatus,
  queuedForCloudinaryStatus,
  savingArtworkMetadataStatus,
  uploadToQueueStatus,
} from "./ownerPublishingStatus";

describe("INKPROWL owner publishing status transitions", () => {
  it("shows authorization messaging before a permanent upload or catalogue save", () => {
    expect(authorizationPendingStatus("upload")).toMatchObject({ percent: 5, tone: "working" });
    expect(authorizationPendingStatus("upload").message).toContain("selected file will start uploading automatically");
    expect(authorizationPendingStatus("save").message).toContain("category or artwork change");
  });

  it("reports the protected queue handoff and progress for each queued file", () => {
    expect(publishHandoffStatus()).toEqual({ percent: 8, tone: "working", message: "Preparing the secure publish handoff…" });
    expect(uploadToQueueStatus("song--night-shift.mp3", 1, 2)).toEqual({ percent: 48, tone: "working", message: "Uploading song--night-shift.mp3 to the protected publish handoff…" });
    expect(savingArtworkMetadataStatus()).toMatchObject({ percent: 88, tone: "working" });
  });

  it("reports Cloudinary queue success and a specific failure without falsely claiming publication", () => {
    expect(queuedForCloudinaryStatus(1)).toMatchObject({ percent: 100, tone: "success" });
    expect(queuedForCloudinaryStatus(2).message).toContain("2 files are queued");
    expect(publishFailureStatus("GitHub queue rejected the request.")).toEqual({ percent: 0, tone: "error", message: "GitHub queue rejected the request." });
    expect(publishFailureStatus().message).toContain("not published");
  });
});
