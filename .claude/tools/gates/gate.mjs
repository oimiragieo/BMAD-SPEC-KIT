#!/usr/bin/env node
/**
 * Gate: validate → optional auto-fix → record gate result
 * Usage:
 *   node .claude/tools/gates/gate.mjs --schema <schema> --input <json> --gate <gatefile> [--autofix 1]
 */
import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k.startsWith('--')) {
      const key = k.slice(2);
      if (v && !v.startsWith('--')) { args[key] = v; i += 1; }
      else { args[key] = true; }
    }
  }
  return args;
}

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function typeOf(v) { if (v === null) return 'null'; if (Array.isArray(v)) return 'array'; return typeof v; }

function validate(schema, data, pathSeg = '$') {
  const errors = [];
  const t = schema.type;
  const expectedTypes = Array.isArray(t) ? t : [t];
  const dataType = typeOf(data);
  if (t && !expectedTypes.includes(dataType)) {
    errors.push(`${pathSeg}: expected ${expectedTypes.join('|')}, got ${dataType}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(data)) errors.push(`${pathSeg}: must be one of ${schema.enum.join(', ')}`);
  if (dataType === 'object') {
    const props = schema.properties || {};
    const required = schema.required || [];
    for (const r of required) if (!(r in data)) errors.push(`${pathSeg}.${r}: is required`);
    if (schema.additionalProperties === false) {
      for (const k of Object.keys(data)) if (!(k in props)) errors.push(`${pathSeg}.${k}: additional property not allowed`);
    }
    for (const [k, sub] of Object.entries(props)) if (k in data) errors.push(...validate(sub, data[k], `${pathSeg}.${k}`));
  }
  if (dataType === 'array') {
    const itemsSchema = schema.items; const minItems = schema.minItems || 0;
    if (data.length < minItems) errors.push(`${pathSeg}: must have at least ${minItems} items`);
    if (itemsSchema) data.forEach((item, i) => errors.push(...validate(itemsSchema, item, `${pathSeg}[${i}]`)));
  }
  if (dataType === 'string') {
    if (schema.minLength && data.length < schema.minLength) errors.push(`${pathSeg}: string shorter than ${schema.minLength}`);
    if (schema.maxLength && data.length > schema.maxLength) errors.push(`${pathSeg}: string exceeds ${schema.maxLength}`);
    if (schema.pattern) { const re = new RegExp(schema.pattern); if (!re.test(data)) errors.push(`${pathSeg}: does not match ${schema.pattern}`); }
  }
  if (dataType === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) errors.push(`${pathSeg}: < minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && data > schema.maximum) errors.push(`${pathSeg}: > maximum ${schema.maximum}`);
  }
  return errors;
}

function autoFix(schema, data) {
  // Non-destructive autofixes only: remove additional properties, trim strings.
  if (typeOf(data) === 'object') {
    const props = schema.properties || {};
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      if (schema.additionalProperties === false && !(k in props)) continue; // drop unknown
      out[k] = autoFix(props[k] || {}, v);
    }
    return out;
  }
  if (typeOf(data) === 'array') {
    const itemsSchema = schema.items || {};
    return data.map(item => autoFix(itemsSchema, item));
  }
  if (typeOf(data) === 'string') { return data.trim(); }
  return data;
}

function main() {
  const args = parseArgs(process.argv);
  const schemaPath = args.schema; const inputPath = args.input; const gatePath = args.gate; const autofix = parseInt(args.autofix || '0', 10);
  if (!schemaPath || !inputPath || !gatePath) {
    console.error('Usage: node .claude/tools/gates/gate.mjs --schema <schema> --input <json> --gate <gatefile> [--autofix 1]');
    process.exit(2);
  }
  const schema = loadJSON(schemaPath);
  let data = loadJSON(inputPath);
  const attempts = [];
  let errors = validate(schema, data);
  if (errors.length && autofix > 0) {
    const fixed = autoFix(schema, data);
    attempts.push({ kind: 'autofix', changes: 'trim_strings|drop_additional_props' });
    fs.writeFileSync(inputPath, JSON.stringify(fixed, null, 2));
    data = fixed;
    errors = validate(schema, data);
  }

  const status = errors.length ? (attempts.length ? 'fail_after_fix' : 'fail') : (attempts.length ? 'fixed' : 'pass');
  const record = {
    status,
    attempts,
    errors,
    schema: path.relative(process.cwd(), schemaPath),
    input: path.relative(process.cwd(), inputPath),
    timestamp: new Date().toISOString()
  };
  saveJSON(gatePath, record);
  if (status.startsWith('fail')) {
    console.error('Validation failed. See gate record:', gatePath);
    process.exit(1);
  }
}

main();

