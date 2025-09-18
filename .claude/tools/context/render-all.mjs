#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const artifactsDir = path.join(ROOT, '.claude/context/artifacts');

const map = [
  { pattern: /^project-brief\.json$/, type: 'project-brief', out: () => 'project-brief.md' },
  { pattern: /^prd\.json$/, type: 'prd', out: () => 'prd.md' },
  { pattern: /^ux-spec\.json$/, type: 'ux-spec', out: () => 'ui-spec.md' },
  { pattern: /^system-architecture\.json$/, type: 'architecture', out: () => 'fullstack-architecture.md' },
  { pattern: /^frontend-architecture\.json$/, type: 'architecture', out: () => 'frontend-architecture.md' },
  { pattern: /^architecture\.json$/, type: 'architecture', out: () => 'architecture.md' },
  { pattern: /^test-plan\.json$/, type: 'test-plan', out: () => 'test-plan.md' },
  { pattern: /^review-notes\.json$/, type: 'review-notes', out: () => 'review-notes.md' },
  { pattern: /^enhancement-classification\.json$/, type: 'enhancement-classification', out: () => 'enhancement-classification.md' },
  { pattern: /^backlog\.json$/, type: 'backlog', out: () => 'backlog.md' },
  { pattern: /^epic-.*\.json$/, type: 'epic', out: (f) => f.replace(/\.json$/, '.md') },
  { pattern: /^story-.*\.json$/, type: 'story', out: (f) => f.replace(/\.json$/, '.md') }
];

function render(type, inputPath) {
  const res = spawnSync('node', ['.claude/tools/renderers/bmad-render.mjs', type, inputPath], { cwd: ROOT, encoding: 'utf8' });
  return { code: res.status ?? 1, stdout: res.stdout || '', stderr: res.stderr || '' };
}

function main() {
  if (!fs.existsSync(artifactsDir)) {
    console.log('Artifacts directory not found:', artifactsDir);
    process.exit(0);
  }
  const files = fs.readdirSync(artifactsDir).filter(f => f.endsWith('.json'));
  let ok = true; const results = [];
  for (const f of files) {
    const rule = map.find(m => m.pattern.test(f));
    if (!rule) continue;
    const inputPath = path.join(artifactsDir, f);
    const outName = typeof rule.out === 'function' ? rule.out(f) : rule.out;
    const outPath = path.join(artifactsDir, outName);
    const r = render(rule.type, inputPath);
    if (r.code === 0) {
      fs.writeFileSync(outPath, r.stdout);
      results.push({ file: f, out: outName, status: 'ok' });
    } else {
      ok = false;
      results.push({ file: f, out: outName, status: 'fail', error: (r.stderr || '').trim() });
    }
  }
  if (!results.length) {
    console.log('No renderable artifacts found in', artifactsDir);
    process.exit(0);
  }
  for (const r of results) {
    if (r.status === 'ok') console.log(`Rendered ${r.file} -> ${r.out}`);
    else console.error(`Failed ${r.file}: ${r.error}`);
  }
  process.exit(ok ? 0 : 1);
}

main();

