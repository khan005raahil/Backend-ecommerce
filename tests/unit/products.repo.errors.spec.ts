jest.mock('../../src/config/firebase', () => {
  const collectionMock = jest.fn();
  const mockedDb = { collection: collectionMock };
  return { db: mockedDb };
});

import ProductsRepo from '../../src/repositories/products.repo';
import { db } from '../../src/config/firebase';

describe('ProductsRepo error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create should throw when set rejects', async () => {
    const fakeRef = { id: 'abc', set: jest.fn().mockRejectedValue(new Error('firestore fail')) };
    (db.collection as jest.Mock).mockReturnValue({
      doc: () => fakeRef
    });

    await expect(ProductsRepo.create({ name: 'P' } as any)).rejects.toThrow('firestore fail');
  });

  test('update should throw when update rejects', async () => {
    const updateMock = jest.fn().mockRejectedValue(new Error('upd fail'));
    (db.collection as jest.Mock).mockReturnValue({
      doc: () => ({ update: updateMock })
    });

    await expect(ProductsRepo.update('p1', { name: 'X' } as any)).rejects.toThrow('upd fail');
  });
});
