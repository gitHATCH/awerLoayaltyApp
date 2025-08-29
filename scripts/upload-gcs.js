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

async function uploadDir(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stats = fs.statSync(full);
    const dest = path.posix.join(prefix, entry);

    if (stats.isDirectory()) {
      await uploadDir(full, dest);
    } else {
      await bucket.upload(full, { destination: dest, resumable: false });
      console.log(`Subido: ${dest}`);
    }
  }
}

uploadDir('release')
  .catch(err => {
    console.error('Error subiendo archivos:', err);
    process.exit(1);
  });
