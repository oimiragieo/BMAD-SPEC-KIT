#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const dirs = [
  'src/frontend/components',
  'src/frontend/pages',
  'src/frontend/styles',
  'src/frontend/hooks',
  'src/frontend/utils',
  'src/frontend/types',
  'src/backend/api',
  'src/backend/models',
  'src/backend/services',
  'src/backend/middleware',
  'src/backend/utils',
  'src/backend/config',
  'tests/frontend',
  'tests/backend',
  'tests/integration',
  'tests/e2e'
];

for (const d of dirs) {
  const abs = path.join(ROOT, d);
  fs.mkdirSync(abs, { recursive: true });
  const keep = path.join(abs, '.gitkeep');
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
}

console.log('Scaffolded directories:', dirs.join(', '));

