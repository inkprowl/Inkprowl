const GITHUB_API = "https://api.github.com";
const REPOSITORY = "inkprowl/inkprowl";

export const GENERATED_CATALOGUE_PATH = "client/src/data/generated-catalog.json";

export type GitHubIdentity = {
  login: string;
  avatar_url?: string;
};

export type GitHubRepository = {
  permissions?: {
    admin?: boolean;
    push?: boolean;
  };
};

export type RepositoryDocument<T> = {
  value: T;
  sha: string;
};

export type ManagedCloudinaryAsset = {
  publicId: string;
  resourceType: "image" | "video";
  deliveryUrl: string;
};

export type OwnerGeneratedCatalogue = {
  artworks: Array<Record<string, unknown>>;
  artworkOverrides: Record<string, Record<string, unknown>>;
  artworkMedia: Record<string, Record<string, unknown>>;
  siteMedia: Record<string, unknown>;
  siteBranding: Record<string, unknown>;
  sponsoredCampaign: Record<string, unknown>;
  advertisingSettings: Record<string, unknown>;
  categories: Array<{ name: string; icon?: string }>;
  categoryAliases: Record<string, string>;
  assets: Record<string, ManagedCloudinaryAsset>;
};

const headers = (token: string) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

const contentPath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

async function githubRequest<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    // Each owner save retry must receive a fresh Contents API SHA. A cached read
    // can repeatedly return the pre-save revision after a successful commit.
    cache: init?.cache ?? "no-store",
    headers: { ...headers(token), ...(init?.headers ?? {}) },
  });
  if (response.ok) {
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  const data = await response.json().catch(() => ({ message: "GitHub did not provide an error message." })) as { message?: string };
  throw new Error(data.message ?? `GitHub request failed (${response.status}).`);
}

export async function verifyGitHubOwnerSession(token: string) {
  const identity = await githubRequest<GitHubIdentity>(token, "/user");
  const repository = await githubRequest<GitHubRepository>(token, `/repos/${REPOSITORY}`);
  if (!repository.permissions?.push && !repository.permissions?.admin) {
    throw new Error("This GitHub token can read the repository but cannot write to inkprowl/inkprowl. Create a fine-grained token with repository Contents and Actions write access.");
  }
  return identity;
}

export async function readRepositoryJson<T>(token: string, path: string): Promise<RepositoryDocument<T>> {
  // GitHub's Contents endpoint can briefly continue returning the previous SHA
  // immediately after a commit. A unique query parameter avoids a CDN/browser
  // cache replay while cache:no-store prevents a local response replay.
  const file = await githubRequest<{ content: string; encoding: string; sha: string }>(token, `/repos/${REPOSITORY}/contents/${contentPath(path)}?ref=main&cache_bust=${Date.now()}`);
  if (file.encoding !== "base64") throw new Error("GitHub returned an unsupported document encoding.");
  const text = atob(file.content.replace(/\n/g, ""));
  return { value: JSON.parse(text) as T, sha: file.sha };
}

export async function writeRepositoryText(token: string, path: string, text: string, message: string, sha?: string, alreadyBase64 = false) {
  const body = {
    message,
    content: alreadyBase64 ? text : toBase64(text),
    branch: "main",
    ...(sha ? { sha } : {}),
  };
  return githubRequest(token, `/repos/${REPOSITORY}/contents/${contentPath(path)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function writeRepositoryJson(token: string, path: string, value: unknown, message: string, sha: string) {
  return writeRepositoryText(token, path, `${JSON.stringify(value, null, 2)}\n`, message, sha);
}

function isStaleRevisionError(reason: unknown) {
  const message = reason instanceof Error ? reason.message.toLowerCase() : "";
  return message.includes("does not match") || message.includes("stale") || message.includes("conflict");
}

/**
 * Re-reads the generated catalogue after a rejected stale-SHA write and reapplies
 * an idempotent owner mutation. GitHub Contents commits are otherwise atomic.
 */
export async function mutateGeneratedCatalogue(
  token: string,
  message: string,
  mutate: (catalogue: OwnerGeneratedCatalogue) => void,
  maxAttempts = 6,
) {
  let lastFailure: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const document = await readRepositoryJson<Partial<OwnerGeneratedCatalogue>>(token, GENERATED_CATALOGUE_PATH);
    const next = normalizeOwnerCatalogue(document.value);
    mutate(next);
    try {
      await writeRepositoryJson(token, GENERATED_CATALOGUE_PATH, next, message, document.sha);
      return next;
    } catch (reason) {
      lastFailure = reason;
      if (!isStaleRevisionError(reason)) throw reason;
      // Allow GitHub's distributed Contents view to converge after a competing
      // commit. The total wait is capped below 20 seconds across six attempts.
      if (attempt < maxAttempts - 1) await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
  const detail = lastFailure instanceof Error ? lastFailure.message : "GitHub did not provide an error message.";
  throw new Error(`The public catalogue changed repeatedly while saving. Please save once more; no catalogue content was changed. (${detail})`);
}

export async function queueIncomingFile(token: string, filename: string, file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return writeRepositoryText(token, `incoming/${filename}`, toBase64(bytes), `chore: queue ${filename} for Cloudinary`, undefined, true);
}

export async function dispatchCloudinaryDeletion(token: string, assetKey: string) {
  return githubRequest(token, `/repos/${REPOSITORY}/actions/workflows/sync-cloudinary-media.yml/dispatches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref: "main", inputs: { operation: "delete", asset_key: assetKey } }),
  });
}

export function emptyOwnerCatalogue(): OwnerGeneratedCatalogue {
  return {
    artworks: [],
    artworkOverrides: {},
    artworkMedia: {},
    siteMedia: {},
    siteBranding: {},
    sponsoredCampaign: {},
    advertisingSettings: {},
    categories: [],
    categoryAliases: {},
    assets: {},
  };
}

export function normalizeOwnerCatalogue(value: Partial<OwnerGeneratedCatalogue>): OwnerGeneratedCatalogue {
  return { ...emptyOwnerCatalogue(), ...value };
}

export function toBase64(value: string | Uint8Array) {
  if (typeof value === "string") return btoa(unescape(encodeURIComponent(value)));
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < value.length; index += chunkSize) {
    const chunk = value.subarray(index, index + chunkSize);
    for (let byteIndex = 0; byteIndex < chunk.length; byteIndex += 1) binary += String.fromCharCode(chunk[byteIndex]);
  }
  return btoa(binary);
}
