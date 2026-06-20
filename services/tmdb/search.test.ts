import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { searchMovies } from "./search";

const mocks = vi.hoisted(() => ({
  createTmdbClient: vi.fn(),
  request: vi.fn(),
}));

vi.mock("./client", () => ({
  createTmdbClient: mocks.createTmdbClient,
}));

describe("searchMovies", () => {
  beforeEach(() => {
    vi.stubEnv("TMDB_ACCESS_TOKEN", "test-token");
    mocks.request.mockReset();
    mocks.createTmdbClient.mockReset();
    mocks.createTmdbClient.mockReturnValue({
      request: mocks.request,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes TMDB search results", async () => {
    mocks.request.mockResolvedValue({
      page: 2,
      total_pages: 12,
      total_results: 235,
      results: [
        {
          id: 550,
          title: "Fight Club",
          overview: "An insomniac office worker forms an underground club.",
          poster_path: "/poster.jpg",
          release_date: "1999-10-15",
          vote_average: 8.4,
        },
      ],
    });

    const result = await searchMovies("fight club", {
      page: 2,
      includeAdult: true,
      language: "hu-HU",
    });

    expect(mocks.createTmdbClient).toHaveBeenCalledWith({
      accessToken: "test-token",
    });
    expect(mocks.request).toHaveBeenCalledWith("/search/movie", {
      query: "fight club",
      page: 2,
      include_adult: true,
      language: "hu-HU",
    });
    expect(result).toEqual({
      page: 2,
      totalPages: 12,
      totalResults: 235,
      results: [
        {
          id: 550,
          title: "Fight Club",
          overview: "An insomniac office worker forms an underground club.",
          posterPath: "/poster.jpg",
          releaseDate: "1999-10-15",
          voteAverage: 8.4,
        },
      ],
    });
  });

  it("uses default search options", async () => {
    mocks.request.mockResolvedValue({
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: [],
    });

    await searchMovies("matrix");

    expect(mocks.request).toHaveBeenCalledWith("/search/movie", {
      query: "matrix",
      page: 1,
      include_adult: false,
      language: "en-US",
    });
  });

  it("throws when TMDB_ACCESS_TOKEN is missing", async () => {
    vi.stubEnv("TMDB_ACCESS_TOKEN", "");

    await expect(searchMovies("matrix")).rejects.toThrow(
      "TMDB_ACCESS_TOKEN is not set",
    );
    expect(mocks.createTmdbClient).not.toHaveBeenCalled();
  });
});
