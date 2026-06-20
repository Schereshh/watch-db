import { describe, expect, it } from "vitest";

import {
  formatLanguage,
  formatReleaseDate,
  formatRuntime,
  formatVoteAverage,
  formatVoteCount,
} from "./formatters";

describe("formatters", () => {
  it("formats vote counts compactly", () => {
    expect(formatVoteCount(15320)).toBe("15.3K");
  });

  it("formats vote averages and hides zero values", () => {
    expect(formatVoteAverage(8.456)).toBe("8.5");
    expect(formatVoteAverage(0)).toBe("N/A");
  });

  it("formats runtime values", () => {
    expect(formatRuntime(null)).toBe("Unknown runtime");
    expect(formatRuntime(45)).toBe("45m");
    expect(formatRuntime(125)).toBe("2h 5m");
  });

  it("formats release dates and handles missing values", () => {
    expect(formatReleaseDate("")).toBe("Unknown release");
    expect(formatReleaseDate("1999-10-15")).toBe("Oct 15, 1999");
  });

  it("formats language names", () => {
    expect(formatLanguage("")).toBe("Unknown");
    expect(formatLanguage("en")).toBe("English");
  });
});
