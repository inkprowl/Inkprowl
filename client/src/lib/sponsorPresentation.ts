export function sponsorDisplayName(clientName?: string) {
  const normalized = clientName?.trim() ?? "";
  if (!normalized || /^(?:vid(?:eo)?|sponsor)(?=$|[\s_-])/i.test(normalized)) return "Sponsored film";
  return normalized;
}
