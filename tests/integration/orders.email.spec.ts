jest.resetModules();                 
process.env.EMAIL_DISABLED = 'false' 

const emailServicePath = '../../src/services/email.service';

const emailModule = require(emailServicePath);
const emailDefault = emailModule && (emailModule.default || emailModule);

emailDefault.sendOrderConfirmation = jest.fn().mockResolvedValue({ accepted: [] });
emailDefault.sendOrderStatusUpdate = jest.fn().mockResolvedValue({ accepted: [] });
emailDefault.initTransporter = jest.fn();

const request = require('supertest');
const app = require('../../src/app').default;

const ProductsRepo = require('../../src/repositories/products.repo').default;
const CustomersRepo = require('../../src/repositories/customers.repo').default;
const OrdersRepo = require('../../src/repositories/orders.repo').default;

describe('Orders -> Email integration (mocked repos + spy on email)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    emailDefault.sendOrderConfirmation.mockResolvedValue({ accepted: [] });

    ProductsRepo.getById = jest.fn().mockResolvedValue({ id: 'p1', name: 'Prod', price: 10 });
    CustomersRepo.getById = jest.fn().mockResolvedValue({ id: 'c1', name: 'Cus', email: 'cus@test.com' });
    OrdersRepo.create = jest.fn().mockResolvedValue({ id: 'o1', status: 'processing' });
  });

  test('POST /api/orders triggers sendOrderConfirmation (spy)', async () => {
    const payload = {
      customerId: 'test-customer-1',
      items: [{ productId: 'test-product-1', quantity: 1 }],
      shipping: { cost: 10, address: '123 Test St' },
      paymentMethod: 'card'
    };

    const res = await request(app).post('/api/orders').send(payload);

    console.log('TEST RESPONSE STATUS:', res.status);
  
    console.log('TEST RESPONSE BODY:', JSON.stringify(res.body, null, 2));

    expect(emailDefault.sendOrderConfirmation).toHaveBeenCalled();
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
