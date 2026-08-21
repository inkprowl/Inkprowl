export function ownerUploadFailureMessage(reason: unknown, filename?: string) {
  const detail = reason instanceof Error ? reason.message : "The upload request did not complete.";
  const lower = detail.toLowerCase();
  const label = filename ? `“${filename}”` : "This file";

  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
    return `${label} could not reach the protected GitHub upload service. Check your connection, keep this admin tab open, then select the file and try Upload & Publish again.`;
  }
  if (lower.includes("sha") && (lower.includes("supplied") || lower.includes("already exists"))) {
    return `${label} is already waiting in the protected upload queue. Wait for the current Cloudinary processing to finish before trying it again.`;
  }
  if (lower.includes("unsupported inkprowl upload filename") || lower.includes("must use")) {
    return `${label} is not an accepted permanent media format. Choose one of the listed file formats and keep a simple filename containing letters or numbers.`;
  }
  if (lower.includes("larger than") || lower.includes("too large")) {
    return `${label} is too large for GitHub Pages’ protected upload handoff. Export a smaller file and try again.`;
  }
  return detail;
}
