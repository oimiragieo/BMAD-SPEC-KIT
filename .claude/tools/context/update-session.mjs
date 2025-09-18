#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const sessionPath = path.join(ROOT, '.claude/context/session.json');

function parseArgs(argv) {
  const args = { addArtifact: [], addSchema: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const k = argv[i];
    const v = argv[i + 1];
    if (!k) break;
    switch (k) {
      case '--set-workflow': args.workflow = v; i++; break;
      case '--set-step': args.step = parseInt(v, 10); i++; break;
      case '--set-route': args.route = v; i++; break;
      case '--add-artifact': args.addArtifact.push(v); i++; break;
      case '--add-schema': args.addSchema.push(v); i++; break;
      default: break;
    }
  }
  return args;
}

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

function ensureSession() {
  if (!fs.existsSync(sessionPath)) {
    return {
      session_id: '', created_at: '', last_updated: '', route_decision: null,
      project: { name: '', type: '', workflow: '', status: '' },
      current_context: { active_workflow: '', current_step: 0, active_agent: '', current_task: '' },
      workflow_progress: { completed_steps: [], current_step: 0, next_steps: [], blocked_steps: [] },
      artifacts: { generated: [], schemas_used: [], context_files: [] },
      agents: {
        analyst: { activated: false, last_task: null, outputs: [] },
        pm: { activated: false, last_task: null, outputs: [] },
        architect: { activated: false, last_task: null, outputs: [] },
        developer: { activated: false, last_task: null, outputs: [] },
        qa: { activated: false, last_task: null, outputs: [] },
        'ux-expert': { activated: false, last_task: null, outputs: [] }
      },
      user_preferences: { workflow_mode: 'interactive', detail_level: 'high', feedback_frequency: 'each_step' },
      quality_gates: { passed: [], failed: [], pending: [] },
      notes: []
    };
  }
  return loadJSON(sessionPath);
}

function main() {
  const args = parseArgs(process.argv);
  let s = ensureSession();
  if (args.workflow) { s.project.workflow = args.workflow; s.current_context.active_workflow = args.workflow; }
  if (!Number.isNaN(args.step)) { s.current_context.current_step = args.step; s.workflow_progress.current_step = args.step; }
  if (args.route && fs.existsSync(args.route)) { s.route_decision = loadJSON(args.route); }
  if (args.addArtifact.length) s.artifacts.generated = uniq(s.artifacts.generated.concat(args.addArtifact));
  if (args.addSchema.length) s.artifacts.schemas_used = uniq(s.artifacts.schemas_used.concat(args.addSchema));
  s.last_updated = new Date().toISOString();
  saveJSON(sessionPath, s);
}

main();

