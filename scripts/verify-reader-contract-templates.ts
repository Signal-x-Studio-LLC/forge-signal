#!/usr/bin/env tsx
/**
 * Verify every reader-contract template loads through the real generation-path
 * loader, so a template cannot ship as valid JSON that the pipeline rejects.
 *
 * Checks per surface:
 * - loadProjectReaderContract resolves it and returns a contract
 * - reader, job, and plainness survive the defaults/surface merge
 * - precisionLocks is absent (inherit defaults) or non-empty, never []
 * - every denyTerm names its replacement, since the loader otherwise
 *   substitutes the placeholder 'reader-facing language'
 * - an unknown surface name throws instead of silently falling back
 *
 * Usage: npm run reader:templates
 */

import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadProjectReaderContract } from '../src/content/reader-contract.js';

const ROOT = process.cwd();
const TEMPLATE_DIR = 'templates/reader-contracts';

interface RawSurface {
  name?: string;
  precisionLocks?: string[];
  denyTerms?: Array<{ term?: string; replacement?: string }>;
}

const failures: string[] = [];

function fail(file: string, surface: string, message: string): void {
  failures.push(`${file} :: ${surface} — ${message}`);
}

async function contractFiles(dir: string): Promise<string[]> {
  const entries = await readdir(path.resolve(ROOT, dir), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await contractFiles(rel)));
    else if (entry.name.endsWith('.json')) files.push(rel);
  }
  return files.sort();
}

const files = await contractFiles(TEMPLATE_DIR);

if (files.length === 0) {
  console.error(`No reader-contract templates found under ${TEMPLATE_DIR}/`);
  process.exit(1);
}

for (const file of files) {
  const raw = JSON.parse(readFileSync(path.resolve(ROOT, file), 'utf8')) as { surfaces?: RawSurface[] };
  const surfaces = raw.surfaces ?? [];

  if (surfaces.length === 0) {
    fail(file, 'contract', 'declares no surfaces');
    continue;
  }

  for (const surface of surfaces) {
    const name = surface.name;
    if (!name) {
      fail(file, 'surfaces[]', 'a surface is missing its name');
      continue;
    }

    if (Array.isArray(surface.precisionLocks) && surface.precisionLocks.length === 0) {
      fail(file, name, 'precisionLocks is empty; omit the key to inherit defaults, or list the locks');
    }

    for (const deny of surface.denyTerms ?? []) {
      if (!deny.term) fail(file, name, 'a denyTerm is missing its term');
      else if (!deny.replacement) fail(file, name, `denyTerm "${deny.term}" has no replacement`);
    }

    try {
      const contract = await loadProjectReaderContract({ file, surface: name, cwd: ROOT });
      if (!contract) {
        fail(file, name, 'loader returned no contract');
        continue;
      }
      if (!contract.reader) fail(file, name, 'reader is empty after merge');
      if (!contract.job) fail(file, name, 'job is empty after merge');
      if (!contract.plainness) fail(file, name, 'plainness is empty after merge');
      if (!contract.precisionLocks?.length) fail(file, name, 'precisionLocks is empty after merge');
      console.log(`  ok  ${file} :: ${name} (${contract.plainness})`);
    } catch (error) {
      fail(file, name, (error as Error).message);
    }
  }

  try {
    await loadProjectReaderContract({ file, surface: '__no_such_surface__', cwd: ROOT });
    fail(file, 'contract', 'an unknown surface name did not throw');
  } catch {
    // Expected: an unknown surface must fail loudly rather than fall back to defaults.
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`\n${files.length} template(s) verified.`);
