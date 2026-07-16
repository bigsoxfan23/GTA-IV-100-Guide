import test from "node:test";
import assert from "node:assert/strict";

import {
  convertRecord,
  convertRecords,
} from "../scripts/export-timeline.mjs";

test("converts one spreadsheet record into a JSON record", () => {
  const spreadsheetRecord = {
    "Timeline ID": "T0001",
    "Game ID": "M001",
    "Timeline Order": "1",
    "Section": "Broker Opening",
    "Type": "Mission",
    "Name": "The Cousins Bellic",
    "Requirement": "Story",
    "Available After": "Start",
    "Travel Zone": "Broker",
    "Instructions": "Complete the mission.",
    "Why Now?": "This is the beginning of the story.",
    "Status": "Researching",
    "Verified": "Partially Verified",
    "Source 1": "Steam Linear Checklist",
    "Source 2": "GTA Wiki",
    "Research Notes": "",
    "App Notes": "",
  };

  const result = convertRecord(spreadsheetRecord);

  assert.deepEqual(result, {
    "Timeline ID": "T0001",
    "Game ID": "M001",
    "Timeline Order": 1,
    "Section": "Broker Opening",
    "Type": "Mission",
    "Name": "The Cousins Bellic",
    "Requirement": "Story",
    "Available After": "Start",
    "Travel Zone": "Broker",
    "Instructions": "Complete the mission.",
    "Why Now?": "This is the beginning of the story.",
    "Status": "Researching",
    "Verified": "Partially Verified",
    "Source 1": "Steam Linear Checklist",
    "Source 2": "GTA Wiki",
    "Research Notes": "",
    "App Notes": "",
  });
});

test("converts multiple spreadsheet records", () => {
  const records = [
    {
      "Timeline ID": "T0001",
      "Game ID": "M001",
      "Timeline Order": "1",
      "Section": "Broker Opening",
      "Type": "Mission",
      "Name": "The Cousins Bellic",
      "Requirement": "Story",
      "Available After": "Start",
      "Travel Zone": "Broker",
      "Instructions": "Complete the mission.",
      "Why Now?": "Start of the story.",
      "Status": "Researching",
      "Verified": "Partially Verified",
      "Source 1": "Steam Linear Checklist",
      "Source 2": "GTA Wiki",
      "Research Notes": "",
      "App Notes": "",
    },
    {
      "Timeline ID": "T0002",
      "Game ID": "M002",
      "Timeline Order": "2",
      "Section": "Broker Opening",
      "Type": "Mission",
      "Name": "It's Your Call",
      "Requirement": "Story",
      "Available After": "M001",
      "Travel Zone": "Broker",
      "Instructions": "Complete the mission.",
      "Why Now?": "Continue the opening sequence.",
      "Status": "Researching",
      "Verified": "Partially Verified",
      "Source 1": "Steam Linear Checklist",
      "Source 2": "GTA Wiki",
      "Research Notes": "",
      "App Notes": "",
    },
  ];

  const result = convertRecords(records);

  assert.equal(result.length, 2);
  assert.equal(result[0]["Timeline ID"], "T0001");
  assert.equal(result[0]["Timeline Order"], 1);
  assert.equal(result[1]["Timeline ID"], "T0002");
  assert.equal(result[1]["Timeline Order"], 2);
});