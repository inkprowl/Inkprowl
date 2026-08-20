export const OWNER_SESSION_COOKIE_NAME = "inkprowl_owner_session";
const OWNER_SESSION_COOKIE_VALUE = "active";
const OWNER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export function isConfiguredOwnerAccess(identifier: string, password: string) {
  return identifier.trim().toUpperCase() === "INKPROWL" && password === "INKPROWL@2027";
}

export function hasOwnerAdminSession(cookieSource = typeof document === "undefined" ? "" : document.cookie) {
  return cookieSource.split(";").some((entry) => entry.trim() === `${OWNER_SESSION_COOKIE_NAME}=${OWNER_SESSION_COOKIE_VALUE}`);
}

export function ownerSessionCookieValue() {
  return `${OWNER_SESSION_COOKIE_NAME}=${OWNER_SESSION_COOKIE_VALUE}; Path=/; Max-Age=${OWNER_SESSION_MAX_AGE_SECONDS}; SameSite=Strict`;
}

export function ownerSessionClearCookieValue() {
  return `${OWNER_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`;
}

export function persistOwnerAdminSession() {
  if (typeof document !== "undefined") document.cookie = ownerSessionCookieValue();
}

export function clearOwnerAdminSession() {
  if (typeof document !== "undefined") document.cookie = ownerSessionClearCookieValue();
}
