const OWNER_PUBLISHING_SESSION_KEY = "inkprowl_owner_publishing_connection";

export function readOwnerPublishingCredential() {
  if (typeof window === "undefined") return null;
  const token = window.sessionStorage.getItem(OWNER_PUBLISHING_SESSION_KEY);
  return token?.trim() || null;
}

export function persistOwnerPublishingCredential(token: string) {
  if (typeof window !== "undefined") window.sessionStorage.setItem(OWNER_PUBLISHING_SESSION_KEY, token);
}

export function clearOwnerPublishingCredential() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(OWNER_PUBLISHING_SESSION_KEY);
}
