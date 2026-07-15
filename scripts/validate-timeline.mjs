#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const REQUIRED_FIELDS = [
  'Timeline ID',
  'Game ID',
  'Timeline Order',
  'Section',
  'Type',
  'Name',
  'Requirement',
  'Available After',
  'Travel Zone',
  'Instructions',
  'Why Now?',
  'Status',
  'Verified',
  'Source 1',
];

const GAME_ID_PATTERN = /^[A-Z]{1,4}\d{3}$/;
const TIMELINE_ID_PATTERN = /^T\d{4}$/;
const NON_REFERENCE_VALUES = new Set(['Start']);

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (quoted) {
    throw new Error('CSV ended inside a quoted field.');
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.trim() !== ''));
}

export function rowsToRecords(rows) {
  if (rows.length === 0) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((row, index) => {
    const record = { __row: index + 2 };
    headers.forEach((header, columnIndex) => {
      record[header] = (row[columnIndex] ?? '').trim();
    });
    return record;
  });
}

function addError(errors, code, message, record) {
  errors.push({ code, message, row: record?.__row ?? null });
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

export function extractReferences(value) {
  if (!value || NON_REFERENCE_VALUES.has(value) || /%\s*Like/i.test(value)) return [];
  return value
    .split(/\s*\/\s*|\s*,\s*|\s*;\s*/)
    .map((part) => part.trim())
    .filter((part) => GAME_ID_PATTERN.test(part));
}

export function validateTimeline(records, headers = Object.keys(records[0] ?? {}).filter((key) => key !== '__row')) {
  const errors = [];
  const warnings = [];

  for (const field of REQUIRED_FIELDS) {
    if (!headers.includes(field)) {
      errors.push({ code: 'MISSING_COLUMN', message: `Required column is missing: ${field}`, row: 1 });
    }
  }

  if (errors.some((error) => error.code === 'MISSING_COLUMN')) {
    return { valid: false, errors, warnings, recordCount: records.length };
  }

  for (const record of records) {
    for (const field of REQUIRED_FIELDS) {
      if (record[field] === '') {
        addError(errors, 'EMPTY_REQUIRED_FIELD', `${field} is required.`, record);
      }
    }

    if (record['Timeline ID'] && !TIMELINE_ID_PATTERN.test(record['Timeline ID'])) {
      addError(errors, 'INVALID_TIMELINE_ID', `Timeline ID must match T####: ${record['Timeline ID']}`, record);
    }
    if (record['Game ID'] && !GAME_ID_PATTERN.test(record['Game ID'])) {
      addError(errors, 'INVALID_GAME_ID', `Game ID has an invalid format: ${record['Game ID']}`, record);
    }
    if (record['Timeline Order'] && !/^\d+$/.test(record['Timeline Order'])) {
      addError(errors, 'INVALID_TIMELINE_ORDER', `Timeline Order must be a positive integer: ${record['Timeline Order']}`, record);
    }
  }

  for (const duplicate of duplicates(records.map((record) => record['Timeline ID']).filter(Boolean))) {
    errors.push({ code: 'DUPLICATE_TIMELINE_ID', message: `Duplicate Timeline ID: ${duplicate}`, row: null });
  }
  for (const duplicate of duplicates(records.map((record) => record['Game ID']).filter(Boolean))) {
    errors.push({ code: 'DUPLICATE_GAME_ID', message: `Duplicate Game ID: ${duplicate}`, row: null });
  }

  const orders = records
    .filter((record) => /^\d+$/.test(record['Timeline Order']))
    .map((record) => Number(record['Timeline Order']));
  for (const duplicate of duplicates(orders)) {
    errors.push({ code: 'DUPLICATE_TIMELINE_ORDER', message: `Duplicate Timeline Order: ${duplicate}`, row: null });
  }
  const uniqueOrders = [...new Set(orders)].sort((a, b) => a - b);
  const expectedOrders = Array.from({ length: records.length }, (_, index) => index + 1);
  const missingOrders = expectedOrders.filter((order) => !uniqueOrders.includes(order));
  if (missingOrders.length > 0) {
    errors.push({ code: 'TIMELINE_ORDER_GAP', message: `Missing Timeline Order value(s): ${missingOrders.join(', ')}`, row: null });
  }
  const outOfRange = uniqueOrders.filter((order) => order < 1 || order > records.length);
  if (outOfRange.length > 0) {
    errors.push({ code: 'TIMELINE_ORDER_RANGE', message: `Timeline Order value(s) outside 1-${records.length}: ${outOfRange.join(', ')}`, row: null });
  }

  const gameIdToRecord = new Map(records.map((record) => [record['Game ID'], record]));
  for (const record of records) {
    const availableAfter = record['Available After'];
    const references = extractReferences(availableAfter);
    const looksReferenceLike = GAME_ID_PATTERN.test(availableAfter) || availableAfter.includes('/');

    if (looksReferenceLike && references.length === 0 && !NON_REFERENCE_VALUES.has(availableAfter) && !/%\s*Like/i.test(availableAfter)) {
      addError(errors, 'UNPARSEABLE_REFERENCE', `Available After could not be parsed: ${availableAfter}`, record);
    }

    for (const reference of references) {
      const target = gameIdToRecord.get(reference);
      if (!target) {
        addError(errors, 'INVALID_CROSS_REFERENCE', `Available After references missing Game ID: ${reference}`, record);
        continue;
      }
      const currentOrder = Number(record['Timeline Order']);
      const targetOrder = Number(target['Timeline Order']);
      if (Number.isInteger(currentOrder) && Number.isInteger(targetOrder) && targetOrder >= currentOrder) {
        addError(errors, 'FORWARD_CROSS_REFERENCE', `Available After reference ${reference} must point to an earlier timeline item.`, record);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings, recordCount: records.length };
}

export function formatReport(result) {
  const lines = [];

  if (result.valid) {
    lines.push('PASS: Timeline validation succeeded.');
    lines.push('');
    lines.push(`Rows checked:          ${result.recordCount}`);
    lines.push(`Timeline IDs:          ${result.recordCount} unique`);
    lines.push(`Game IDs:              ${result.recordCount} unique`);
    lines.push('Timeline Order:        Sequential');
    lines.push('Required Fields:       Complete');
    lines.push('Cross-References:      Valid');
    lines.push('');
    lines.push('Ready to export timeline.json');
  } else {
    lines.push(
      `FAIL: ${result.errors.length} error(s) across ${result.recordCount} timeline rows.`,
    );
  }

  for (const error of result.errors) {
    lines.push(
      `- [${error.code}]${error.row ? ` Row ${error.row}:` : ''} ${error.message}`,
    );
  }

  for (const warning of result.warnings) {
    lines.push(
      `- [WARNING]${warning.row ? ` Row ${warning.row}:` : ''} ${warning.message}`,
    );
  }

  return lines.join('\n');
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/validate-timeline.mjs <master-timeline.csv>');
    process.exitCode = 2;
    return;
  }

  try {
    const text = await readFile(filePath, 'utf8');
    const rows = parseCsv(text);
    const headers = rows[0]?.map((header) => header.trim()) ?? [];
    const records = rowsToRecords(rows);
    const result = validateTimeline(records, headers);
    console.log(formatReport(result));
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) {
    console.error(`Validation could not run: ${error.message}`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
