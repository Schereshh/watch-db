import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MarkWatchedDialog from "./mark-watched-dialog";

describe("MarkWatchedDialog", () => {
  it("asks for a rating before saving", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <MarkWatchedDialog
        open
        onOpenChange={vi.fn()}
        onSave={onSave}
        initialWatchedAt="2026-06-20"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Select a rating before saving.")).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("submits the selected rating and watched date", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <MarkWatchedDialog
        open
        onOpenChange={vi.fn()}
        onSave={onSave}
        initialWatchedAt="2026-06-19"
      />,
    );

    await user.click(screen.getByRole("radio", { name: "4 out of 5" }));

    const watchedAtInput = screen.getByLabelText("Watched date");
    await user.clear(watchedAtInput);
    await user.type(watchedAtInput, "2026-06-20");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith({
      rating: 4,
      watchedAt: "2026-06-20",
    });
  });

  it("does not close from the cancel button while saving", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <MarkWatchedDialog
        open
        isSaving
        onOpenChange={onOpenChange}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
