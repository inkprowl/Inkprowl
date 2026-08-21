let ownerCredential: string | null = null;

/**
 * Holds the publishing credential only in JavaScript memory for the open page.
 * It is lost on refresh, tab close, logout, and browser restart.
 */
export function readOwnerPublishingCredential() {
  return ownerCredential;
}

export function persistOwnerPublishingCredential(token: string) {
  ownerCredential = token.trim() || null;
}

export function clearOwnerPublishingCredential() {
  ownerCredential = null;
}
