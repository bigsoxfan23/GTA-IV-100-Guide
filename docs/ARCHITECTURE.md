# GTA IV Companion App Architecture

## Overview

The GTA IV Companion App is a static Progressive Web App built with HTML, CSS, and vanilla JavaScript.

The app does not use a backend or database. Timeline content is maintained in a spreadsheet, exported to JSON, loaded by the browser, and stored locally for offline use.

## Data Flow

```text
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

## Architecture Principles

The project follows a few core principles:

- The spreadsheet is the single source of truth for timeline data.
- Generated files should never be edited manually.
- Validation should catch data problems before they reach the app.
- Application logic should remain separate from data.
- Stable Timeline IDs should be used for all long-term references and saved progress.