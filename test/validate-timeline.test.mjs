import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, rowsToRecords, validateTimeline } from '../scripts/validate-timeline.mjs';

const header = 'Timeline ID,Game ID,Timeline Order,Section,Type,Name,Requirement,Available After,Travel Zone,Instructions,Why Now?,Status,Verified,Source 1,Source 2,Research Notes,App Notes';
const validCsv = `${header}\nT0001,M001,1,Opening,Mission,First,Story,Start,Broker,Do it.,First.,Ready,Verified,Source,,,\nT0002,M002,2,Opening,Mission,Second,Story,M001,Broker,Do it.,Second.,Ready,Verified,Source,,,\nT0003,RC001,3,Opening,Random Character,Brian,1,M001 / M002,Broker,Do it.,Third.,Ready,Verified,Source,,,`;

function validate(csv) {
  const rows = parseCsv(csv);
  return validateTimeline(rowsToRecords(rows), rows[0]);
}

test('accepts a valid sequential timeline', () => {
  const result = validate(validCsv);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('parses quoted commas and escaped quotes', () => {
  const rows = parseCsv('A,B\n"Hello, world","He said ""hi"""');
  assert.deepEqual(rows, [['A', 'B'], ['Hello, world', 'He said "hi"']]);
});

test('rejects duplicate IDs and timeline orders', () => {
  const csv = validCsv.replace('T0002,M002,2', 'T0001,M002,1');
  const result = validate(csv);
  const codes = result.errors.map((error) => error.code);
  assert.ok(codes.includes('DUPLICATE_TIMELINE_ID'));
  assert.ok(codes.includes('DUPLICATE_TIMELINE_ORDER'));
  assert.ok(codes.includes('TIMELINE_ORDER_GAP'));
});

test('rejects empty required fields', () => {
  const csv = validCsv.replace('T0002,M002,2,Opening,Mission,Second', 'T0002,M002,2,Opening,Mission,');
  const result = validate(csv);
  assert.ok(result.errors.some((error) => error.code === 'EMPTY_REQUIRED_FIELD' && error.row === 3));
});

test('rejects missing and forward cross-references', () => {
  const missing = validate(validCsv.replace('M001 / M002', 'M999'));
  assert.ok(missing.errors.some((error) => error.code === 'INVALID_CROSS_REFERENCE'));

  const forward = validate(validCsv.replace('T0001,M001,1,Opening,Mission,First,Story,Start', 'T0001,M001,1,Opening,Mission,First,Story,M002'));
  assert.ok(forward.errors.some((error) => error.code === 'FORWARD_CROSS_REFERENCE'));
});
