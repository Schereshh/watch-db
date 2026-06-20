import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import WatchlistButton from "./watchlist-button";

type WatchlistApiState = {
  authenticated: boolean;
  inWatchlist: boolean;
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

function mockWatchlistApi(initialState: WatchlistApiState) {
  let state = initialState;

  fetchMock.mockImplementation(async (input: string | URL | Request, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : input.toString();
    const method = init?.method ?? "GET";

    if (!url.endsWith("/api/watchlist/550")) {
      return jsonResponse({ error: `Unhandled request: ${method} ${url}` }, { status: 500 });
    }

    if (method === "GET") {
      return jsonResponse({ data: state });
    }

    if (method === "POST") {
      state = {
        authenticated: true,
        inWatchlist: true,
      };

      return jsonResponse({ data: state }, { status: 201 });
    }

    if (method === "DELETE") {
      state = {
        authenticated: true,
        inWatchlist: false,
      };

      return jsonResponse({ data: state });
    }

    return jsonResponse({ error: `Unhandled method: ${method}` }, { status: 500 });
  });
}

describe("WatchlistButton integration", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the authentication dialog when the user is not signed in", async () => {
    mockWatchlistApi({
      authenticated: false,
      inWatchlist: false,
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchlistButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Add to Watchlist" }));

    expect(screen.getByRole("dialog")).toHaveTextContent("Authentication required");
    expect(screen.getByText(/save movies to your watchlist/i)).toBeVisible();
  });

  it("adds a movie to the watchlist", async () => {
    mockWatchlistApi({
      authenticated: true,
      inWatchlist: false,
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchlistButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Add to Watchlist" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove from Watchlist" })).toBeVisible();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist/550", {
      method: "POST",
      credentials: "same-origin",
    });
  });

  it("removes a movie from the watchlist", async () => {
    mockWatchlistApi({
      authenticated: true,
      inWatchlist: true,
    });

    const user = userEvent.setup();
    renderWithQueryClient(<WatchlistButton movieId={550} />);

    await user.click(await screen.findByRole("button", { name: "Remove from Watchlist" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add to Watchlist" })).toBeVisible();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/watchlist/550", {
      method: "DELETE",
      credentials: "same-origin",
    });
  });
});
