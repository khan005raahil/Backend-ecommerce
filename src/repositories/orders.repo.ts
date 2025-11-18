// src/repositories/orders.repo.ts
import { db } from '../config/firebase';

const COLLECTION = 'orders';

class OrdersRepo {
  static ensureDb() {
    if (!db) throw new Error('Firestore not initialized (OrdersRepo)');
  }

  static async create(doc: any) {
    this.ensureDb();
    try {
      const ref = db!.collection(COLLECTION).doc();
      await ref.set(doc);
      return { id: ref.id, ...doc };
    } catch (err) {
      throw err;
    }
  }

  static async getById(id: string) {
    this.ensureDb();
    try {
      const snap = await db!.collection(COLLECTION).doc(id).get();
      if (!snap.exists) return null;
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      throw err;
    }
  }

  static async update(id: string, payload: any) {
    this.ensureDb();
    try {
      const ref = db!.collection(COLLECTION).doc(id);
      await ref.update(payload);
      const snap = await ref.get();
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      throw err;
    }
  }

  static async list(query: any = {}) {
    this.ensureDb();
    try {
      let q: FirebaseFirestore.Query = db!.collection(COLLECTION);
      if (query.customerId) q = q.where('customerId', '==', query.customerId);
      if (query.status) q = q.where('status', '==', query.status);
      const limit = query.limit ? parseInt(query.limit, 10) : 50;
      const snap = await q.limit(limit).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      throw err;
    }
  }

  static async delete(id: string) {
    this.ensureDb();
    try {
      await db!.collection(COLLECTION).doc(id).delete();
      return;
    } catch (err) {
      throw err;
    }
  }
}

export default OrdersRepo;
