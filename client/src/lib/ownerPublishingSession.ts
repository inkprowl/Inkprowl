let ownerCredential: string | null = null;

import type { GitHubIdentity } from "./githubOwnerSession";

let ownerAdminUnlocked = false;
let ownerConnection: { token: string; identity: GitHubIdentity } | null = null;

/**
 * Holds owner access and the publishing credential only in JavaScript memory for the open page.
 * It is lost on refresh, tab close, logout, and browser restart.
 */
export function readOwnerPublishingCredential() {
  return ownerCredential;
}

export function readOwnerAdminSession() {
  return ownerAdminUnlocked;
}

export function readOwnerPublishingConnection() {
  return ownerConnection;
}

export function unlockOwnerAdminSession() {
  ownerAdminUnlocked = true;
}

export function persistOwnerPublishingCredential(token: string) {
  ownerCredential = token.trim() || null;
}

export function persistOwnerPublishingConnection(token: string, identity: GitHubIdentity) {
  const credential = token.trim();
  if (!credential) return;
  ownerCredential = credential;
  ownerConnection = { token: credential, identity };
}

export function clearOwnerPublishingCredential() {
  ownerCredential = null;
  ownerAdminUnlocked = false;
  ownerConnection = null;
}
