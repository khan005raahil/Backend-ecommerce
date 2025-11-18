// src/services/customers.service.ts
import CustomersRepo from '../repositories/customers.repo';

export type CustomerInput = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: any;
};

class CustomersService {
  static async createCustomer(input: CustomerInput) {
    const now = new Date().toISOString();
    const doc = { ...input, createdAt: now, updatedAt: now };
    return CustomersRepo.create(doc);
  }

  static async getCustomer(id: string) {
    return CustomersRepo.getById(id);
  }

  static async listCustomers(query: any = {}) {
    return CustomersRepo.list(query);
  }

  static async updateCustomer(id: string, payload: Partial<CustomerInput>) {
    // payload = { ...payload, updatedAt: new Date().toISOString() };
    return CustomersRepo.update(id, payload);
  }

  static async deleteCustomer(id: string) {
    return CustomersRepo.delete ? CustomersRepo.delete(id) : (await CustomersRepo.update(id, { deleted: true })) ;
    // If repo implements delete, use it; otherwise soft-delete by marking.
  }
}

export default CustomersService;
