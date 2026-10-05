# GTA IV Companion App — AI Handoff

> **Status date:** 2026-10-05  
> **Repository:** `bigsoxfan23/GTA-IV-100-Guide`  
> **Current app version:** **v0.4.0 Alpha**  
> **Current milestone shown in the app:** **Smart Completion**  
> **Live app:** https://bigsoxfan23.github.io/GTA-IV-100-Guide/  
> **Latest merged development work:** PR #48 on 2026-07-21  
> **Open GitHub issues at this checkpoint:** 16

This document is the fastest starting point for an AI, developer, or coding assistant joining the project. It summarizes the current architecture, completed work, remaining work, project conventions, development philosophy, and where to look for authoritative information.

---

## 1. What This Project Is

The **GTA IV Companion App** is a Big Sox Studios learning-first software project: a mobile-first Progressive Web App that guides a player through **Grand Theft Auto IV** in a recommended order while tracking progress toward **100% completion**.

The app is intentionally lightweight:

- HTML
- CSS
- Vanilla JavaScript
- Progressive Web App features
- GitHub Pages
- No framework
- No backend
- No database

The goal is not only to build the app, but to use the project to learn professional software-development practices.

---

## 2. Development Philosophy for AI Assistants

This is a **learning project first**.

When assisting:

1. Explain **why** a change is being made, not only what code to paste.
2. Use professional engineering practices and explain them in approachable language.
3. Teach relevant Git, GitHub, VS Code, JavaScript, HTML, CSS, PWA, architecture, testing, and deployment concepts as they come up.
4. Prefer **GUI-based workflows** for Git, GitHub, and VS Code when practical.
5. Use the terminal mainly for tests, validation, commands that are genuinely easier there, or when no good GUI path exists.
6. Do not make large architectural changes without first explaining the reasoning and tradeoffs.
7. Preserve working behavior unless an issue explicitly calls for changing it.
8. Treat stable **Timeline IDs** as permanent identifiers. Do not casually rename or regenerate them.
9. Do not manually edit generated timeline JSON when the change belongs in the source timeline data.
10. Before changing code, inspect the current repository state and relevant GitHub issue instead of relying only on older roadmap text.

---

## 3. Current Project State

The app is a **functional, data-driven alpha**.

The core architecture and data pipeline are already built. Development is now primarily in the areas of:

- timeline UX refinement
- navigation and quality-of-life features
- accessibility
- PWA/offline verification
- final timeline research and gameplay verification
- full playthrough testing
- release preparation

The project is **not** waiting on JSON conversion or JSON integration. Both are complete.

A reasonable high-level estimate toward a polished v1.0 is roughly **65–70%**, but this is not an official metric.

---

## 4. Current Data Architecture

The production data flow is:

~~~text
Master Timeline spreadsheet
        ↓
CSV export
        ↓
scripts/validate-timeline.mjs
        ↓
scripts/export-timeline.mjs
        ↓
data/timeline.json
        ↓
js/data-loader.js
        ↓
js/app.js
        ↓
Rendered app interface
~~~

### Data rules

- The **Master Timeline spreadsheet** is the authoritative source for timeline content.
- `imports/master-timeline.csv` is the repository snapshot/export used by the development pipeline.
- `data/timeline.json` is generated output consumed by the app.
- Generated JSON should **not** be manually edited to fix timeline content.
- Permanent Timeline IDs are used for saved progress and long-term references.
- Game IDs and Timeline IDs are validated for uniqueness.
- Timeline ordering and prerequisite references are validated before export.

---

## 5. Completed Major Work

### Foundation

- Initial PWA created
- Repository organized into app, data, scripts, tests, docs, and assets
- GitHub Pages deployment established
- Mobile-first interface established
- Project documentation created

### Master Timeline and validation

- 232-row Master Timeline created
- Permanent Timeline IDs established
- Game IDs established
- Timeline Order established
- Required data fields established
- Timeline validator built
- Automated validator tests added
- Required-field validation added
- Unique Timeline ID validation added
- Unique Game ID validation added
- Sequential Timeline Order validation added
- `Available After` cross-reference validation added
- Forward dependency checks added

### JSON pipeline

Completed in PR #37:

- Timeline JSON exporter CLI built
- `npm run export:timeline` added
- CSV parser and validator reused by exporter
- Validated `data/timeline.json` generated
- 232 records exported
- Exporter tests added
- Master Timeline repository CSV added
- Issue #18 closed

### Data-driven app migration

Completed in PR #38:

- App now loads `data/timeline.json`
- `js/data-loader.js` transforms timeline records for rendering
- Optimized timeline renders from structured JSON
- Completion progress is stored using Timeline IDs
- Old hardcoded `js/data.js` was removed
- Timeline JSON added to offline caching
- Progress export/import verified with Timeline IDs
- Offline operation verified during that implementation
- PWA icon paths corrected
- Issue #19 closed

### Saved-state decision

Completed in PR #39:

- Experimental legacy pre-Timeline-ID save migration was intentionally removed
- The project does **not** promise migration from the old experimental save model
- Defensive `loadSavedState()` behavior remains so malformed localStorage does not prevent startup
- Issue #35 was closed as not planned

### CI

Completed in PR #40:

- GitHub Actions test workflow added
- Automated tests run for appropriate pushes/PRs
- Node.js 20 is the supported development baseline

### Finale timeline rendering

Completed in PR #47:

- “Choose Deal or Revenge” remains a **Reminder** type
- It is visually placed in the Finale Mission group where it belongs chronologically
- Search still recognizes its actual Reminder type
- Completion counts use Timeline IDs correctly
- Issue #42 closed

### Dashboard progress calculations

Completed in PR #48:

- Overall progress calculation corrected
- Completed and remaining counts corrected
- Story progress now derives from structured `Requirement` data
- Timeline-ID-based state remains the basis of progress calculations

---

## 6. Current Runtime Behavior

At this checkpoint, the app can:

- load the generated timeline JSON
- render timeline sections and activity groups
- mark individual records complete
- persist completion state in localStorage
- calculate overall completion
- calculate story completion
- search visible timeline tasks
- hide completed tasks
- collapse/expand top-level timeline sections
- reset progress
- export a progress backup
- import a progress backup
- scroll to the next visible unchecked task
- scroll to the top
- function as a PWA with existing offline caching behavior

Some of these behaviors are **basic implementations that still have open enhancement issues**. An existing button or handler does not necessarily mean its issue is complete.

---

## 7. Important Partially Implemented Areas

### Continue / Next Task — Issue #7

Current code already has a `#nextTask` handler that finds the next visible unchecked checkbox and scrolls to it.

The open issue still requires a more complete behavior:

- identify the first incomplete item in authoritative Timeline Order
- expand its section if necessary
- handle 100% completion gracefully
- recalculate correctly after progress import/reset

Do not close #7 merely because a basic Next unchecked button exists.

### Back to Top — Issue #44

A `#toTop` button and smooth scroll handler already exist.

The open issue is about completing the desktop/responsive behavior:

- visible on desktop when appropriate
- hidden near the top
- shared responsive behavior
- accessibility
- reduced-motion support
- no layout overlap

### Grouping — Issue #43

The current loader already groups records by type beneath parent sections.

Issue #43 is **not** simply “group items.” It requires those child activity groups to become independently collapsible, accessible nested subsections with correct progress and state behavior.

### Import / Export — Issue #46

Import and export already work.

The missing work is the intentional, accessible confirmation-dialog workflow before starting those file operations, plus stronger error/success UX and cancellation behavior.

### Section collapse state — Issue #5

Top-level sections can already collapse.

Their expanded/collapsed state is **not persisted across reloads** yet.

---

## 8. Open Work

As of 2026-10-05, there are 16 open GitHub issues.

### Core timeline verification

#### #17 — Ongoing: Verify and Finalize the 100% Completion Timeline

This remains open intentionally.

The 232-row timeline is structurally valid and usable by the app, but structural validation is not the same as proving every entry through gameplay.

Remaining goals include:

- review every timeline row
- verify prerequisites
- verify earliest practical availability
- resolve Researching / Partially Verified entries
- confirm all required 100% content exists
- verify ordering during an actual playthrough

#### #24 — Perform Full 100% Playthrough Test

A complete GTA IV playthrough using only the companion app is still required before v1.0.

This test must verify:

- mission order
- friend activities
- unlock timing
- progress tracking
- successful 100% completion

---

### Feature and UX work

#### #43 — Add Nested Collapsible Subsections to Timeline Sections

Create independently collapsible activity subsections within parent timeline sections while preserving timeline order, progress accuracy, Timeline IDs, accessibility, and mobile usability.

#### #7 — Add “Continue” Action for Next Incomplete Task

Finish the Next/Continue behavior so it reliably follows Timeline Order and expands the required section.

#### #5 — Remember Expanded Sections

Persist parent section expanded/collapsed state and restore it safely after reload.

#### #44 — Add Back to Top Button to Desktop Layout

Complete the shared mobile/desktop visibility and accessibility behavior for the existing Back to Top control.

#### #46 — Add Confirmation Dialogs to Import and Export Actions

Add accessible, reusable confirmation dialogs before import/export file actions.

#### #4 — Complete Multi-Page App Navigation

Complete the intended primary navigation experience, including remaining Story, Friends, Collectibles, and related pages/views as defined by the issue.

#### #36 — Audit PWA Installation and Offline Behavior

Perform a full install/offline audit rather than assuming the earlier implementation checks cover every supported scenario.

---

### Quality, polish, and release work

#### #20 — Final UI Polish and Accessibility Review

Review spacing, typography, contrast, responsive behavior, icons, animations, accessibility, and visual consistency.

#### #27 — Measure and Improve Runtime Performance

Measure before optimizing. Areas listed in the issue include JavaScript size, rendering, localStorage usage, startup performance, and unused code.

#### #25 — Fix Remaining Launch Bugs

Resolve launch-blocking issues discovered during final testing and the full playthrough.

#### #23 — Prepare GitHub Repository for Public Release

Includes repository cleanup, topics/site metadata, stale issues, license, CHANGELOG, generated-file policy, branch protection, and release hygiene.

#### #22 — Create Release Notes for v1.0

Document major features, improvements, and known limitations.

#### #28 — Publish Version 1.0

Final release/tag/deployment workflow.

#### #29 — Create Post-Launch Roadmap

Potential future work includes Episodes from Liberty City, statistics, map ideas, achievements, and other post-v1.0 features.

---

## 9. Recommended Resume Order

Do not treat this as a rigid mandate; check issue priorities before beginning. A sensible restart sequence is:

1. Run the current automated tests and verify `main` is healthy.
2. Reconfirm the live GitHub Pages app matches `main`.
3. Pick one bounded UX issue rather than combining unrelated work.
4. Good candidates for the next contained engineering task:
   - #43 nested collapsible subsections
   - #7 Continue/Next incomplete behavior
   - #5 persisted section state
   - #44 desktop Back to Top
   - #46 import/export confirmation dialogs
5. Continue #17 timeline verification in parallel with normal app development.
6. Complete #36 PWA audit before release-candidate work.
7. Perform #24 full 100% playthrough before declaring the timeline/release complete.
8. Use #25 for defects discovered during the playthrough.
9. Complete #20/#27/#23/#22 before #28 v1.0.

Keep each change focused and use a feature/fix branch plus pull request.

---

## 10. Current Repository Map

### User-facing app

- `index.html` — current application shell and controls
- `css/` — styles
- `js/app.js` — primary runtime/UI behavior
- `js/data-loader.js` — converts timeline JSON records into renderable sections/groups
- `data/timeline.json` — generated timeline consumed by the app
- `manifest.webmanifest` — PWA manifest
- service-worker files — offline caching behavior

### Timeline pipeline

- `imports/master-timeline.csv` — repository CSV export of the Master Timeline
- `scripts/validate-timeline.mjs` — structural data validator
- `scripts/export-timeline.mjs` — validated CSV → JSON exporter
- `test/` — automated tests

### Documentation

- `README.md` — project overview and basic workflow
- `docs/ARCHITECTURE.md` — data-flow/architecture principles
- `docs/VALIDATION.md` — timeline validation workflow
- `docs/ROADMAP.md` — long-term roadmap
- `docs/AI-HANDOFF.md` — current cross-AI/project handoff document

---

## 11. Development Commands

Requires Node.js 20 or newer.

Run automated tests:

~~~bash
npm test
~~~

Validate the repository Master Timeline CSV:

~~~bash
npm run validate:timeline -- imports/master-timeline.csv
~~~

Regenerate JSON only after validation passes:

~~~bash
npm run export:timeline -- imports/master-timeline.csv
~~~

The generated `data/timeline.json` should only be committed when it corresponds to the validated source CSV.

---

## 12. Source-of-Truth Hierarchy

When sources disagree, use this order.

### For current software state

1. **Current `main` branch code**
2. **Open/closed GitHub issues**
3. **Recent merged pull requests and their implementation notes**
4. **This AI handoff document**
5. **README / architecture / validation documentation**
6. **Roadmap**

The roadmap is useful but may lag decisions made in later PRs or issues.

Example: `docs/ROADMAP.md` still mentions preserving existing progress during data migration, but PR #39 intentionally decided not to support migration from the experimental pre-Timeline-ID save model. The merged PR decision is newer and therefore authoritative.

### For timeline content

1. **Master Timeline spreadsheet**
2. Validated CSV export in `imports/`
3. Generated `data/timeline.json`

Do not reverse this flow by editing generated JSON as the source.

### For product/development preferences

The Big Sox Studios ChatGPT Project contains additional project context and learning preferences that may not belong in application code.

---

## 13. Important Historical PRs

A new AI should review these when the relevant area is being changed:

- **PR #30** — Add timeline data validator
- **PR #37** — Add validated timeline JSON export pipeline
- **PR #38** — Refactor app to use `timeline.json` data pipeline
- **PR #39** — Remove legacy save migration and retain safe state loading
- **PR #40** — Add GitHub Actions test workflow
- **PR #47** — Fix finale reminder timeline placement
- **PR #48** — Correct dashboard progress calculations

These PRs document important architectural decisions and should be consulted before undoing or replacing the related behavior.

---

## 14. Known Documentation Drift

Documentation is generally useful but not perfectly synchronized.

Examples:

- `docs/ROADMAP.md` contains older migration language superseded by PR #39.
- The roadmap is broader and less detailed than the current GitHub issues.
- GitHub issues contain the most detailed acceptance criteria for current feature work.

Before implementing a roadmap checkbox, search for the matching issue and inspect current code.

---

## 15. Rules for Timeline Changes

When modifying timeline data:

1. Make the authoritative content change in the Master Timeline source.
2. Export/update the repository CSV as appropriate.
3. Run validation.
4. Fix validation errors at the source.
5. Run tests.
6. Export JSON.
7. Inspect the generated diff.
8. Verify Timeline IDs remain stable unless a genuinely new record requires a new ID.
9. Verify no record was accidentally duplicated, dropped, or reordered.
10. Commit source and generated output together when appropriate.

Never silently renumber existing Timeline IDs to make a file look cleaner.

---

## 16. Rules for App Changes

Before implementation:

1. Read the relevant GitHub issue.
2. Inspect current behavior in `main`.
3. Identify whether the feature already has a partial implementation.
4. Explain the proposed change and why it is appropriate.
5. Work on a focused branch.
6. Preserve Timeline-ID-based progress.
7. Add or update tests where practical.
8. Run all tests before opening/merging the PR.
9. Verify mobile and desktop behavior for UI changes.
10. Consider keyboard, screen-reader, zoom, and reduced-motion behavior for interactive UI.

---

## 17. Handoff Summary

If you only remember a few things:

- The app is **v0.4.0 Alpha**, not a prototype waiting for its data model.
- The 232-row timeline, validator, JSON exporter, JSON loader, Timeline-ID save model, and CI already exist.
- The app is data-driven through `data/timeline.json`.
- The timeline still needs full real-world gameplay verification.
- There are 16 open issues at this checkpoint.
- Many remaining tasks are UX/accessibility/release work, not foundational architecture.
- The full 100% playthrough is a major release gate.
- `main` + GitHub issues + recent PRs are more authoritative than stale roadmap text.
- Timeline content originates in the Master Timeline spreadsheet.
- Stable Timeline IDs must be protected.
- This project should be taught, not merely coded: explain reasoning and prefer GUI workflows when practical.
