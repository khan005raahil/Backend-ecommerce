import ProductsRepo from '../repositories/products.repo';

type ProductInput = {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  ownerId?: string;
};

class ProductsService {
  static async createProduct(input: ProductInput) {
    const now = new Date().toISOString();
    const doc = { ...input, createdAt: now, updatedAt: now };
    return ProductsRepo.create(doc);
  }

  static async listProducts(query: any) {
    return ProductsRepo.list(query);
  }

  static async getProduct(id: string) {
    return ProductsRepo.getById(id);
  }

  static async updateProduct(id: string, payload: Partial<ProductInput>) {
 
    return ProductsRepo.update(id, payload);
  }

  static async deleteProduct(id: string) {
    return ProductsRepo.delete(id);
  }
}

export default ProductsService;
