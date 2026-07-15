# Timeline validation

The first timeline JSON must not be exported until the source timeline passes validation.

## Run the validator

1. In **GTA IV App Blueprint**, open the **Master Timeline** tab.
2. Download that tab as a CSV file.
3. From the repository root, run:

```bash
npm run validate:timeline -- path/to/master-timeline.csv
```

A passing run exits with code `0`. Validation errors exit with code `1`; setup or unreadable-CSV errors exit with code `2`.

## Rules enforced

- Required columns exist and required fields are populated.
- Timeline IDs match `T####` and are unique.
- Game IDs use the project ID format and are unique.
- Timeline Order contains every integer from `1` through the number of records exactly once.
- `Available After` Game ID references exist and point to earlier timeline entries.
- Project-specific non-ID prerequisites such as `Start` and friendship percentages are allowed.

Only after this command passes should the first `timeline.json` export be created.
