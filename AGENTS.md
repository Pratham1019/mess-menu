# Agent Instructions

## Project
A mobile-first college mess menu aggregator for
FC1, FC2, and Sindhi Mess at MIT Manipal.

Read PRODUCT.md and DESIGN_BRIEF.md before work.
Follow DESIGN.md once it has been approved.

## Engineering
- Astro + TypeScript + Tailwind CSS v4.
- Prefer server-rendered HTML.
- Minimize client-side JavaScript.
- Avoid unnecessary frameworks and dependencies.
- Prioritize fast loading on mid-range Android phones.
- Keep ingestion separate from presentation.
- Never fabricate missing menu data.
- Use strict TypeScript and validate external data.
- Prefer simple, maintainable solutions.

## Design
- Mobile-first: begin at 375px.
- Menus are always the primary content.
- Typography and layout create the visual identity.
- Avoid generic AI SaaS aesthetics.
- No decorative cards, gradients, or hero sections.
- No unnecessary icons, animations, or clutter.
- Do not sacrifice readability for aesthetics.
- Use Impeccable for design critique and refinement.

## Workflow
- Investigate before implementing.
- Explain significant architectural decisions.
- Propose three visual directions before coding UI.
- Wait for approval before implementing a direction.
- Use browser screenshots to verify UI.
- Test mobile before desktop.
- Run relevant checks after changes.
- Do not claim tests passed unless executed.
- Do not deploy without explicit approval.

## Quality
- Accessible semantic HTML.
- Responsive from 320px to desktop.
- Handle missing and stale menus gracefully.
- Show source links and freshness information.
- Do not introduce features outside PRODUCT.md.
