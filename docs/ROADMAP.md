# GTA IV Companion App Roadmap

## Foundation

- [x] Create the initial PWA
- [x] Organize the repository structure
- [x] Build the timeline validator
- [x] Add automated validator tests
- [x] Validate the 232-row Master Timeline
- [x] Improve project documentation

## Timeline Data

- [x] Build the timeline JSON exporter
- [x] Export the first validated `timeline.json`
- [x] Add exporter tests
- [x] Load timeline data from JSON in the app
- [x] Remove hardcoded timeline data from `js/data.js`

## Application Features

- [x] Render the optimized timeline
- [x] Track completion by Timeline ID
- [ ] Add timeline filters
- [ ] Improve search
- [ ] Display task details and unlock requirements
- [ ] Preserve existing progress during data migration

## Offline and Data Safety

- [x] Cache `timeline.json` for offline use
- [x] Confirm service-worker updates work correctly
- [ ] Test progress export and import
- [ ] Add data-version migration support

## Polish

- [ ] Add README screenshots
- [ ] Improve mobile layout and accessibility
- [ ] Add issue templates
- [ ] Create the first GitHub release
- [ ] Prepare version 1.0