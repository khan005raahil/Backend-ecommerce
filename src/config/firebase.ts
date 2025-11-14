// src/config/firebase.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const servicePath = "C:/Users/DELL/Documents/backend-application-ecommerce/serviceAccountKey.json";

function loadServiceAccount() {
  try {
    if (!fs.existsSync(servicePath)) return null;
    const raw = fs.readFileSync(servicePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load service account JSON', e);
    return null;
  }
}

const serviceAccount = loadServiceAccount();

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export default admin;
