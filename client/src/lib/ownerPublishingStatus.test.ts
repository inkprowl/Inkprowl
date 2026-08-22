import { describe, expect, it } from "vitest";
import {
  authorizationPendingStatus,
  catalogueSavedStatus,
  cloudinaryDeletionQueuedStatus,
  deletionFailureStatus,
  publishFailureStatus,
  publishHandoffStatus,
  queuedForCloudinaryStatus,
  requestingCloudinaryDeletionStatus,
  savingArtworkMetadataStatus,
  savingCatalogueStatus,
  uploadToQueueStatus,
} from "./ownerPublishingStatus";

describe("INKPROWL owner publishing status transitions", () => {
  it("shows authorization messaging before a permanent upload or catalogue save", () => {
    expect(authorizationPendingStatus("upload")).toMatchObject({ percent: 5, tone: "working" });
    expect(authorizationPendingStatus("upload").message).toContain("selected file will start uploading automatically");
    expect(authorizationPendingStatus("save").message).toContain("category or artwork change");
    expect(authorizationPendingStatus("deletion").message).toContain("Cloudinary removal");
  });

  it("reports the protected queue handoff and progress for each queued file", () => {
    expect(publishHandoffStatus()).toEqual({ percent: 8, tone: "working", message: "Preparing the secure publish handoff…" });
    expect(uploadToQueueStatus("song--night-shift.mp3", 1, 2)).toEqual({ percent: 48, tone: "working", message: "Uploading song--night-shift.mp3 to the protected publish handoff…" });
    expect(savingArtworkMetadataStatus()).toMatchObject({ percent: 88, tone: "working" });
  });

  it("reports concise publishing feedback without falsely claiming that a queued item is already live", () => {
    expect(queuedForCloudinaryStatus(1)).toMatchObject({ percent: 100, tone: "success" });
    expect(queuedForCloudinaryStatus(2).message).toContain("2 uploads saved");
    expect(queuedForCloudinaryStatus(1).message).toContain("publishing it in the background");
    expect(queuedForCloudinaryStatus(1).message).toContain("can take a few minutes");
    expect(queuedForCloudinaryStatus(1).message).toContain("do not upload the same file again");
    expect(queuedForCloudinaryStatus(1, "sponsor-video").message).toContain("Cloudinary is preparing the video");
    expect(queuedForCloudinaryStatus(1).publicRefreshUrl).toContain("https://inkprowl.github.io/inkprowl/");
    expect(publishFailureStatus("GitHub queue rejected the request.")).toEqual({ percent: 0, tone: "error", message: "GitHub queue rejected the request." });
    expect(publishFailureStatus().message).toContain("not published");
  });

  it("reports category-save and permanent-deletion states without claiming completion too early", () => {
    expect(savingCatalogueStatus()).toMatchObject({ percent: 25, tone: "working" });
    const saved = catalogueSavedStatus("Category renamed.", "abc123456789");
    expect(saved.message).toContain("GitHub Pages will rebuild automatically");
    expect(saved).toMatchObject({ revision: "abc123456789" });
    expect(saved.publicRefreshUrl).toContain("published=abc123456789");
    expect(requestingCloudinaryDeletionStatus()).toMatchObject({ percent: 45, tone: "working" });
    expect(cloudinaryDeletionQueuedStatus().message).toContain("protected workflow will delete");
    expect(deletionFailureStatus().message).toContain("permanent removal request failed");
  });
});
