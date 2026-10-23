# PARALLEL

**Explore the Lives You Never Lived.**

An atmospheric, client-side interactive fiction application by **Syed Ahmad Geelani**.

[Made by Syed Ahmad Geelani](https://www.linkedin.com/in/syedahmadgeelani)

## Run locally

Use Node.js 22.12+ (Node 24 also works) and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. No environment variables, API keys, backend, database, account, or external runtime requests are required. The core application has no usage fees. Hosting and custom-domain terms are determined by the host you choose.

```sh
npm run typecheck
npm run format:check
npm test
npm run build
npm run preview
```

`dist/` is the deployable static site. `vite preview` is for local verification, not a production server. Do not open `dist/index.html` directly with `file://`; use an HTTP server.

## The experience

- Cinematic opening with original branching SVG artwork, a subtle interactive star field, and optional procedural ambient audio (off on every load).
- Three complete authored stories: **Move Abroad**, **Follow Your Passion**, and **Take the Risk**.
- Five decisions per playthrough, recurring characters, callbacks, consequence resources, conditional eligibility, and three distinct endings per scenario.
- Three-step setup: optional nickname, life chapter, crossroads, reflective value, and tone. Custom wording frames an existing template; no free-text interpretation or AI generation is claimed.
- An inspectable timeline. Restarting from a reached moment reconstructs all resources and flags from the retained history; it creates a new story identity so a saved original remains intact.
- Endings with reflection, decision consequences, a journey view, save/revisit actions, and a fiction disclaimer.
- Device-only gallery, reopen/replay/delete controls, versioned JSON export and strict import validation.
- Downloadable 1200 × 1500 PNG cards, native sharing when available, and copy/select-text fallback. Names, custom wording, and decision history are excluded from shared cards and summaries.
- Keyboard controls, native modal focus containment, semantic forms, focus indicators, mobile layouts, and both system and manual reduced-motion support.

## Architecture

| File | Responsibility |
| --- | --- |
| `src/model.ts` | Typed scenarios, scenes, choices, conditions, story snapshots |
| `src/stories.ts` | All authored content and resource effects |
| `src/engine.ts` | Deterministic replay, choice eligibility, seeded framing, endings, validation |
| `src/storage.ts` | Fault-tolerant local storage, archive merging, downloads |
| `src/App.tsx` | Landing, reader, ending, navigation, dialog and audio lifecycle |
| `src/Setup.tsx` | Onboarding and transparent custom-template selection |
| `src/Timeline.tsx` | Semantic interactive timeline and SVG thumbnails |
| `src/Gallery.tsx` | Lazy-loaded saved lives and JSON transfers |
| `src/Share.tsx` | Lazy-loaded canvas card generation and browser sharing |
| `src/Atmosphere.tsx` | Cleaned-up canvas animation and original SVG artwork |

The engine stores **inputs**, not trusted computed state: schema version, identity, setup, unsigned 32-bit seed, timestamp, and choice IDs. `derive()` replays those decisions to obtain ambition, connection, stability, freedom, and fulfillment. These are story resources, never psychological measurements. Invalid choices and unavailable conditional branches are rejected during both play and import.

The story structure is a sequence of five authored turning points with conditional passages and resources, rather than a completely different chapter for every combination. Each ending preserves the path's decision ledger. The seed selects small atmospheric variations; it does not alter eligibility or manufacture stories. Tone and chapter affect framing; the chosen value supplies a final reflection prompt.

## Persistence and privacy

Storage keys: `parallel.active.v1`, `parallel.gallery.v1`, `parallel.motion.v1`. Sound is never enabled automatically. There is one active session and up to 100 saved completed lives per browser origin. Starting another story or reopening a saved life replaces the active session. Reloading returns to the landing page with a resume action.

JSON backups **include private setup answers**, unlike PNG cards and share summaries. Imports reject unsupported versions, malformed input, oversized files (1 MB), duplicate IDs, unknown templates, invalid fields, impossible histories, and unfinished lives. Existing IDs take precedence during merging. Corrupted stored data is not removed on read. Storage failures leave the current session usable and show a persistent warning; export before closing. There is no cross-device synchronization or service worker offline cache.

## Deploy publicly

This repository is prepared for static hosting. No public deployment is assumed or claimed.

### Vercel

Import the repository, set its root directory to this application directory if it is nested, and use the Vite framework preset. `vercel.json` specifies `npm run build` and `dist`. Leave environment variables empty. Choose a public deployment without visitor authentication for the intended no-signup experience.

### Netlify

Import the repository and set the application root as the base directory if needed. `netlify.toml` supplies the build command and publish directory. Alternatively, upload the contents of the built `dist/` directory through Netlify's static deploy flow.

### GitHub Pages

Place the contents of this project at the repository root, push to `main`, and select **GitHub Actions** under repository **Settings → Pages → Build and deployment**. The included workflow installs dependencies, checks types, runs tests, builds, and deploys the `dist` artifact. Update the workflow branch if your default branch differs.

Vite's relative `base: './'` makes asset URLs work at both root domains and repository subdirectories. All screens use in-app state at the single entry URL; there are no pathname routes or invented deep links, so no SPA catch-all rewrite is required. Reloading the root or repository entry URL restores the latest session through the landing-page resume action.

References: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [Netlify Vite setup](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/).

### Finalize social metadata

The title, requested meta description, author, favicon, Open Graph fields, and original `public/social-preview.png` are included. Once a real public URL exists, run:

```sh
node scripts/set-public-url.mjs https://your-real-domain.example/
npm run build
```

Use your actual URL, including the repository subdirectory for GitHub Pages. This sets the canonical URL and absolute Open Graph image URL. Re-deploy afterward. PNG story cards automatically use the current non-localhost page URL without its query string or fragment. No personal information is encoded in links. The script is a release convenience, not a runtime dependency.

## Quality checks and known limits

See `QA.md` for the actual verification record. Tests exhaustively traverse eligible histories, verify all nine endings, and cover deterministic behavior, rewind consistency, storage failures, archive validation, onboarding, timeline controls, and gallery interactions. Linting is not configured; strict TypeScript checks unused declarations and parameters, and Prettier checks source formatting. No test claims are made for unsupported browsers or real mobile hardware.

The native share sheet depends on browser/OS support and a secure context. Download and clipboard fallbacks remain available. Selecting Copy summary also exposes selectable text immediately, including when a browser leaves its clipboard permission request pending. Audio is procedural and intentionally quiet. Older browsers lacking native `<dialog>`, modern canvas, or Web Audio are not the target; use a current Chrome, Edge, Firefox, or Safari. Different system fonts may produce small typographic differences.

## Author and license

The exact visible text **Made by Syed Ahmad Geelani** appears as a permanent footer link on the landing page, setup, reader, ending, and gallery. It links to `https://www.linkedin.com/in/syedahmadgeelani` with `target="_blank"` and `rel="noopener noreferrer"`. Author credit also appears in package metadata, HTML metadata, share cards, this README, and the MIT license.

MIT is included as the project's default license; the author may choose a different license before publishing. See `THIRD_PARTY_NOTICES.md` for dependency and asset notes.
