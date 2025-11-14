jest.mock('../../src/repositories/products.repo');

import request from 'supertest';
import ProductsRepo from '../../src/repositories/products.repo';

import app from '../../src/app';

const repoMock = ProductsRepo as jest.Mocked<typeof ProductsRepo>;

jest.setTimeout(10000); 

describe('Products routes (integration, mocked repo)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/products -> 201 on valid payload', async () => {
    const payload = { name: 'Integration', price: 20 };
    repoMock.create.mockResolvedValue({ id: 'p1', ...payload, createdAt: 't', updatedAt: 't' } as any);

    const res = await request(app).post('/api/products').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'p1');
    expect(repoMock.create).toHaveBeenCalled();
  });

  test('POST /api/products -> 400 on invalid payload', async () => {
    const payload = { price: -5 };
    const res = await request(app).post('/api/products').send(payload);
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.error) || typeof res.body.error === 'string').toBeTruthy();
  });

  test('GET /api/products -> 200 and returns list', async () => {
    repoMock.list.mockResolvedValue([{ id: 'p1', name: 'A' } as any]);
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('GET /api/products/:id -> 200 when found', async () => {
    repoMock.getById.mockResolvedValue({ id: 'p1', name: 'Found' } as any);
    const res = await request(app).get('/api/products/p1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'p1');
  });

  test('GET /api/products/:id -> 404 when not found', async () => {
    repoMock.getById.mockResolvedValue(null);
    const res = await request(app).get('/api/products/none');
    expect(res.status).toBe(404);
  });

  test('PUT /api/products/:id -> 200 when update succeeds', async () => {
    const payload = { name: 'Updated' };
    repoMock.update.mockResolvedValue({ id: 'p1', ...payload } as any);
    const res = await request(app).put('/api/products/p1').send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated');
  });

  test('DELETE /api/products/:id -> 204 on success', async () => {
    repoMock.delete.mockResolvedValue(undefined as any);
    const res = await request(app).delete('/api/products/p1');
    expect(res.status).toBe(204);
  });
});
