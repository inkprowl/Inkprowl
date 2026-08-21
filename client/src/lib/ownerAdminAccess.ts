export function isConfiguredOwnerAccess(identifier: string, password: string) {
  return identifier.trim().toUpperCase() === "INKPROWL" && password === "INKPROWL@2027";
}
