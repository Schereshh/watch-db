import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  searchMovies: vi.fn(),
}));

vi.mock("@/services/tmdb/search", () => ({
  searchMovies: mocks.searchMovies,
}));

function request(url: string) {
  return new NextRequest(url);
}

describe("GET /api/search", () => {
  beforeEach(() => {
    mocks.searchMovies.mockReset();
  });

  it("returns 400 when the query is missing", async () => {
    const response = await GET(request("http://localhost/api/search"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing search query",
    });
    expect(mocks.searchMovies).not.toHaveBeenCalled();
  });

  it("searches movies with normalized page params", async () => {
    const searchResponse = {
      page: 2,
      totalPages: 3,
      totalResults: 42,
      results: [],
    };
    mocks.searchMovies.mockResolvedValue(searchResponse);

    const response = await GET(
      request("http://localhost/api/search?query=matrix&page=2"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: searchResponse });
    expect(mocks.searchMovies).toHaveBeenCalledWith("matrix", { page: 2 });
  });

  it("uses page 1 for invalid page params", async () => {
    mocks.searchMovies.mockResolvedValue({
      page: 1,
      totalPages: 0,
      totalResults: 0,
      results: [],
    });

    await GET(request("http://localhost/api/search?query=matrix&page=nope"));

    expect(mocks.searchMovies).toHaveBeenCalledWith("matrix", { page: 1 });
  });

  it("returns 502 when TMDB search fails", async () => {
    mocks.searchMovies.mockRejectedValue(new Error("TMDB down"));

    const response = await GET(request("http://localhost/api/search?query=matrix"));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "TMDB search failed",
      details: {
        message: "TMDB down",
      },
    });
  });
});
