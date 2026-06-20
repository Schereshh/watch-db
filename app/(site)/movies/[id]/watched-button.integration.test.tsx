import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import WatchedButton from "./watched-button";

type WatchedApiState = {
  authenticated: boolean;
  isWatched: boolean;
  rating: number | null;
  watchedAt: string | null;
  loggedAt: string | null;
};

const fetchMock = vi.fn();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), init);
}

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  );
}

function mockWatchedApi(initialState: WatchedApiState) {
  let state = initialState;

  fetchMock.mockImplementation(async (input: string | URL | Request, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : input.toString();
    const method = init?.method ?? "GET";

    if (!url.endsWith("/api/watched/550")) {
      return jsonResponse({ error: `Unhandled request: ${method} ${url}` }, { status: 500 });
    }

    if (method === "GET") {
      return jsonResponse({ data: state });
    }

    if (method === "POST") {
      const body = init?.body ? JSON.parse(init.body.toString()) : {};
      state = {
        authenticated: true,
        isWatched: true,
        rating: body.rating ?? null,
        watchedAt: body.watchedAt ?? null,
        loggedAt: "2026-06-20T10:00:00Z",
      };

      return jsonResponse({ data: state }, { status: 201 });
    }

    if (method === "DELETE") {
      state = {
        authenticated: true,
        isWatched: false,
        rating: null,
        watchedAt: null,
        loggedAt: null,
      };

      return jsonResponse({ data: state });
    }

    return jsonResponse({ error: `Unhandled method: ${method}` }, { status: 500 });
  });
}

describe("WatchedButton integration", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the authentication dialog when the user is not signed in", async () => {
    mockWatchedApi({
      authenticated: false,
      isWatched: false,
      rating: null,
      watchedAt: null,
      loggedAt: null,
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchedButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Mark as Watched" }));

    expect(screen.getByRole("dialog")).toHaveTextContent("Authentication required");
    expect(screen.getByText(/mark movies as watched/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("marks an authenticated user's movie as watched through the dialog", async () => {
    mockWatchedApi({
      authenticated: true,
      isWatched: false,
      rating: null,
      watchedAt: "2026-06-20",
      loggedAt: null,
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchedButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Mark as Watched" }));
    await user.click(screen.getByRole("radio", { name: "5 out of 5" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove from Watched" })).toBeVisible();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/watched/550",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          rating: 5,
          watchedAt: "2026-06-20",
        }),
      }),
    );
  });

  it("removes an already watched movie", async () => {
    mockWatchedApi({
      authenticated: true,
      isWatched: true,
      rating: 4,
      watchedAt: "2026-06-20",
      loggedAt: "2026-06-20T10:00:00Z",
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchedButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Remove from Watched" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Mark as Watched" })).toBeVisible();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/watched/550", {
      method: "DELETE",
      credentials: "same-origin",
    });
  });
});
