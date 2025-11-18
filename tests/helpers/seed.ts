import { db } from '../../src/config/firebase';

export async function seedTestData() {
  if (!db) throw new Error('No Firestore db in seedTestData');
  await db.collection('products').doc('test-product-1').set({
    name: 'Test Product 1',
    price: 20,
    category: 'test',
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await db.collection('customers').doc('test-customer-1').set({
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
