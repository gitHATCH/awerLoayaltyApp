require('dotenv').config({ path: '.env' });

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Compute suffix for publish URLs based on ENVIROMENT
const envFlag = (process.env.ENVIROMENT || 'prod').toLowerCase();
const suffix = (envFlag === 'dev' || envFlag === 'uat') ? '-uat' : '';
process.env.PUBLISH_DIR_SUFFIX = suffix;

// Resolve electron-builder CLI directly to avoid npx/.cmd issues
let cliPath;
try {
  cliPath = require.resolve('electron-builder/out/cli/cli.js');
} catch (e) {
  console.error('Cannot resolve electron-builder. Ensure it is installed (devDependency).');
  console.error(e.message);
  process.exit(1);
}

// Forward all CLI args to electron-builder
const args = [cliPath, ...process.argv.slice(2)];
const res = spawnSync(process.execPath, args, { stdio: 'inherit', env: process.env });

if (res.error) {
  console.error('Failed to run electron-builder:', res.error);
  process.exit(1);
}
process.exit(typeof res.status === 'number' ? res.status : 1);
