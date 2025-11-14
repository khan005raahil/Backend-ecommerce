import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

function loadServiceAccount() {
  const filePath = process.env.SERVICE_ACCOUNT_PATH ||
    path.join("C:\Users\DELL\Documents\backend-application-ecommerce\firebase.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Service account JSON not found at: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

const serviceAccount = loadServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const bucket = admin.storage().bucket();
