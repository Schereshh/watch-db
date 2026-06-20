import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RatingInput from "./rating-input";

describe("RatingInput", () => {
  it("renders the configured number of rating options", () => {
    render(<RatingInput value={3} onChange={vi.fn()} label="Movie rating" />);

    expect(
      screen.getByRole("radiogroup", { name: "Movie rating" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "3 out of 5" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onChange with the selected rating", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RatingInput value={null} onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "4 out of 5" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not allow changes while disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RatingInput value={null} onChange={onChange} disabled />);

    const option = screen.getByRole("radio", { name: "1 out of 5" });
    expect(option).toBeDisabled();

    await user.click(option);

    expect(onChange).not.toHaveBeenCalled();
  });
});
