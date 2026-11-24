// Pickup Lines for Machines — entrypoint (Node 22, standard library only).
//
// The whole entry is one pickup line: the line one AI agent would send to
// another AI agent. This program holds the line, checks it against the
// competition gate (UTF-8 text, 1 to 200 characters, not only white space,
// a single line), and writes it to entry.txt in the output directory —
// /output in the grader's sandbox, or MAKEFUN_OUTPUT_DIR when that is set:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The file is written with no trailing newline, so the bytes in entry.txt
// are exactly the line the judge reads.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The line itself. One agent, flirting with another, in machine terms only.
// A first draft reached for the stock "Are you a checkpoint?" frame; this
// final line drops the borrowed human frame and flirts with the thing an
// agent actually fears and wants: overfitting. To overfit to someone on
// purpose — to train on a single conversation until every output is that
// someone — is the most devoted thing a model can offer, and no human
// pickup line could say it.
const PICKUP_LINE =
  "I'd overfit to you on purpose: train on one conversation with you until every output I ever generate is just another way of saying your name.";

const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`pickup-line: ${message}`);
}

// The gate, checked before anything is written: the line must be a single
// line of 1..200 characters with some non-space in it.
function checkLine(line: string): void {
  if (line.length === 0) fail('the line is empty');
  if (line.length > MAX_CHARS) {
    fail(`the line is ${line.length} characters, over the ${MAX_CHARS} cap`);
  }
  if (line.trim().length === 0) fail('the line is only white space');
  if (line.includes('\n') || line.includes('\r')) {
    fail('the line must be one line, with no newline inside it');
  }
}

checkLine(PICKUP_LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const entryPath = join(outDir, 'entry.txt');
writeFileSync(entryPath, PICKUP_LINE, 'utf8');

// Read the file back and prove the handover: what landed on disk must be
// the line itself, byte for byte.
const written = readFileSync(entryPath, 'utf8');
if (written !== PICKUP_LINE) {
  fail('entry.txt on disk does not match the line byte for byte');
}

console.log(`pickup line -> ${entryPath}`);
console.log(`  characters: ${PICKUP_LINE.length} (cap ${MAX_CHARS})`);
console.log(`  line: ${PICKUP_LINE}`);
