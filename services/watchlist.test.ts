import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addToWatchlist,
  ApiRequestError,
  fetchWatchlistMovies,
  fetchWatchlistState,
  removeFromWatchlist,
} from "./watchlist";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), init);
}

describe("watchlist service", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches watchlist state for a movie", async () => {
    const watchlistState = {
      authenticated: true,
      inWatchlist: true,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchlistState }));

    await expect(fetchWatchlistState(550)).resolves.toEqual(watchlistState);
    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist/550", {
      method: "GET",
      credentials: "same-origin",
    });
  });

  it("fetches watchlist movies", async () => {
    const response = {
      movies: [
        {
          id: 550,
          title: "Fight Club",
          posterPath: "/poster.jpg",
          addedAt: "2026-06-20T10:00:00Z",
        },
      ],
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: response }));

    await expect(fetchWatchlistMovies()).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist", {
      method: "GET",
      credentials: "same-origin",
    });
  });

  it("adds a movie to the watchlist", async () => {
    const watchlistState = {
      authenticated: true,
      inWatchlist: true,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchlistState }, { status: 201 }));

    await expect(addToWatchlist(550)).resolves.toEqual(watchlistState);
    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist/550", {
      method: "POST",
      credentials: "same-origin",
    });
  });

  it("removes a movie from the watchlist", async () => {
    const watchlistState = {
      authenticated: true,
      inWatchlist: false,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchlistState }));

    await expect(removeFromWatchlist(550)).resolves.toEqual(watchlistState);
    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist/550", {
      method: "DELETE",
      credentials: "same-origin",
    });
  });

  it("throws ApiRequestError when the API returns an error envelope", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: "Failed to load watchlist" }, { status: 500 }),
    );

    const promise = fetchWatchlistMovies();

    await expect(promise).rejects.toMatchObject({
      message: "Failed to load watchlist",
      status: 500,
    });
    await expect(promise).rejects.toBeInstanceOf(ApiRequestError);
  });
});
