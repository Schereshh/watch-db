import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createTmdbClient } from "./client";

const fetchMock = vi.fn();

describe("createTmdbClient", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests TMDB with bearer authentication and query params", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const client = createTmdbClient({ accessToken: "test-token" });
    const result = await client.request<{ ok: boolean }>("/search/movie", {
      query: "matrix",
      page: 2,
      include_adult: false,
      unused: undefined,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://api.themoviedb.org/3/search/movie?query=matrix&page=2&include_adult=false",
    );
    expect(init.headers).toEqual({
      Accept: "application/json",
      Authorization: "Bearer test-token",
    });
  });

  it("throws when TMDB responds with an error", async () => {
    fetchMock.mockResolvedValue(
      new Response("Unauthorized", {
        status: 401,
      }),
    );

    const client = createTmdbClient({ accessToken: "bad-token" });

    await expect(client.request("/movie/550")).rejects.toThrow(
      "TMDB request failed (401): Unauthorized",
    );
  });
});
