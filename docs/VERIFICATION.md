# Verification

Run from the repository root with Node 22.12 or newer:

```sh
npm run check
npm test
npm run build
npm run test:integration
git diff --check
```

The integration test imports the last production build, so run it after `build`.

## Automated coverage

- Source adapters preserve dishes, source groups, dietary tags and dated schedules. FC1 parsing never executes downloaded code.
- IST meal selection covers exact serving cutoffs, next-day breakfast, Sundays and calendar boundaries.
- Admin tests cover password verification, signed cookies, origin and CSRF checks, validation, protected routes, shared rate limiting, and save → public read → restore.
- Device-cache tests cover dated storage, offline meal switching, retention and expiry, and exclusion of admin content and mutations.

[Captured source fixtures](../tests/fixtures/README.md) are used only by tests. Integration tests substitute external HTTP services, including Blob and Firewall; they cannot certify live credentials or a published rate-limit rule. Follow [deployment acceptance](SECURITY.md#deployment-acceptance) on an explicitly authorized Preview deployment.

## Browser checks for UI changes

Test mobile at 320, 375 and 430px before tablet and desktop at 768 and 1440px. Check every meal for readable dishes, visible meal controls, no horizontal overflow, correct eligible messes and sticky navigation. Verify keyboard navigation, browser history, offline saved-menu warnings, and admin forms.

Keep screenshots and browser reports under the ignored `.impeccable/` directory.
