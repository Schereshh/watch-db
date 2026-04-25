# WatchDB Copilot Instructions

Use [docs/product-requirements.md](../docs/product-requirements.md) as the default product source of truth for this repository.

When helping in this workspace:
- Check the PRD before making product decisions, feature tradeoffs, or UX recommendations.
- Treat MVP scope as the default target unless the user explicitly asks for v1.1 or v1.2 work.
- Preserve the product direction: simple movie logging first, social features second, no TV tracking, no long-form reviews, no native mobile scope.
- Favor flows that optimize fast search-to-log interactions and a clean, low-friction UX for casual moviegoers.
- Respect the non-functional requirements in the PRD: performance, accessibility, privacy, responsiveness, and server-side protection of secrets.
- For TMDB-backed pages and features, remember the TMDB attribution requirement in the PRD.
- If a request conflicts with the PRD, call out the conflict and ask whether the product direction should change.

Current product assumptions from the PRD:
- Authentication is email/password for MVP.
- Movie data comes from TMDB.
- Profiles should support watched and watchlist views first.
- Social features like public profiles, follows, and feed are post-MVP.

Open questions remain open unless the user decides otherwise:
- 5-star vs. 10-point ratings.
- Optional watch date behavior.
- Whether rewatches should be logged as separate entries.