#!/usr/bin/env node
const { spawn } = require('child_process');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('No react-scripts command specified.');
  process.exit(1);
}

const env = { ...process.env };
const major = Number.parseInt(process.versions.node.split('.')[0], 10);
const options = (env.NODE_OPTIONS || '')
  .split(/\s+/)
  .filter(Boolean)
  .filter((option) => option !== '--openssl-legacy-provider');

if (Number.isFinite(major) && major === 17 && !options.includes('--openssl-legacy-provider')) {
  options.push('--openssl-legacy-provider');
}

if (options.length > 0) {
  env.NODE_OPTIONS = options.join(' ');
} else {
  delete env.NODE_OPTIONS;
}

const scriptPath = require.resolve('react-scripts/bin/react-scripts');
const child = spawn(process.execPath, [scriptPath, ...args], {
  stdio: 'inherit',
  env,
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
