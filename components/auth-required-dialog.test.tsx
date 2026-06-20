import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthRequiredDialog from "./auth-required-dialog";

describe("AuthRequiredDialog", () => {
  it("renders the default authentication message and auth links", () => {
    render(<AuthRequiredDialog open onOpenChange={vi.fn()} />);

    expect(screen.getByRole("dialog")).toHaveTextContent("Authentication required");
    expect(screen.getByText("Log in or create an account to continue.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders an action-specific description", () => {
    render(
      <AuthRequiredDialog
        open
        onOpenChange={vi.fn()}
        actionLabel="save movies to your watchlist"
      />,
    );

    expect(
      screen.getByText(
        "Log in or create an account to save movies to your watchlist.",
      ),
    ).toBeVisible();
  });
});
