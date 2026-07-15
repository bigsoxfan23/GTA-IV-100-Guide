# GTA IV Companion App Roadmap

## Foundation

- [x] Create the initial PWA
- [x] Organize the repository structure
- [x] Build the timeline validator
- [x] Add automated validator tests
- [x] Validate the 232-row Master Timeline
- [x] Improve project documentation

## Timeline Data

- [ ] Build the timeline JSON exporter
- [ ] Export the first validated `timeline.json`
- [ ] Add exporter tests
- [ ] Load timeline data from JSON in the app
- [ ] Remove hardcoded timeline data from `js/data.js`

## Application Features

- [ ] Render the optimized timeline
- [ ] Track completion by Timeline ID
- [ ] Add timeline filters
- [ ] Improve search
- [ ] Display task details and unlock requirements
- [ ] Preserve existing progress during data migration

## Offline and Data Safety

- [ ] Cache `timeline.json` for offline use
- [ ] Confirm service-worker updates work correctly
- [ ] Test progress export and import
- [ ] Add data-version migration support

## Polish

- [ ] Add README screenshots
- [ ] Improve mobile layout and accessibility
- [ ] Add issue templates
- [ ] Create the first GitHub release
- [ ] Prepare version 1.0