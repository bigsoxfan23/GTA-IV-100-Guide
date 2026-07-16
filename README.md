# GTA IV 100% Companion App

A modern, mobile-first Progressive Web App (PWA) designed to guide players through **Grand Theft Auto IV** in the most efficient order possible while tracking progress toward **100% completion**.

🌐 **Live App:**  
https://bigsoxfan23.github.io/GTA-IV-100-Guide/

---

## Features

- ✅ Optimized chronological timeline
- ✅ Interactive completion checklist
- ✅ Automatic progress saving
- ✅ Works completely offline after first install
- ✅ Installable as a Home Screen app (iOS & Android)
- ✅ Export and import progress backups
- ✅ Built from a research-backed master timeline

---

## Project Goals

This project aims to provide the definitive GTA IV completion companion by combining:

- Main story missions
- Side missions
- Random characters
- Activities
- Collectibles
- Friend progression
- Optional content

...into one optimized timeline that minimizes unnecessary travel and backtracking.

---

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Progressive Web App (PWA)
- GitHub Pages

No frameworks. No backend. Everything runs locally in your browser.

---

## Development Workflow

Timeline data is maintained in the **Master Timeline** spreadsheet.

Before generating a new `timeline.json`, always run:

```bash
npm test
npm run validate:timeline -- imports/master-timeline.csv
npm run export:timeline -- imports/master-timeline.csv
```

JSON should only be exported after the validator reports a successful pass.

---

## Repository Structure

```
assets/     Images, icons, fonts
css/        Stylesheets
data/       Generated JSON data
docs/       Project documentation
imports/    Raw CSV files exported from Google Sheets
js/         Application code
scripts/    Developer utilities
test/       Automated tests
```

---

## Documentation

- docs/VALIDATION.md — Timeline validation and export workflow
- docs/ROADMAP.md — Long-term project roadmap
- README.md — Project overview

---

## License

This project is provided for educational and personal use.

Grand Theft Auto IV and all related intellectual property belong to Rockstar Games.