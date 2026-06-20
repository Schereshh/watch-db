import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ApiRequestError,
  fetchWatchedMovies,
  fetchWatchedState,
  markAsWatched,
  removeFromWatched,
} from "./watched";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), init);
}

describe("watched service", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches watched state for a movie", async () => {
    const watchedState = {
      authenticated: true,
      isWatched: true,
      rating: 5,
      watchedAt: "2026-06-20",
      loggedAt: "2026-06-20T10:00:00Z",
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchedState }));

    await expect(fetchWatchedState(550)).resolves.toEqual(watchedState);
    expect(fetchMock).toHaveBeenCalledWith("/api/watched/550", {
      method: "GET",
      credentials: "same-origin",
    });
  });

  it("fetches watched movies with pagination parameters", async () => {
    const page = {
      movies: [],
      page: 3,
      pageSize: 10,
      totalCount: 25,
      nextPage: null,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: page }));

    await expect(fetchWatchedMovies({ page: 3, limit: 10 })).resolves.toEqual(page);
    expect(fetchMock).toHaveBeenCalledWith("/api/watched?page=3&limit=10", {
      method: "GET",
      credentials: "same-origin",
    });
  });

  it("marks a movie as watched with rating and date", async () => {
    const watchedState = {
      authenticated: true,
      isWatched: true,
      rating: 4,
      watchedAt: "2026-06-20",
      loggedAt: "2026-06-20T10:00:00Z",
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchedState }, { status: 201 }));

    await expect(
      markAsWatched(550, {
        rating: 4,
        watchedAt: "2026-06-20",
      }),
    ).resolves.toEqual(watchedState);

    expect(fetchMock).toHaveBeenCalledWith("/api/watched/550", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: 4,
        watchedAt: "2026-06-20",
      }),
    });
  });

  it("removes a movie from watched", async () => {
    const watchedState = {
      authenticated: true,
      isWatched: false,
      rating: null,
      watchedAt: null,
      loggedAt: null,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: watchedState }));

    await expect(removeFromWatched(550)).resolves.toEqual(watchedState);
    expect(fetchMock).toHaveBeenCalledWith("/api/watched/550", {
      method: "DELETE",
      credentials: "same-origin",
    });
  });

  it("throws ApiRequestError when the API returns an error envelope", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: "Authentication required" }, { status: 401 }),
    );

    const promise = fetchWatchedState(550);

    await expect(promise).rejects.toMatchObject({
      message: "Authentication required",
      status: 401,
    });
    await expect(promise).rejects.toBeInstanceOf(ApiRequestError);
  });
});
