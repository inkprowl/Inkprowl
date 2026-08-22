import type { GitHubIdentity } from "./githubOwnerSession";

const OWNER_UNLOCK_KEY = "inkprowl.owner-unlocked";
const OWNER_CONNECTION_KEY = "inkprowl.owner-github-connection";

let ownerCredential: string | null = null;
let ownerAdminUnlocked = false;
let ownerConnection: { token: string; identity: GitHubIdentity } | null = null;

type StoredConnection = { token?: unknown; identity?: { login?: unknown; avatar_url?: unknown } };

function sessionStore(): Storage | null {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function restoreOwnerSession() {
  const store = sessionStore();
  if (!store) return;
  try {
    ownerAdminUnlocked = ownerAdminUnlocked || store.getItem(OWNER_UNLOCK_KEY) === "true";
    if (ownerConnection) return;
    const raw = store.getItem(OWNER_CONNECTION_KEY);
    if (!raw) return;
    const candidate = JSON.parse(raw) as StoredConnection;
    if (typeof candidate.token !== "string" || !candidate.token.trim() || typeof candidate.identity?.login !== "string" || !candidate.identity.login.trim()) return;
    const identity: GitHubIdentity = {
      login: candidate.identity.login,
      ...(typeof candidate.identity.avatar_url === "string" ? { avatar_url: candidate.identity.avatar_url } : {}),
    };
    ownerCredential = candidate.token;
    ownerConnection = { token: candidate.token, identity };
    ownerAdminUnlocked = true;
  } catch {
    store.removeItem(OWNER_CONNECTION_KEY);
  }
}

/**
 * The owner has approved browser session storage for this connection. It is not
 * committed to source, never reaches Cloudinary, and expires when this tab is closed.
 */
export function readOwnerPublishingCredential() {
  restoreOwnerSession();
  return ownerCredential;
}

export function readOwnerAdminSession() {
  restoreOwnerSession();
  return ownerAdminUnlocked;
}

export function readOwnerPublishingConnection() {
  restoreOwnerSession();
  return ownerConnection;
}

export function unlockOwnerAdminSession() {
  ownerAdminUnlocked = true;
  sessionStore()?.setItem(OWNER_UNLOCK_KEY, "true");
}

export function persistOwnerPublishingCredential(token: string) {
  ownerCredential = token.trim() || null;
}

export function persistOwnerPublishingConnection(token: string, identity: GitHubIdentity) {
  const credential = token.trim();
  if (!credential) return;
  ownerCredential = credential;
  ownerConnection = { token: credential, identity };
  ownerAdminUnlocked = true;
  sessionStore()?.setItem(OWNER_UNLOCK_KEY, "true");
  sessionStore()?.setItem(OWNER_CONNECTION_KEY, JSON.stringify(ownerConnection));
}

export function clearOwnerPublishingCredential() {
  ownerCredential = null;
  ownerAdminUnlocked = false;
  ownerConnection = null;
  const store = sessionStore();
  store?.removeItem(OWNER_UNLOCK_KEY);
  store?.removeItem(OWNER_CONNECTION_KEY);
}

/** Test-only simulation of a browser refresh without destroying session storage. */
export function restoreOwnerPublishingSessionForTest() {
  ownerCredential = null;
  ownerAdminUnlocked = false;
  ownerConnection = null;
  restoreOwnerSession();
}
