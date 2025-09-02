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

function isUat() {
  const env = (process.env.ENVIROMENT || "prod").toLowerCase();
  return env === "dev" || env === "uat";
}

function currentPlatformPrefix() {
  switch (process.platform) {
    case 'darwin':
      return isUat() ? 'mac-uat' : 'mac';
    case 'win32':
      return isUat() ? 'win-uat' : 'win';
    case 'linux':
    default:
      return isUat() ? 'linux-uat' : 'linux';
  }
}

function basePlatform(prefix) {
  // Normalize prefixes like 'win-uat' -> 'win'
  if (!prefix) return 'linux';
  if (prefix.startsWith('win')) return 'win';
  if (prefix.startsWith('mac')) return 'mac';
  return 'linux';
}

function shouldUploadFor(prefix, filename) {
  const plat = basePlatform(prefix);
  const name = filename.toLowerCase();
  // Ignorar archivos internos de electron-builder
  if (name.startsWith('builder-debug') || name.startsWith('builder-effective-config')) return false;

  if (plat === 'linux') {
    return (
      name.endsWith('.appimage') ||
      name.endsWith('.tar.gz') ||
      name.endsWith('latest-linux.yml')
    );
  }
  if (plat === 'win') {
    return (
      name.endsWith('.exe') ||
      name.endsWith('.msi') ||
      name.endsWith('.blockmap') ||
      name.endsWith('latest.yml')
    );
  }
  // mac
  return (
    name.endsWith('.dmg') ||
    name.endsWith('.zip') ||
    name.endsWith('latest-mac.yml')
  );
}

async function uploadRelease() {
  if (!fs.existsSync('release')) {
    console.error("Directorio 'release' no encontrado. Asegúrate de que electron-builder haya generado artefactos (npm run dist o dist:publish)." );
    process.exit(1);
  }
  const entries = fs.readdirSync('release');
  const allFiles = entries.filter(f => fs.statSync(path.join('release', f)).isFile());

  const prefix = currentPlatformPrefix();

  // Eliminar SOLO el prefijo de la plataforma actual
  await bucket.deleteFiles({ prefix: `${prefix}/` }).catch(err => {
    if (err.code !== 404) throw err;
  });
  console.log(`Limpio remoto: ${prefix}/`);

  // Subir únicamente los artefactos de esta plataforma
  const files = allFiles.filter(f => shouldUploadFor(prefix, f));
  for (const file of files) {
    const full = path.join('release', file);
    const dest = path.posix.join(prefix, file);
    await bucket.upload(full, { destination: dest, resumable: false });
    console.log(`Subido: ${dest}`);

    // Hacer públicos los artefactos necesarios para que electron-updater pueda acceder
    const lower = file.toLowerCase();
    const plat = basePlatform(prefix);
    const makePublic = (
      (plat === 'win' && (lower.endsWith('latest.yml') || lower.endsWith('.exe') || lower.endsWith('.msi'))) ||
      (plat === 'linux' && (lower.endsWith('latest-linux.yml') || lower.endsWith('.appimage') || lower.endsWith('.tar.gz'))) ||
      (plat === 'mac' && (lower.endsWith('latest-mac.yml') || lower.endsWith('.dmg') || lower.endsWith('.zip')))
    );
    if (makePublic) {
      await bucket.file(dest).makePublic();
      console.log(`Publicado: ${dest}`);
    }
  }
}

uploadRelease().catch(err => {
  console.error('Error subiendo archivos:', err);
  process.exit(1);
});
