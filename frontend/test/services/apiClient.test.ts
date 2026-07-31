import { ApiError, apiUrl, requestJson } from "@/services/apiClient";

describe("apiClient", () => {
  it("builds normalized API URLs", () => {
    expect(apiUrl("/users")).toMatch(/^https?:\/\/.+\/users$/);
    expect(apiUrl("users")).not.toContain("//users");
  });

  it("rejects requests when the session token is absent", async () => {
    await expect(requestJson("/users")).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
    });
  });

  it("sends authorization and JSON headers and returns JSON", async () => {
    localStorage.setItem("idToken", "token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(
      requestJson("/users", { method: "POST", body: "{}" }),
    ).resolves.toEqual({ ok: true });

    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer token");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("preserves a caller-provided content type", async () => {
    localStorage.setItem("idToken", "token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("created", { status: 200 }),
    );

    await requestJson("/users", {
      method: "POST",
      body: "body",
      headers: { "Content-Type": "text/plain" },
    });

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Content-Type")).toBe("text/plain");
  });

  it("throws an ApiError using an API-provided error message", async () => {
    localStorage.setItem("idToken", "token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Not allowed" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(requestJson("/users")).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: "ApiError",
        message: "Not allowed",
        status: 403,
        details: { error: "Not allowed" },
      }),
    );
  });

  it("uses a status message for non-JSON failures", async () => {
    localStorage.setItem("idToken", "token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("bad gateway", { status: 502 }),
    );

    await expect(requestJson("/users")).rejects.toMatchObject({
      message: "Request failed with status 502",
      status: 502,
      details: "bad gateway",
    });
  });
});
