import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, GET, POST } from "./route";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

type SupabaseMockOptions = {
  user?: { id: string } | null;
  watchedMaybeSingleResult?: {
    data: unknown;
    error: { message: string } | null;
  };
  insertResult?: {
    data: {
      rating: number | null;
      watched_at: string | null;
      logged_at: string | null;
    };
    error: { message: string } | null;
  };
  watchedDeleteResult?: { error: { message: string } | null };
  watchlistDeleteResult?: { error: { message: string } | null };
};

function context(movieId: string) {
  return {
    params: Promise.resolve({ movieId }),
  };
}

function request(body?: unknown) {
  return new NextRequest("http://localhost/api/watched/550", {
    method: body === undefined ? "GET" : "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function mockSupabase({
  user = { id: "user-1" },
  watchedMaybeSingleResult = { data: null, error: null },
  insertResult = {
    data: {
      rating: 5,
      watched_at: "2026-06-20",
      logged_at: "2026-06-20T10:00:00Z",
    },
    error: null,
  },
  watchedDeleteResult = { error: null },
  watchlistDeleteResult = { error: null },
}: SupabaseMockOptions = {}) {
  const watchedMaybeSingle = vi.fn().mockResolvedValue(watchedMaybeSingleResult);
  const watchedSingle = vi.fn().mockResolvedValue(insertResult);
  const watchedEq = vi.fn(() => watchedChain);
  const watchedChain = {
    select: vi.fn(() => watchedChain),
    eq: watchedEq,
    order: vi.fn(() => watchedChain),
    limit: vi.fn(() => watchedChain),
    maybeSingle: watchedMaybeSingle,
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: watchedSingle,
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue(watchedDeleteResult),
      })),
    })),
  };

  const watchlistChain = {
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue(watchlistDeleteResult),
      })),
    })),
  };

  const supabase = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
      }),
    },
    from: vi.fn((table: string) =>
      table === "watchlist" ? watchlistChain : watchedChain,
    ),
  };

  mocks.createClient.mockResolvedValue(supabase);

  return { supabase, watchedChain, watchlistChain };
}

describe("/api/watched/[movieId]", () => {
  beforeEach(() => {
    mocks.createClient.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it("returns 400 for invalid movie ids", async () => {
    const response = await GET(request(), context("nope"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid movie id" });
  });

  it("returns an anonymous watched state for unauthenticated users", async () => {
    mockSupabase({ user: null });

    const response = await GET(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: false,
        isWatched: false,
        rating: null,
        watchedAt: null,
        loggedAt: null,
      },
    });
  });

  it("returns watched state for authenticated users", async () => {
    mockSupabase({
      watchedMaybeSingleResult: {
        data: {
          rating: 4,
          watched_at: "2026-06-20",
          logged_at: "2026-06-20T10:00:00Z",
        },
        error: null,
      },
    });

    const response = await GET(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        isWatched: true,
        rating: 4,
        watchedAt: "2026-06-20",
        loggedAt: "2026-06-20T10:00:00Z",
      },
    });
  });

  it("validates rating before writing", async () => {
    const response = await POST(request({ rating: 6 }), context("550"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Rating must be an integer between 1 and 5",
    });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("validates watched date before writing", async () => {
    const response = await POST(
      request({ rating: 4, watchedAt: "not-a-date" }),
      context("550"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "watchedAt must be a valid YYYY-MM-DD date",
    });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("requires authentication before marking a movie as watched", async () => {
    mockSupabase({ user: null });

    const response = await POST(
      request({ rating: 4, watchedAt: "2026-06-20" }),
      context("550"),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Authentication required",
    });
  });

  it("marks a movie as watched and removes it from watchlist", async () => {
    const { supabase, watchedChain, watchlistChain } = mockSupabase();

    const response = await POST(
      request({ rating: 5, watchedAt: "2026-06-20" }),
      context("550"),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        isWatched: true,
        rating: 5,
        watchedAt: "2026-06-20",
        loggedAt: "2026-06-20T10:00:00Z",
      },
    });
    expect(supabase.from).toHaveBeenCalledWith("watched");
    expect(supabase.from).toHaveBeenCalledWith("watchlist");
    expect(watchedChain.insert).toHaveBeenCalledWith({
      user_id: "user-1",
      tmdb_movie_id: 550,
      rating: 5,
      watched_at: "2026-06-20",
    });
    expect(watchlistChain.delete).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/movies/550");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("removes a movie from watched", async () => {
    mockSupabase();

    const response = await DELETE(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        isWatched: false,
        rating: null,
        watchedAt: null,
        loggedAt: null,
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/movies/550");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/profile");
  });
});
