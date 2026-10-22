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
3. Switch between lunch and dinner.
4. Compare FC1, FC2, and Sindhi.
5. Decide where to eat.

Target: Complete this in seconds.

## MVP Features
- Automatic menu aggregation.
- All three messes displayed clearly.
- Lunch/dinner switching.
- Current date and meal indication.
- Source links.
- Freshness indicators.
- Missing/stale menu states.
- Responsive mobile and desktop layouts.

## Non-Goals
- AI recommendations.
- Authentication.
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
- Handle independent source failures.
- Use cached data when appropriate.

## Success Criteria
- Menus readable immediately on mobile.
- Fast navigation between meals.
- No unnecessary interactions.
- Clear comparison between three messes.
- Graceful handling of missing data.
- Excellent mobile performance.
