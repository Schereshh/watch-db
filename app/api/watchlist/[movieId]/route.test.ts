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
  maybeSingleResult?: { data: unknown; error: { message: string } | null };
  upsertResult?: { error: { message: string } | null };
  deleteResult?: { error: { message: string } | null };
};

function context(movieId: string) {
  return {
    params: Promise.resolve({ movieId }),
  };
}

function request() {
  return new NextRequest("http://localhost/api/watchlist/550");
}

function mockSupabase({
  user = { id: "user-1" },
  maybeSingleResult = { data: null, error: null },
  upsertResult = { error: null },
  deleteResult = { error: null },
}: SupabaseMockOptions = {}) {
  const maybeSingle = vi.fn().mockResolvedValue(maybeSingleResult);
  const eq = vi.fn();
  const chain: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  } = {
    select: vi.fn(() => chain),
    eq,
    maybeSingle,
    upsert: vi.fn().mockResolvedValue(upsertResult),
    delete: vi.fn(() => chain),
  };

  eq.mockReturnValue(chain);
  chain.delete.mockReturnValue({
    eq: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue(deleteResult),
    })),
  });

  const supabase = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
      }),
    },
    from: vi.fn(() => chain),
  };

  mocks.createClient.mockResolvedValue(supabase);

  return { supabase, chain };
}

describe("/api/watchlist/[movieId]", () => {
  beforeEach(() => {
    mocks.createClient.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it("returns 400 for invalid movie ids", async () => {
    const response = await GET(request(), context("nope"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid movie id" });
  });

  it("returns unauthenticated state for anonymous GET requests", async () => {
    mockSupabase({ user: null });

    const response = await GET(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: false,
        inWatchlist: false,
      },
    });
  });

  it("returns the authenticated watchlist state", async () => {
    mockSupabase({
      maybeSingleResult: {
        data: { id: "row-1" },
        error: null,
      },
    });

    const response = await GET(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        inWatchlist: true,
      },
    });
  });

  it("requires authentication before adding a movie", async () => {
    mockSupabase({ user: null });

    const response = await POST(request(), context("550"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Authentication required",
    });
  });

  it("adds a movie and revalidates related paths", async () => {
    const { supabase, chain } = mockSupabase();

    const response = await POST(request(), context("550"));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        inWatchlist: true,
      },
    });
    expect(supabase.from).toHaveBeenCalledWith("watchlist");
    expect(chain.upsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        tmdb_movie_id: 550,
      },
      {
        onConflict: "user_id,tmdb_movie_id",
        ignoreDuplicates: true,
      },
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/movies/550");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("removes a movie and revalidates related paths", async () => {
    mockSupabase();

    const response = await DELETE(request(), context("550"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: true,
        inWatchlist: false,
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/movies/550");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/profile");
  });
});
