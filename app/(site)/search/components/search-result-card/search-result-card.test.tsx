import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SearchResultCard from "./search-result-card";

const movie = {
  id: 550,
  title: "Fight Club",
  overview: "An insomniac office worker forms an underground club.",
  posterPath: "/poster.jpg",
  releaseDate: "1999-10-15",
  voteAverage: 8.4,
};

describe("SearchResultCard", () => {
  it("renders movie information and links to the movie page", () => {
    render(<SearchResultCard movie={movie} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/movies/550");
    expect(screen.getByRole("heading", { name: "Fight Club" })).toBeVisible();
    expect(screen.getByText("1999")).toBeVisible();
    expect(screen.getByText("8.4")).toBeVisible();
    expect(screen.getByLabelText("4 out of 5 stars")).toBeVisible();
  });

  it("renders fallback copy without poster, overview, or release date", () => {
    render(
      <SearchResultCard
        movie={{
          ...movie,
          overview: "",
          posterPath: null,
          releaseDate: "",
          voteAverage: 0,
        }}
      />,
    );

    expect(screen.getByText("No poster")).toBeVisible();
    expect(screen.getByText("No overview is available for this movie.")).toBeVisible();
    expect(screen.getByText("Unknown release")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
    expect(screen.getByLabelText("0 out of 5 stars")).toBeVisible();
  });
});
