import { db } from '../config/firebase';

const COLLECTION = 'products';

class ProductsRepo {
  static async create(doc: any) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set(doc);
    return { id: ref.id, ...doc };
  }

  static async list(query: any) {
    let q: FirebaseFirestore.Query = db.collection(COLLECTION);
    if (query.category) q = q.where('category', '==', query.category);
    const snap = await q.limit(50).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  static async getById(id: string) {
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  }

  static async update(id: string, payload: any) {
    const ref = db.collection(COLLECTION).doc(id);
    await ref.update(payload);
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  }

  static async delete(id: string) {
    await db.collection(COLLECTION).doc(id).delete();
    return;
  }
}

export default ProductsRepo;
