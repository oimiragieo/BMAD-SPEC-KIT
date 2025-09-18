#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const artifactsDir = path.join(ROOT, '.claude/context/artifacts');
const schemaDir = path.join(ROOT, '.claude/schemas');
const gateDir = path.join(ROOT, '.claude/context/history/gates/ci');
fs.mkdirSync(gateDir, { recursive: true });

const map = [
  { pattern: /^project-brief\.json$/, schema: 'project_brief.schema.json' },
  { pattern: /^prd\.json$/, schema: 'product_requirements.schema.json' },
  { pattern: /^(system-architecture|frontend-architecture|architecture)\.json$/, schema: 'system_architecture.schema.json' },
  { pattern: /^(ux-spec|front-end-spec|ui-enhancement-spec)\.json$/, schema: 'ux_spec.schema.json' },
  { pattern: /^test-plan\.json$/, schema: 'test_plan.schema.json' },
  { pattern: /^route-decision\.json$/, schema: 'route_decision.schema.json' },
  { pattern: /^dev-manifest\.json$/, schema: 'artifact_manifest.schema.json' },
  { pattern: /^backlog\.json$/, schema: 'backlog.schema.json' },
  { pattern: /^epic-.*\.json$/, schema: 'epic.schema.json' },
  { pattern: /^story-.*\.json$/, schema: 'user_story.schema.json' },
  { pattern: /^review-notes\.json$/, schema: 'review_notes.schema.json' },
  { pattern: /^enhancement-classification\.json$/, schema: 'enhancement_classification.schema.json' }
];

function runGate(schemaPath, inputPath, gatePath) {
  const res = spawnSync('node', ['.claude/tools/gates/gate.mjs', '--schema', schemaPath, '--input', inputPath, '--gate', gatePath, '--autofix', '1'], { stdio: 'inherit' });
  return res.status === 0;
}

let ok = true;
if (fs.existsSync(artifactsDir)) {
  for (const f of fs.readdirSync(artifactsDir)) {
    if (!f.endsWith('.json')) continue;
    const rule = map.find(m => m.pattern.test(f));
    if (!rule) continue;
    const schemaPath = path.join(schemaDir, rule.schema);
    const inputPath = path.join(artifactsDir, f);
    const gatePath = path.join(gateDir, `${f}.gate.json`);
    const pass = runGate(schemaPath, inputPath, gatePath);
    if (!pass) ok = false;
  }
}

process.exit(ok ? 0 : 1);
