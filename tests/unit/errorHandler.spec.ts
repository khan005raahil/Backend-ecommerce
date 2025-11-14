import errorHandler from '../../src/middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
}

describe('errorHandler middleware', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('sends provided status and message', () => {
    const err = { status: 400, message: 'Bad' };
    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn();

    // @ts-ignore
    errorHandler(err, req, res, next as NextFunction);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad' });
  });

  test('uses err.message when present (generic Error with message)', () => {
    const err = new Error('oops');
    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn();

    // @ts-ignore
    errorHandler(err, req, res, next as NextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
 
    expect(res.json).toHaveBeenCalledWith({ error: 'oops' });
  });

  test('defaults to 500 and generic message when no message present', () => {
    const err: any = {};
    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn();

    // @ts-ignore
    errorHandler(err, req, res, next as NextFunction);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
