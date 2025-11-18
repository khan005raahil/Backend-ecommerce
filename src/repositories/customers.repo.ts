// src/repositories/customers.repo.ts
import { db } from '../config/firebase';

const COLLECTION = 'customers';

class CustomersRepo {
  private static ensureDb() {
    if (!db) throw new Error('Firestore not initialized (CustomersRepo)');
  }

  static async create(doc: any) {
    this.ensureDb();
    const ref = db!.collection(COLLECTION).doc();
    await ref.set(doc);
    return { id: ref.id, ...doc };
  }

  static async getById(id: string) {
    this.ensureDb();
    const snap = await db!.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  }

  static async update(id: string, payload: any) {
    this.ensureDb();
    const ref = db!.collection(COLLECTION).doc(id);
    await ref.update(payload);
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  }

  static async list(query: any = {}) {
    this.ensureDb();
    const limit = query.limit ? parseInt(query.limit, 10) : 50;

    const snap = await db!.collection(COLLECTION).limit(limit).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  static async delete(id: string) {
    this.ensureDb();
    await db!.collection(COLLECTION).doc(id).delete();
    return true;
  }
}

export default CustomersRepo;
