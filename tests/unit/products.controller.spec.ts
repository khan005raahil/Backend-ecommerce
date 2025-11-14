jest.mock('../../src/services/products.service');

import { Request, Response } from 'express';
import * as controller from '../../src/controllers/products.controller';
import ProductsService from '../../src/services/products.service';

const serviceMock = ProductsService as jest.Mocked<typeof ProductsService>;

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
}

describe('Products Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createProduct -> success returns 201', async () => {
    const req = { body: { name: 'P', price: 10 } } as Request;
    const res = mockRes();
    const next = jest.fn();

    serviceMock.createProduct.mockResolvedValue({ id: 'p1', name: 'P', price: 10 });

    await controller.createProduct(req, res, next);
    expect(serviceMock.createProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
    expect(next).not.toHaveBeenCalled();
  });

  test('getProduct -> 404 when not found', async () => {
    const req = { params: { id: 'nope' } } as unknown as Request;
    const res = mockRes();
    const next = jest.fn();

    serviceMock.getProduct.mockResolvedValue(null);

    await controller.getProduct(req, res, next);
    expect(serviceMock.getProduct).toHaveBeenCalledWith('nope');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });

  test('createProduct -> forwards error to next on service throw', async () => {
    const req = { body: { name: 'P', price: 10 } } as Request;
    const res = mockRes();
    const next = jest.fn();

    const error = new Error('boom');
    serviceMock.createProduct.mockRejectedValue(error);

    await controller.createProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test('updateProduct -> success returns updated object', async () => {
    const req = { params: { id: 'p1' }, body: { name: 'Up' } } as unknown as Request;
    const res = mockRes();
    const next = jest.fn();

    const updated = { id: 'p1', name: 'Up' };
    serviceMock.updateProduct.mockResolvedValue(updated as any);

    await controller.updateProduct(req, res, next);
    expect(serviceMock.updateProduct).toHaveBeenCalledWith('p1', { name: 'Up' });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('deleteProduct -> responds 204 on success', async () => {
    const req = { params: { id: 'p1' } } as unknown as Request;
    const res = mockRes();
    const next = jest.fn();

    serviceMock.deleteProduct.mockResolvedValue(undefined as any);

    await controller.deleteProduct(req, res, next);
    expect(serviceMock.deleteProduct).toHaveBeenCalledWith('p1');
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
