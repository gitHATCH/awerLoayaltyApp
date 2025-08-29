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
  const entries = fs.readdirSync('release');
  const files = entries.filter(f => fs.statSync(path.join('release', f)).isFile());

  // elimina los artefactos existentes de las plataformas que se van a subir
  const prefixes = [...new Set(files.map(platformPrefix))];
  for (const prefix of prefixes) {
    await bucket.deleteFiles({ prefix: `${prefix}/` }).catch(err => {
      if (err.code !== 404) throw err;
    });
    console.log(`Limpio remoto: ${prefix}/`);
  }

  for (const file of files) {
    const full = path.join('release', file);
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
