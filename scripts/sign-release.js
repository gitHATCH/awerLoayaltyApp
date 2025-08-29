const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const releaseDir = 'release';

if (!fs.existsSync(releaseDir)) {
  console.error('Release directory not found, nothing to sign');
  process.exit(0);
}

function signWindows(file) {
  const cert = process.env.WINDOWS_CERT_FILE;
  const password = process.env.WINDOWS_CERT_PASSWORD;
  const timestamp = process.env.WINDOWS_CERT_TIMESTAMP || 'http://timestamp.digicert.com';
  if (!cert || !password) {
    console.log('Skipping Windows signing - missing WINDOWS_CERT_FILE or WINDOWS_CERT_PASSWORD');
    return;
  }
  const cmd = `signtool sign /f "${cert}" /p "${password}" /tr ${timestamp} /td sha256 /fd sha256 "${file}"`;
  execSync(cmd, { stdio: 'inherit' });
}

function signMac(file) {
  const identity = process.env.MAC_CERT_IDENTITY;
  if (!identity) {
    console.log('Skipping macOS signing - missing MAC_CERT_IDENTITY');
    return;
  }
  const cmd = `codesign --deep --force --sign "${identity}" "${file}"`;
  execSync(cmd, { stdio: 'inherit' });
}

function signLinux(file) {
  const key = process.env.LINUX_SIGN_KEY;
  if (!key) {
    console.log('Skipping Linux signing - missing LINUX_SIGN_KEY');
    return;
  }
  const sig = `${file}.sig`;
  const cmd = `gpg --batch --yes --default-key "${key}" --output "${sig}" --detach-sign "${file}"`;
  execSync(cmd, { stdio: 'inherit' });
}

const entries = fs.readdirSync(releaseDir).filter(f => fs.statSync(path.join(releaseDir, f)).isFile());
for (const file of entries) {
  const full = path.join(releaseDir, file);
  if (file.endsWith('.exe') || file.endsWith('.msi')) {
    signWindows(full);
  } else if (file.endsWith('.dmg') || file.endsWith('.zip')) {
    signMac(full);
  } else if (file.endsWith('.AppImage') || file.endsWith('.tar.gz')) {
    signLinux(full);
  }
}
