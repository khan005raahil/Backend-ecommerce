const useReal = process.env.USE_REAL_FIREBASE === 'true';

if (!useReal) {
  const mockCollection = jest.fn(() => ({
    doc: jest.fn(() => ({
      id: 'mockdocid',
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue({
        exists: true,
        id: 'mockdocid',
        data: () => ({ mock: true }),
      }),
    })),
    limit: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        docs: [{ id: 'doc1', data: () => ({ name: 'a', price: 1 }) }],
      }),
    })),
    get: jest.fn().mockResolvedValue({
      docs: [{ id: 'doc1', data: () => ({ name: 'a', price: 1 }) }],
    }),
  }));

  const mockDb = { collection: mockCollection } as any;

  jest.mock('../src/config/firebase', () => ({
    db: mockDb,
    auth: null,
  }));

  jest.mock('../src/services/email.service', () => ({
    __esModule: true,
    default: {
      sendOrderConfirmation: jest.fn().mockResolvedValue(true),
      sendOrderStatusUpdate: jest.fn().mockResolvedValue(true),
      initTransporter: jest.fn(),
    },
  }));
} else {

  jest.mock('../src/services/email.service', () => ({
    __esModule: true,
    default: {
      sendOrderConfirmation: jest.fn().mockResolvedValue(true),
      sendOrderStatusUpdate: jest.fn().mockResolvedValue(true),
      initTransporter: jest.fn(),
    },
  }));

  console.info('Jest setup: using REAL Firebase (Service Account from env).');
}
