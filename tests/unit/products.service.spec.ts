import ProductsService from '../../src/services/products.service';
import ProductsRepo from '../../src/repositories/products.repo';

jest.mock('../../src/repositories/products.repo');

describe('ProductsService', () => {
  const repoMock = ProductsRepo as jest.Mocked<typeof ProductsRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createProduct calls repo and returns created product', async () => {
    const input = { name: 'P1', price: 10 };
    const saved = { id: 'abc', ...input, createdAt: 't', updatedAt: 't' };
    repoMock.create.mockResolvedValue(saved);

    const res = await ProductsService.createProduct(input as any);
    expect(repoMock.create).toHaveBeenCalled();
    expect(res).toEqual(saved);
  });
});
