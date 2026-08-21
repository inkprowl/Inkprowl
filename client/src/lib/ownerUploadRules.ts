export type OwnerUploadRole = "artwork" | "soundtrack" | "sponsor-video" | "logo" | "hero-banner";

type UploadFileLike = { name: string; size: number };

const maximumUploadBytes = 85 * 1024 * 1024;

const fileRules: Record<OwnerUploadRole, { label: string; extensions: readonly string[]; accept: string }> = {
  artwork: {
    label: "Artwork images",
    extensions: ["jpg", "jpeg", "png", "webp", "avif"],
    accept: ".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif",
  },
  soundtrack: {
    label: "Songs",
    extensions: ["mp3", "wav", "m4a", "ogg"],
    accept: ".mp3,.wav,.m4a,.ogg,audio/mpeg,audio/wav,audio/mp4,audio/ogg",
  },
  "sponsor-video": {
    label: "Sponsor videos",
    extensions: ["mp4", "webm", "mov"],
    accept: ".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime",
  },
  logo: {
    label: "Logo images",
    extensions: ["jpg", "jpeg", "png", "webp", "avif"],
    accept: ".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif",
  },
  "hero-banner": {
    label: "Hero banner images",
    extensions: ["jpg", "jpeg", "png", "webp", "avif"],
    accept: ".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif",
  },
};

export const ownerUploadAccept: Record<OwnerUploadRole, string> = Object.fromEntries(
  Object.entries(fileRules).map(([role, rule]) => [role, rule.accept]),
) as Record<OwnerUploadRole, string>;

function extension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function validateOwnerUploadFiles(role: OwnerUploadRole, files: readonly UploadFileLike[]) {
  const rule = fileRules[role];
  if (!files.length) return `Choose ${role === "artwork" ? "at least one image" : role === "soundtrack" ? "one song" : role === "sponsor-video" ? "one sponsor video" : role === "logo" ? "one logo image" : "one hero banner image"} first.`;
  if (role !== "artwork" && files.length !== 1) return "Select one file for this media placement.";

  const oversized = files.find((file) => file.size > maximumUploadBytes);
  if (oversized) return `${oversized.name} exceeds the 85 MB upload limit.`;

  const unsupported = files.find((file) => !rule.extensions.includes(extension(file.name)));
  if (unsupported) return `${unsupported.name} is not supported. ${rule.label} must use ${rule.extensions.map((item) => `.${item.toUpperCase()}`).join(", ")}.`;
  return "";
}
