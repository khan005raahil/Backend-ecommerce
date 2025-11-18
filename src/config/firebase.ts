import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


function loadServiceAccountFromPath(): admin.ServiceAccount | null {
  const servicePath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!servicePath) return null;
  try {
    const resolved = path.resolve(servicePath);
    if (!fs.existsSync(resolved)) {
      console.warn(`Firebase service account file not found at ${resolved}`);
      return null;
    }
    const raw = fs.readFileSync(resolved, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read/parse service account JSON:', err);
    return null;
  }
}

function loadServiceAccountFromEnv(): admin.ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKeyRaw) return null;

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
  return {
    projectId,
    clientEmail,
    privateKey,
  } as admin.ServiceAccount;
}

const saFromPath = loadServiceAccountFromPath();
const saFromEnv = saFromPath ? null : loadServiceAccountFromEnv();

try {
  if (!admin.apps.length) {
    if (saFromPath) {
      admin.initializeApp({
        credential: admin.credential.cert(saFromPath),
      });
      console.info('Firebase initialized from service account JSON (path).');
    } else if (saFromEnv) {
      admin.initializeApp({
        credential: admin.credential.cert(saFromEnv),
      });
      console.info('Firebase initialized from FIREBASE_* env vars.');
    } else {
      console.warn('Firebase credentials not found.');
    }
  }
} catch (err) {
  console.error('Firebase initialization error:', err);
}

export const db: FirebaseFirestore.Firestore | null = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export default admin;


export function getDb(): FirebaseFirestore.Firestore {
  if (!db) throw new Error('Firestore not initialized.');
  return db;
}
