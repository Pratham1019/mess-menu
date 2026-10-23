# The mess

Approved design for the production application, based on the refined hybrid direction.

Preserve warm paper #F7F3E9, deep ink #2C2528 and restrained burgundy #7C293E. Locally hosted Fraunces provides branding and mess headings; IBM Plex Sans provides dishes and controls. Metadata uses #706168, dividers #D8CFC4 and dish rules #E3DCD2. No hero, decorative cards, illustrations or gradients.

At 375px, use 20px gutters, 31px branding, 30px mess headings, and 16px/24px full-width dish lines. Stack FC1, FC2 and eligible Sindhi. Keep all four meal links visible with 44px minimum touch targets in a sticky selector. At 600px use two columns, with Sindhi beneath; at 1024px use two or three equal comparison columns. Maximum app width is 1200px including gutters.

Display human dates without years. Preserve ISO dates internally and in time elements. No demo, prototype, research-snapshot or design-exploration chrome. The owner explicitly removed per-mess source strips, source links and routine retrieval timestamps from the public layout. Keep provenance internally and show the last-check time only in a stale-cache warning. Missing data stays missing; stale cached data is labelled. Only source-provided food groups and tags appear.

The private admin editor shares the typography and palette, with conventional labels, clear errors and plain server-rendered forms. Public menus remain the primary content. No public admin navigation is required; access `/admin` directly.

All four meals arrive in one server-rendered page. A small script progressively enhances meal links into accessible tabs, preserving URLs, browser history and keyboard controls. Only the selected meal is visible; every eligible mess remains open within it. A service worker caches dated public pages and assets, with a quiet saved-menu notice only when network refresh fails. Admin pages and mutations never enter this cache.

The date toolbar has a stronger desktop hierarchy: from 1024px, the calendar date is 23px/30px Plex, weight 500, in ink; the weekday is 16px muted text. “Tomorrow” is a separate 13px burgundy cue with a fine divider. Tablet uses an 18px date and 14px weekday; mobile retains the compact date line. No oversized date heading or decorative badge.
