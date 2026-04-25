# WatchDB - Social Movie Logging Platform

**Author:** Tamas Seres

**Date:** March 14, 2026

**Version:** 1.0

***

## 1. Overview
### 1.1 Problem Statement
Movie lovers watch films across multiple platforms (streaming services, physical media, theater), but there is no simple way to track the watched movies and share their experiences with friends.
Beyond the tracking aspect, there is a social one. People regularly discuss movies with friends and family, but there is no simple way of sharing your list of watched movies or to check what your friends have been watching.

### 1.2 Product Vision
WatchDB is a web application where users log and rate the movies they watch, manage a personal watchlist and see what their friends are watching. It combines a personal movie diary with a social feed, making it easy to track your own viewings and discover movies through your group.

### 1.3 Target Audience
**Primary audience:** Casual moviegoers who watch 2-10 movies / month and want a simple way to track and share their viewings
**Secondary audience:** Film enthusiasts who want detailed personal stats about their viewing habits

## 2. User Personas

**Persona 1: Casual Tracker - Sara**
- watches 3-5 movies / month via streaming servies and ocasionally in theaters
- often forgets what she's watched
- wants a simple logging platform
- would love to see what her friends rated highly so she can choose accordingly

**Persona 2: Social Movie Fan - James**
- watches 6-8 movies / month, discusses movies with friends and family
- currently shares recommendations through social media platforms and group chats, but it often gets lost
- wants a feed of what his circle is watching and their ratings
- likes being the "movie person" in his friend group and wants a profile which communicates that

**Persona 3: Film Enthusiast - Jake**
- watches 10+ movies / month from different eras and genres, a real cinephile
- wants detailed personal statistics - genres watched, average ratings, trending movies
- like rating and ranking, but doesn't want to write full reviews
- would share his profile publicly as a movie resume

## 3. Market comparision

Product | Strengths | Weaknesses | Our Opportunity
-- | -- | -- | --
IMDb Watchlist | Huge database, established brand | Buried in a cluttered interface, no social features | Clean focused UX, social layer
Trakt | Powerful tracking, good integrations | Primarily TV-focused, complex UI, steep learning curve | Movie-first, simple onboarding
Streaming apps | Built into the viewing experience | Only show their own catalog, no cross-platform tracking | Platform independent, unified tracking

## 4. Goals & Success Metrics

### 4.1 Product Goals
1. Users can find and log any movies quickly and easily
2. Users build a personal history of watched movies
3. Users connect with friends and discover movies through their activity
4. The app feels fast, responsive and easy to use

### 4.2 Success Metrics

Metric | Target (3 months post-launch) | Target (6 months)
-- | -- | --
Registered users | 500 | 2,000
Movies logged per active user / month | 5+ | 8+
Weekly active users | 30% of registered | 40% of registered
Users with 1+ friend connection | - | 60% of users
Average search-to-log time | < 15 seconds | < 10 seconds
Page load time | < 2 seconds | < 2 seconds

## 5. Features & Requirements

### 5.1 Must Have (MVP)
These are required to launch. The product doesn't deliver value without them.

**Authentication**
- sign up with email and password
- log in / log out
- secure session management

**Movie search**
- search movies by title
- results display poster, title, release year, brief overview (and other relevant information)
- data sourced from TMDB API

**Movie details**
- view a movie's full information (poster, title, year, genre, runtime, director, cast, etc.)

**Watchlist**
- add a movie to a "Want to Watch" list with one click
- view all watchlist items on profile
- remove from watchlist

**Watched log**
- mark a movie as watched
- assign a personal rating (1-5 stars)
- view all watched movies on profile
- update or remove a rating

**User profile**
- tabbed view: watched / watchlist
- display movie count for each
- profile is viewable by the user

### 5.2 Should have (v1.1 - Social Foundation)
These bring the social dimension that differentiates WatchDB.

**Public Profiles**
- users have a public profile page accessible via URL
- shows watched count, watchlist count, and recent activity
- users can set profile to public or private

**Follow System**
- follow and unfollow other users
- see follower and following counts on profile
- search or find users by username

**Activity Feed**
- a feed showing recent activity from people you follow
- activity types: logged a movie, rated a movie, added to watchlist
- each activity item links to the movie and the user's profile

**Reactions**
- react to a friend's activity (like, or simple emoji reactions)
- see reaction counts on activity items

### 5.3 Could Have (v1.2 - Depth & Engagement)

**Comments**
- comment on a friend's movie log
- threaded or flat comment list per activity item

**Custom Lists**
- create named lists beyond watchlist/watched (e.g., "Best of 2025", "Watch with Mom")
- lists can be public or private
- share a list via link

**Statistics Dashboard**
- personal viewing stats: movies per month, genre distribution, average rating
- visual charts
- year-in-review summary

**Movie Recommendations**
- "Because you watched X" suggestions based on genre and rating patterns
- "Popular among your friends" - movies rated highly by people you follow

**Search Enhancements**
- filter by genre, year, rating
- sort results by relevance, year, popularity

**OAuth Login**
- sign in with Google or Facebook

### 5.4 Won't Have (Out of Scope)

- TV show or series tracking
- full text reviews or long-form writing
- streaming availability ("where to watch")
- in-app messaging or direct messages between users
- mobile native app (web-only)
- content moderation tooling (revisit if community grows)

## 6. User Flows

**Flow 1: New User - First Movie Log**
```
Landing Page -> Click "Sign Up" -> Enter email + password ->
Account created -> Redirected to Search -> Type movie title ->
See results -> Click "Watched" -> Rate 4/5 stars ->
Redirected to Profile -> Movie appears in Watched tab
```

**Flow 2: Add to Watchlist**
```
Log In -> Search "Dune" -> See results ->
Click "Add to Watchlist" -> Confirmation shown ->
Go to Profile -> Watchlist tab shows Dune
```

**Flow 3: Discover via Friends (v1.1)**
```
Log In -> Open Activity Feed -> See "Marcus watched Interstellar *****" ->
Click on Interstellar -> View movie details ->
Click "Add to Watchlist" -> Movie saved
```

**Flow 4: Follow a Friend (v1.1)**
```
Log In -> Search for username "marcus" ->
View Marcus's public profile -> Click "Follow" ->
Marcus's activity now appears in your feed
```

**Flow 5: Share a List (v1.2)**
```
Go to Profile -> Create new list "Horror Marathon" ->
Add 8 movies from watched history -> Set list to public ->
Copy share link -> Send to friend
```

## 7. Sitemap
```
/                       -> Home (feed if logged in, landing if not)
/login                  -> Log in
/sign-up                -> Create account
/search                 -> Movie search with results
/movie/:id              -> Movie detail page
/profile                -> Current user's profile (watched + watchlist tabs)
/:username              -> Public profile (v1.1)
/feed                   -> Activity feed from followed users (v1.1)
/lists/:id              -> Shared list view (v1.2)
/profile/stats          -> Personal statistics dashboard (v1.2)
```

## 8. Non-Functional Requirements

Requirement | Detail
-- | --
Performance | Page loads < 2s. Search results < 1s. Feed loads < 1.5s.
Security | Passwords hashed (bcrypt/argon2). Sessions managed server-side. API keys never exposed to the client. All input sanitized. HTTPS only.
Privacy | Users control profile visibility (public/private). Following requires no approval by default, but private profiles hide activity.
Accessibility | WCAG 2.1 AA - semantic HTML, keyboard navigation, screen reader support, sufficient color contrast.
Scalability | Support 10,000 users without architecture changes. Feed queries optimized for up to 500 follows per user.
Browser Support | Latest 2 versions of Chrome, Firefox, Safari, Edge.
Responsiveness | Fully usable on mobile, tablet, and desktop. Mobile-first design.

## 9. Contraints & Dependencies

### 9.1 Constraints

- **TMDB API rate limits:** ~40 requests / second - debounced search is recommended, server-side caching (?)
- **Budget:** $0 target - free tiers only (Vercel, Supabase, TMDB API)
- **Team:** Small team, 2-6 people
- **Timeline:** MVP in 6-8 weeks, social features in weeks 9-12

### 9.2 Dependencies

Dependency | Risk | Mitigation
-- | -- | --
TMDB API | Downtime or terms change | Cache movie data locally, abstract behind service layer
Auth provider (Supabase, etc.) | Free tier limits | Monitor usage, design for portability
Hosting (Vercel, etc.) | Bandwidth limits on free tier | Optimize images (TMDB CDN), lazy loading

### 9.3 Assumptions
- users have a modern browser and stable internet
- TMDB remains free and available for non-commercial use
- email/password is sufficient for MVP (OAuth added later)
- english-only for the foreseeable future

## 10. Open Questions
1. **Rating system:** 5 star or 10 point scale? _(Recommendation: 5 star is more simpler, less decision paralysis)_
2. **Watch date:** Should users log when they watched a movie or just that they watched it? _(Recommendation: optional date field, not enforced, but it can be added)_
3. **Re-watches:** Can a user log the same movie multiple times? _(Recommendation: yes, with separate dates)_

## 11. Release Plan

Phase | Scope | Timeline
-- | -- | --
Sprint 0 | Project setup, architecture, database schema, CI/CD, wireframes, backlog | Weeks 1-2
MVP (v1.0) | Auth, search, movie details, watchlist, watched log, ratings, user profile | Weeks 3-8
Social (v1.1) | Public profiles, follow system, activity feed, reactions | Weeks 9-12
Depth (v1.2) | Comments, custom lists, stats dashboard, recommendations, OAuth | Weeks 13-16

## 12. Appendix: TMDB Attribution
TMDB requires attribution for use of their API. The app must display:

> _"This product uses the TMDB API but is not endorsed or certified by TMDB."_

Along with the TMDB logo, on every page that displays TMDB data.