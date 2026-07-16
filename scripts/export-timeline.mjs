#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

import {
  formatReport,
  parseCsv,
  rowsToRecords,
  validateTimeline,
} from "./validate-timeline.mjs";

export function convertRecord(record) {
  return {
    "Timeline ID": record["Timeline ID"],
    "Game ID": record["Game ID"],
    "Timeline Order": Number(record["Timeline Order"]),
    "Section": record["Section"],
    "Type": record["Type"],
    "Name": record["Name"],
    "Requirement": record["Requirement"],
    "Available After": record["Available After"],
    "Travel Zone": record["Travel Zone"],
    "Instructions": record["Instructions"],
    "Why Now?": record["Why Now?"],
    "Status": record["Status"],
    "Verified": record["Verified"],
    "Source 1": record["Source 1"],
    "Source 2": record["Source 2"],
    "Research Notes": record["Research Notes"],
    "App Notes": record["App Notes"],
  };
}

export function convertRecords(records) {
  return records.map(convertRecord);
}

export async function exportTimeline(
  inputPath,
  outputPath = "data/timeline.json",
) {
  const csvText = await readFile(inputPath, "utf8");

  const rows = parseCsv(csvText);
  const headers = rows[0]?.map((header) => header.trim()) ?? [];
  const records = rowsToRecords(rows);

  const validationResult = validateTimeline(records, headers);

  if (!validationResult.valid) {
    throw new Error(formatReport(validationResult));
  }

  const timeline = convertRecords(records);

  await mkdir(dirname(outputPath), { recursive: true });

  await writeFile(
    outputPath,
    `${JSON.stringify(timeline, null, 2)}\n`,
    "utf8",
  );

  return {
    outputPath,
    recordCount: timeline.length,
  };
}

async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] ?? "data/timeline.json";

  if (!inputPath) {
    console.error(
      "Usage: node scripts/export-timeline.mjs <master-timeline.csv> [output.json]",
    );
    process.exitCode = 2;
    return;
  }

  try {
    const result = await exportTimeline(inputPath, outputPath);

    console.log(
      `PASS: Exported ${result.recordCount} timeline records to ${result.outputPath}`,
    );
  } catch (error) {
    console.error(`Export failed:\n${error.message}`);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}