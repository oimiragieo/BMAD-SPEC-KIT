#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const pairs = [
  { src: '.claude/examples/specs/user_spec.md', dst: 'user_spec.md' },
  { src: '.claude/examples/specs/enhancement_spec.md', dst: 'enhancement_spec.md' }
];

let copied = [];
for (const { src, dst } of pairs) {
  const absSrc = path.join(ROOT, src);
  const absDst = path.join(ROOT, dst);
  if (!fs.existsSync(absDst) && fs.existsSync(absSrc)) {
    fs.copyFileSync(absSrc, absDst);
    copied.push(dst);
  }
}

if (copied.length) {
  console.log('Preflight copied:', copied.join(', '));
} else {
  console.log('Preflight: no copies needed');
}

