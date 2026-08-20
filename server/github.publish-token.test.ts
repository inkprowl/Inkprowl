import { describe, expect, it } from "vitest";

describe("GitHub publishing token", () => {
  it("can write to the public INKPROWL repository", async () => {
    const token = process.env.INKPROWL_CLASSIC_PUBLISH_TOKEN;
    expect(token).toBeTruthy();

    const response = await fetch("https://api.github.com/repos/inkprowl/inkprowl", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    expect(response.ok).toBe(true);
    const scopes = response.headers.get("x-oauth-scopes")?.split(",").map((scope) => scope.trim()) ?? [];
    expect(scopes).toContain("repo");
    expect(scopes).toContain("workflow");
    const repository = await response.json() as { permissions?: { push?: boolean } };
    expect(repository.permissions?.push).toBe(true);
  });
});
