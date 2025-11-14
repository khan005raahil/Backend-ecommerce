import { createProductSchema, updateProductSchema } from '../../src/validators/product.validator';

describe('Product validators', () => {
  test('createProductSchema accepts valid payload', () => {
    const payload = { name: 'Phone', price: 199.99, stock: 10 };
    const { error, value } = createProductSchema.validate(payload);
    expect(error).toBeUndefined();
    expect(value.name).toBe('Phone');
  });

  test('createProductSchema rejects missing required fields', () => {
    const payload = { price: 10 };
    const { error } = createProductSchema.validate(payload);
    expect(error).toBeDefined();
    expect(error!.details.some(d => d.path.includes('name'))).toBeTruthy();
  });

  test('updateProductSchema allows partial update', () => {
    const payload = { price: 49.99 };
    const { error, value } = updateProductSchema.validate(payload);
    expect(error).toBeUndefined();
    expect(value.price).toBe(49.99);
  });

  test('updateProductSchema rejects invalid types', () => {
    const payload = { price: 'not-a-number' };
    const { error } = updateProductSchema.validate(payload);
    expect(error).toBeDefined();
  });
});
