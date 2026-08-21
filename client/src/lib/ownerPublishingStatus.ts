export type OwnerPublishStatus = {
  percent: number;
  tone: "idle" | "working" | "success" | "error";
  message: string;
};

export const initialOwnerPublishStatus: OwnerPublishStatus = {
  percent: 0,
  tone: "idle",
  message: "Choose a file, review its filename-derived details, then select Upload & Publish.",
};

export function authorizationPendingStatus(kind: "upload" | "save") : OwnerPublishStatus {
  return kind === "upload"
    ? { percent: 5, tone: "working", message: "Authorise this upload once. Your selected file will start uploading automatically as soon as authorisation is confirmed." }
    : { percent: 5, tone: "working", message: "Authorise this save once. Your category or artwork change will be saved automatically when authorisation is confirmed." };
}

export const publishHandoffStatus = (): OwnerPublishStatus => ({
  percent: 8,
  tone: "working",
  message: "Preparing the secure publish handoff…",
});

export function uploadToQueueStatus(filename: string, index: number, total: number): OwnerPublishStatus {
  return {
    percent: Math.round(15 + (index / total) * 65),
    tone: "working",
    message: `Uploading ${filename} to the protected publish handoff…`,
  };
}

export const savingArtworkMetadataStatus = (): OwnerPublishStatus => ({
  percent: 88,
  tone: "working",
  message: "Saving filename-derived artwork title, description, tags, and metadata…",
});

export function queuedForCloudinaryStatus(total: number): OwnerPublishStatus {
  return {
    percent: 100,
    tone: "success",
    message: `${total} ${total === 1 ? "file is" : "files are"} queued. The protected workflow now transfers it to permanent Cloudinary storage, writes the delivery URL to the catalogue, and rebuilds the public site.`,
  };
}

export function publishFailureStatus(reason?: string): OwnerPublishStatus {
  return {
    percent: 0,
    tone: "error",
    message: reason || "The upload handoff failed. Your media was not published.",
  };
}
