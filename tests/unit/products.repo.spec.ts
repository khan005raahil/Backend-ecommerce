jest.mock('../../src/config/firebase', () => {
  
  const docMock = jest.fn();
  const collectionMock = jest.fn(() => ({
    doc: docMock,
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
  }));

  const mockedDb = {
    collection: collectionMock
  };

  return { db: mockedDb };
});

import ProductsRepo from '../../src/repositories/products.repo';
import { db } from '../../src/config/firebase';

describe('ProductsRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create should call collection().doc().set and return id + doc', async () => {
    const fakeRef = {
      id: 'abc123',
      set: jest.fn().mockResolvedValue(undefined),
    };


    (db.collection as jest.Mock).mockReturnValue({
      doc: () => fakeRef
    });

    const input = { name: 'P', price: 10 };
    const res = await ProductsRepo.create(input as any);

    expect(fakeRef.set).toHaveBeenCalledWith(input);
    expect(res).toEqual({ id: 'abc123', ...input });
  });

  test('getById returns null when not exists', async () => {
    const snap = { exists: false, id: 'x', data: () => ({}) };
    (db.collection as jest.Mock).mockReturnValue({
      doc: (id: string) => ({
        get: jest.fn().mockResolvedValue(snap)
      })
    });

    const res = await ProductsRepo.getById('nope');
    expect(res).toBeNull();
  });

  test('getById returns data when exists', async () => {
    const snap = { exists: true, id: 'p1', data: () => ({ name: 'A' }) };
    (db.collection as jest.Mock).mockReturnValue({
      doc: (id: string) => ({
        get: jest.fn().mockResolvedValue(snap)
      })
    });

    const res = await ProductsRepo.getById('p1');
    expect(res).toEqual({ id: 'p1', name: 'A' });
  });

  test('list returns mapped docs', async () => {
    const docs = [
      { id: 'p1', data: () => ({ name: 'A' }) },
      { id: 'p2', data: () => ({ name: 'B' }) }
    ];
    const getMock = jest.fn().mockResolvedValue({ docs });
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: getMock
    });

    const res = await ProductsRepo.list({ category: 'c' } as any);
    expect(Array.isArray(res)).toBeTruthy();
    expect(res.length).toBe(2);
    expect(res[0]).toEqual({ id: 'p1', name: 'A' });
  });

  test('update calls update and returns fresh snapshot', async () => {
    const updatedDoc = { id: 'p1', data: () => ({ name: 'X' }) };
    const updateMock = jest.fn().mockResolvedValue(undefined);
    const getMock = jest.fn().mockResolvedValue(updatedDoc);
    (db.collection as jest.Mock).mockReturnValue({
      doc: (id: string) => ({
        update: updateMock,
        get: getMock
      })
    });

    const payload = { name: 'X' };
    const res = await ProductsRepo.update('p1', payload as any);
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining(payload));
    expect(res).toEqual({ id: 'p1', ...updatedDoc.data() });
  });

  test('delete calls delete on doc', async () => {
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    (db.collection as jest.Mock).mockReturnValue({
      doc: (id: string) => ({ delete: deleteMock })
    });

    await ProductsRepo.delete('p1');
    expect((db.collection as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
