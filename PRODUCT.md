# Product Specification

## Purpose
A fast, beautiful website for MIT Manipal
students to compare college mess menus.

## Menu Sources
- FC1: https://bluspring.vercel.app
- FC2: https://tikmit.com
- Sindhi: https://sindhi.coolstuff.work

## Core User Journey
1. Open website on mobile.
2. See today's menus immediately.
3. Choose Breakfast, Lunch, Snacks, or Dinner from one shared selector.
4. Compare FC1 and FC2; also compare Sindhi at Lunch and Dinner.
5. Decide where to eat.

Target: Complete this in seconds.

## MVP Features
- Automatic menu aggregation.
- Fully visible menus in stable order: FC1, FC2, then Sindhi when served. Stack on mobile; use side-by-side comparison on desktop.
- One shared selector with all four meal periods visible: Breakfast, Lunch, Snacks, Dinner.
- Load all four meal menus in the initial page response. Switch between them instantly without separate menu requests.
- Cache complete dated public menus on the device for repeat and offline visits. Keep dates intact, label saved fallbacks, and exclude all admin content.
- FC1 and FC2 serve all four meal periods.
- Sindhi serves Lunch and Dinner Monday–Saturday only; no Sunday service.
- Omit Sindhi for Breakfast and Snacks; unsupported meals are not missing-source errors.
- Current date and meal indication.
- Keep source provenance and retrieval timestamps internally; omit per-mess source strips and routine check timestamps from the public page, as requested by the owner.
- Show freshness information only when warning about a stale cached menu.
- Missing/stale menu states.
- Responsive mobile and desktop layouts.
- Private single-admin menu editor with server-side authentication and dated overrides. No public accounts or registration.

## Interaction Requirements
- On a normal visit, select the current or next meal using Asia/Kolkata (IST), regardless of the device time zone.
- Keep a meal selected until the latest serving end time among its eligible messes; between meals select the upcoming period. At the exact end time, advance.
- After Dinner ends, default to the following day’s Breakfast and its actual dated menu; never relabel an old menu as tomorrow’s.
- Human-readable dates omit the year; retain complete ISO dates internally.
- Explicit meal links and manual choices override the automatic default. Select on entry; do not interrupt reading by switching meals in the background.
- Keep all eligible menus open; no accordions, hidden mess tabs, carousels, or nested scrolling.
- Keep the shared meal selector accessible while scrolling.
- Changing meals returns to the beginning of the comparison.
- Complete dish names and any stale-menu warning remain readable.

## Non-Goals
- AI recommendations.
- Public user accounts, registration and OAuth.
- Ratings or reviews.
- Social features.
- Food ordering.
- Analytics dashboards.
- Unnecessary personalization.

## Data Requirements
- Prefer source APIs where available.
- Normalize menu data into a common schema.
- Track when data was retrieved.
- Preserve source-provided meal dates.
- Do not confuse scheduled with confirmed menus.
- Handle independent source failures separately from known service availability.
- Preserve source-provided dietary groups/tags; do not invent dish categories.
- Presentation may normalize case and spacing while preserving original dish text.
- Use cached data when appropriate.

## Success Criteria
- Menus readable immediately on mobile.
- Fast navigation between meals.
- No unnecessary interactions.
- Clear comparison between the messes serving the selected meal.
- Graceful handling of missing data.
- Excellent mobile performance.
