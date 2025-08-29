require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

const bucketName = process.env.GCS_BUCKET;
if (!bucketName) {
  console.error('GCS_BUCKET no está definido');
  process.exit(1);
}

const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucket = storage.bucket(bucketName);

function platformPrefix(filename) {
  const name = filename.toLowerCase();
  if (name.includes('mac') || name.endsWith('.dmg') || name.endsWith('.zip')) return 'mac';
  if (name.includes('linux') || name.endsWith('.appimage') || name.endsWith('.tar.gz')) return 'linux';
  return 'win';
}

async function uploadRelease() {
  const files = fs.readdirSync('release');
  for (const file of files) {
    const full = path.join('release', file);
    if (fs.statSync(full).isDirectory()) continue;
    const prefix = platformPrefix(file);
    const dest = path.posix.join(prefix, file);
    await bucket.upload(full, { destination: dest, resumable: false });
    console.log(`Subido: ${dest}`);
  }
}

uploadRelease().catch(err => {
  console.error('Error subiendo archivos:', err);
  process.exit(1);
});
