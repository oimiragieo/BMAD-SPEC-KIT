#!/usr/bin/env node
/**
 * BMAD Renderer: JSON-first → Markdown
 *
 * Usage:
 *   node .claude/tools/renderers/bmad-render.mjs <type> <path/to/input.json>
 *   
 * Types:
 *   - project-brief  -> .claude/schemas/project_brief.schema.json
 *   - prd            -> .claude/schemas/product_requirements.schema.json
 *   - architecture   -> .claude/schemas/system_architecture.schema.json
 *   - ux-spec        -> .claude/schemas/ux_spec.schema.json
 *   - test-plan      -> .claude/schemas/test_plan.schema.json
 */

import fs from 'fs';
import path from 'path';

const CWD = process.cwd();
const ROOT = CWD; // Run from repo root for relative paths

const schemaMap = {
  'project-brief': '.claude/schemas/project_brief.schema.json',
  prd: '.claude/schemas/product_requirements.schema.json',
  architecture: '.claude/schemas/system_architecture.schema.json',
  'ux-spec': '.claude/schemas/ux_spec.schema.json',
  'test-plan': '.claude/schemas/test_plan.schema.json',
  story: '.claude/schemas/user_story.schema.json',
  epic: '.claude/schemas/epic.schema.json',
  backlog: '.claude/schemas/backlog.schema.json',
  'review-notes': '.claude/schemas/review_notes.schema.json',
  'enhancement-classification': '.claude/schemas/enhancement_classification.schema.json'
};

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function validate(schema, data, pathSeg = '$') {
  const errors = [];
  const t = schema.type;

  // Handle union types like ["string", "null"] (not used here; keep simple)
  const expectedTypes = Array.isArray(t) ? t : [t];
  const dataType = typeOf(data);

  if (t && !expectedTypes.includes(dataType)) {
    errors.push(`${pathSeg}: expected type ${expectedTypes.join('|')}, got ${dataType}`);
    return errors;
  }

  if (schema.enum && !schema.enum.includes(data)) {
    errors.push(`${pathSeg}: value must be one of ${schema.enum.join(', ')}`);
  }

  if (dataType === 'object') {
    const props = schema.properties || {};
    const required = schema.required || [];

    for (const r of required) {
      if (!(r in data)) errors.push(`${pathSeg}.${r}: is required`);
    }

    if (schema.additionalProperties === false) {
      for (const k of Object.keys(data)) {
        if (!(k in props)) errors.push(`${pathSeg}.${k}: additional property not allowed`);
      }
    }

    for (const [k, subSchema] of Object.entries(props)) {
      if (k in data) {
        errors.push(...validate(subSchema, data[k], `${pathSeg}.${k}`));
      }
    }
  }

  if (dataType === 'array') {
    const itemsSchema = schema.items;
    const minItems = schema.minItems || 0;
    if (data.length < minItems) errors.push(`${pathSeg}: must have at least ${minItems} items`);
    if (itemsSchema) {
      data.forEach((item, i) => {
        errors.push(...validate(itemsSchema, item, `${pathSeg}[${i}]`));
      });
    }
  }

  if (dataType === 'string') {
    if (schema.minLength && data.length < schema.minLength) {
      errors.push(`${pathSeg}: string shorter than minLength ${schema.minLength}`);
    }
    if (schema.pattern) {
      const re = new RegExp(schema.pattern);
      if (!re.test(data)) errors.push(`${pathSeg}: does not match pattern ${schema.pattern}`);
    }
  }

  if (dataType === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push(`${pathSeg}: number below minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push(`${pathSeg}: number above maximum ${schema.maximum}`);
    }
  }

  return errors;
}

function h(level, text) { return `${'#'.repeat(level)} ${text}`; }
function bullet(items) { return items.map(i => `- ${i}`).join('\n'); }
function kv(key, val) { return `- ${key}: ${val}`; }

const renderers = {
  'project-brief': (d) => {
    return [
      h(1, d.project_name),
      '',
      h(2, 'Summary'),
      d.summary,
      '',
      h(2, 'Goals'),
      bullet(d.goals),
      '',
      h(2, 'Target Users'),
      bullet(d.target_users),
      '',
      h(2, 'Success Metrics'),
      bullet(d.success_metrics),
      '',
      h(2, 'Scope'),
      kv('In scope', d.scope.in_scope.join(', ')),
      kv('Out of scope', d.scope.out_of_scope.join(', '))
    ].join('\n');
  },
  prd: (d) => {
    const personas = d.personas.map(p => `- ${p.name}: goals: ${p.goals.join('; ')}; pain points: ${p.pain_points.join('; ')}`).join('\n');
    const features = d.features.map(f => [
      `- ${f.id} ${f.title}`,
      `  - Description: ${f.description}`,
      `  - Priority: ${f.priority}`,
      `  - Acceptance Criteria:`,
      ...f.acceptance_criteria.map(ac => `    - ${ac}`),
      f.dependencies && f.dependencies.length ? `  - Dependencies: ${f.dependencies.join(', ')}` : ''
    ].filter(Boolean).join('\n')).join('\n');
    return [
      h(1, d.title),
      '',
      h(2, 'Overview'),
      d.overview,
      '',
      h(2, 'Personas'),
      personas,
      '',
      h(2, 'Features'),
      features,
      '',
      h(2, 'Non-functional Requirements'),
      bullet(d.non_functional_requirements),
      '',
      h(2, 'Constraints'),
      bullet(d.constraints)
    ].join('\n');
  },
  architecture: (d) => {
    const adrs = d.decisions.map(a => `- ${a.id} [${a.status}]: ${a.decision} — ${a.rationale}`).join('\n');
    const comps = d.components.map(c => `- ${c.name} (${c.technology}): ${c.responsibilities.join(', ')}`).join('\n');
    const entities = d.data_model.entities.map(e => [
      `- ${e.name}`,
      ...e.attributes.map(at => `  - ${at.name}: ${at.type}${at.description ? ` — ${at.description}` : ''}`),
      e.relationships && e.relationships.length ? `  - Relationships: ${e.relationships.join('; ')}` : ''
    ].filter(Boolean).join('\n')).join('\n');
    const integrations = d.integration.map(i => `- ${i.with} (${i.direction}, ${i.protocol})${i.notes ? ` — ${i.notes}` : ''}`).join('\n');
    const perf = d.performance.targets.map(t => `- ${t.metric}: ${t.target}`).join('\n');
    return [
      h(1, 'System Architecture'),
      '',
      h(2, 'Context'),
      d.context,
      '',
      h(2, 'Architecture Decisions'),
      adrs,
      '',
      h(2, 'Components'),
      comps,
      '',
      h(2, 'Data Model'),
      entities,
      '',
      h(2, 'Integration'),
      integrations,
      '',
      h(2, 'Deployment'),
      bullet([`Strategy: ${d.deployment.strategy}`, d.deployment.diagram ? `Diagram: ${d.deployment.diagram}` : null].filter(Boolean)),
      '',
      h(2, 'Security'),
      bullet([`Threats: ${d.security.threats.join(', ')}`, `Controls: ${d.security.controls.join(', ')}`]),
      '',
      h(2, 'Performance Targets'),
      perf
    ].join('\n');
  },
  'ux-spec': (d) => {
    const screens = d.screens.map(s => [
      `- ${s.name}: ${s.purpose}`,
      ...s.components.map(c => `  - ${c.id} (${c.type})${c.label ? ` — ${c.label}` : ''}`)
    ].join('\n')).join('\n');
    const flows = d.flows.map(f => `- ${f.name}: ${f.steps.join(' → ')}`).join('\n');
    return [
      h(1, 'UX Specification'),
      '',
      h(2, 'Design Principles'),
      bullet(d.design_principles),
      '',
      h(2, 'Information Architecture'),
      d.information_architecture.map(i => `- ${i.section}: ${i.content}`).join('\n'),
      '',
      h(2, 'Screens'),
      screens,
      '',
      h(2, 'Flows'),
      flows,
      '',
      h(2, 'Accessibility'),
      bullet(d.accessibility.guidelines)
    ].join('\n');
  },
  'test-plan': (d) => {
    const levels = d.test_levels.map(l => `- ${l.level}: ${l.tools.join(', ')}`).join('\n');
    const cases = d.test_cases.map(tc => [
      `- ${tc.id} ${tc.title} [${tc.priority}]`,
      `  - Preconditions: ${tc.preconditions.join('; ')}`,
      `  - Steps:`,
      ...tc.steps.map(s => `    - ${s.action} ⇒ ${s.expected}`),
      tc.tags && tc.tags.length ? `  - Tags: ${tc.tags.join(', ')}` : ''
    ].filter(Boolean).join('\n')).join('\n');
    return [
      h(1, 'Test Plan'),
      '',
      h(2, 'Strategy'),
      d.strategy,
      '',
      h(2, 'Scope'),
      bullet([`In scope: ${d.scope.in_scope.join(', ')}`, `Out of scope: ${d.scope.out_of_scope.join(', ')}`]),
      '',
      h(2, 'Test Levels'),
      levels,
      '',
      h(2, 'Test Cases'),
      cases,
      '',
      h(2, 'Coverage Targets'),
      bullet([`Statements: ${d.coverage_targets.statements}%`, `Branches: ${d.coverage_targets.branches}%`, `Functions: ${d.coverage_targets.functions}%`, `Lines: ${d.coverage_targets.lines}%`]),
      '',
      h(2, 'Environments'),
      bullet(d.environments),
      '',
      h(2, 'Reporting'),
      bullet([`Tools: ${d.reporting.tools.join(', ')}`, `Cadence: ${d.reporting.cadence}`])
    ].join('\n');
  }
  ,
  story: (d) => {
    const deps = d.depends_on && d.depends_on.length ? `\n${h(3, 'Dependencies')}\n${bullet(d.depends_on)}` : '';
    const links = d.prd_refs && d.prd_refs.length ? `\n${h(3, 'PRD References')}\n${bullet(d.prd_refs)}` : '';
    return [
      h(1, `${d.id} ${d.title}`),
      '',
      h(2, 'Description'),
      d.description,
      '',
      h(2, 'Acceptance Criteria'),
      bullet(d.acceptance_criteria),
      '',
      h(2, 'Priority & Estimate'),
      bullet([`Priority: ${d.priority}`, d.estimate_points !== undefined ? `Estimate: ${d.estimate_points}pt` : null].filter(Boolean)),
      deps,
      links
    ].join('\n');
  },
  epic: (d) => {
    return [
      h(1, `${d.id} ${d.title}`),
      '',
      h(2, 'Description'),
      d.description,
      '',
      h(2, 'Business Value'),
      String(d.business_value ?? ''),
      '',
      h(2, 'Stories'),
      bullet(d.stories)
    ].join('\n');
  },
  backlog: (d) => {
    const items = d.items.map(i => `- [${i.type}] ${i.id} — ${i.priority} — ${i.status}${i.sprint ? ` — ${i.sprint}` : ''}`).join('\n');
    return [
      h(1, 'Backlog'),
      '',
      h(2, 'Items'),
      items
    ].join('\n');
  },
  'review-notes': (d) => {
    const findings = d.findings.map(f => [
      `- ${f.area}`,
      ...f.issues.map(is => `  - ${is}`)
    ].join('\n')).join('\n');
    return [
      h(1, 'Implementation Review Notes'),
      '',
      h(2, 'Summary'),
      d.summary,
      '',
      h(2, 'Findings'),
      findings,
      '',
      h(2, 'Recommendations'),
      bullet(d.recommendations)
    ].join('\n');
  },
  'enhancement-classification': (d) => {
    return [
      h(1, 'Enhancement Classification'),
      '',
      h(2, 'Level'),
      d.level,
      '',
      h(2, 'Recommended Workflow'),
      d.recommended_workflow,
      '',
      h(2, 'Rationale'),
      d.rationale,
      '',
      h(2, 'Indicators'),
      d.indicators && d.indicators.length ? bullet(d.indicators) : '-'
    ].join('\n');
  }
};

function die(msg) { console.error(msg); process.exit(1); }

function main() {
  const [,, type, jsonPath] = process.argv;
  if (!type || !jsonPath) {
    die('Usage: node .claude/tools/renderers/bmad-render.mjs <type> <path/to/input.json>');
  }
  const schemaPath = schemaMap[type];
  if (!schemaPath) die(`Unknown type: ${type}`);
  const absSchema = path.resolve(ROOT, schemaPath);
  const absInput = path.resolve(ROOT, jsonPath);
  if (!fs.existsSync(absSchema)) die(`Schema not found: ${absSchema}`);
  if (!fs.existsSync(absInput)) die(`Input not found: ${absInput}`);

  const schema = loadJSON(absSchema);
  const data = loadJSON(absInput);
  const errors = validate(schema, data);
  if (errors.length) {
    die('Schema validation failed:\n' + errors.map(e => `- ${e}`).join('\n'));
  }

  const renderer = renderers[type];
  if (!renderer) die(`No renderer for type: ${type}`);
  const md = renderer(data);
  process.stdout.write(md + '\n');
}

main();
