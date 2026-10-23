# PARALLEL verification record

Verified on 23 October 2026. All results below refer to checks actually run.

## Automated checks

- `npm run typecheck` — passed with strict TypeScript settings.
- `npm test` — **39 tests passed in 4 files**.
  - 23 engine/import tests, including exhaustive traversal of every eligible history in each scenario, five decisions per completed path, all nine endings reachable, resource changes, conditional callbacks, blocked transitions, seeded variation, deterministic replay, rewind consistency, schema and size validation.
  - 8 storage tests, including active/gallery restore, corruption preservation, denied/quota-failed writes, idempotent save, unfinished-save rejection, merge behavior, and capacity limits.
  - 6 interface tests covering optional/custom onboarding, scenario/value/tone selection, reached/future timeline controls, empty gallery, delete confirmation, and valid/invalid file imports.
  - 2 sharing tests covering clipboard-denied fallback, private-input omission, and native-share cancellation without false success.
- `npm run build` — passed. Production HTML, CSS, JavaScript, favicon, and social artwork emitted to `dist/`.
- `npm run format:check` — passed. No ESLint configuration is present; this is a formatting check, not a lint claim.
- Public-URL configuration script — verified in an isolated scratch copy, including repeated execution, one canonical tag, one Open Graph URL, and the correct absolute social image URL.

The main application JavaScript is approximately 138 kB gzip; gallery and sharing load as separate small chunks. This is build output measurement, not a Lighthouse or real-device performance score.

## Real browser checks

Tested through the Codex in-app browser against both Vite development and the compiled production build:

- Local HTTP response: 200.
- Landing, three-step setup, skipping optional details, and scenario cards carrying the correct selection.
- A full Move Abroad route to “A Life in Two Time Zones.”
- A full production-build Take the Risk route to “The Idea That Outgrew You.”
- A full production-build Follow Your Passion route to “A Room With the Lights Left On.”
- Conditional ending unlocked by earlier resources and earlier-choice callbacks visible in later prose.
- Save, reload, gallery restoration, and reopening the saved ending.
- Revisit the first decision, restart, make a different choice, and observe reset timeline progress and the changed callback.
- PNG export produced a real **1200 × 1500** PNG file in the browser's downloads folder.
- JSON export produced a real backup file. Re-importing it reported zero new lives and retained the existing ID.
- Desktop at 1440 × 900 and mobile at 390 × 844 were visually inspected. A very narrow 319-pixel browser panel was also used for the complete initial journey. Measured document width matched viewport width at 390, 768, and 1440 pixels.
- Required author link text and LinkedIn destination verified; `noopener noreferrer` confirmed. The source also sets `target="_blank"`.
- Reduced-motion control exercised. Browser warning/error log was empty at the checked point.

Issues found and corrected during browser QA: narrow-screen title overflow, mobile menu stacking, preserving scenario-card selection, share feedback behind its dialog, and explicit selectable-text access when clipboard permission is unresolved.

## Deliberate verification limits

- No public deployment was performed. Vercel, Netlify, and GitHub Pages configuration is supplied; their account-specific deployment workflows have not been executed.
- Native OS share-sheet delivery was not sent to an external recipient. Its cancellation/fallback logic is covered by automated tests.
- Native clipboard success was not confirmed in this embedded browser; selectable-text fallback is available immediately and the denied-permission behavior is tested.
- No physical iOS/Android device run, cross-browser matrix, screen-reader user study, Lighthouse audit, or audible-audio quality assessment was performed.
- Saved data is local to the browser; it is not cloud backup. Exported JSON includes private setup answers. Sharing cards intentionally omits those answers.
- No lint configuration or lint run is claimed.

## Deployment artifacts

`dist/` contains only static runtime files. The source archive includes the full project and this report; the separate static-site archive contains the contents of `dist/`. Hosting requires no application secrets or environment variables. Set the real public metadata URL with `scripts/set-public-url.mjs` after choosing a domain, rebuild, then deploy.
