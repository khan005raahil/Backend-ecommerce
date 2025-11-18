// src/services/orders.service.ts
import OrdersRepo from '../repositories/orders.repo';
import CustomersRepo from '../repositories/customers.repo';
import ProductsRepo from '../repositories/products.repo';
import EmailService from './email.service';

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type OrderItemDetailed = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderSaved = {
  id: string;
  customerId: string;
  orderItems: OrderItemDetailed[];
  shipping?: any;
  shippingCost?: number;
  paymentMethod?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
};

export type OrderSummaryForEmail = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemDetailed[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: string;
};

export class OrdersService {
  /**
   * Create an order, save to DB, then send confirmation email (non-blocking)
   */
  static async createOrder(
    customerId: string,
    items: OrderItemInput[],
    shipping: any,
    paymentMethod: string
  ): Promise<OrderSaved> {
    // 1) Get customer details
    const customer = await CustomersRepo.getById(customerId);
    if (!customer) throw new Error('Customer not found');

    // cast customer to any to access flexible fields safely
    const c: any = customer;

    // 2) Build detailed items
    const orderItemsDetailed: OrderItemDetailed[] = await Promise.all(
      items.map(async (it) => {
        const p = await ProductsRepo.getById(it.productId);
        const pAny: any = p;
        const unitPrice = (pAny && typeof pAny.price === 'number') ? pAny.price : 0;
        const quantity = it.quantity || 1;
        const lineTotal = unitPrice * quantity;

        return {
          productId: it.productId,
          name: (pAny && pAny.name) ? pAny.name : 'Unknown product',
          quantity,
          unitPrice,
          lineTotal,
        };
      })
    );

    // 3) Compute totals
    const subtotal = orderItemsDetailed.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = Number((subtotal * 0.05).toFixed(2));
    const shippingCost = shipping?.cost || 0;
    const total = Number((subtotal + tax + shippingCost).toFixed(2));

    // 4) Prepare order object (note: shipping object kept separately from shippingCost)
    const orderToSave = {
      customerId,
      orderItems: orderItemsDetailed,
      shipping, // full shipping object (address, etc.)
      shippingCost, // numeric shipping cost
      paymentMethod,
      subtotal,
      tax,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5) Save - cast to OrderSaved (repo may return a plain object)
    const saved = (await OrdersRepo.create(orderToSave)) as OrderSaved;

    // 6) Email summary - use c (any) to avoid missing-property TS errors
    const customerName =
      c.name ||
      `${(c.firstName || '')} ${(c.lastName || '')}`.trim() ||
      'Customer';

    const customerEmail = c.email || 'noreply@example.com';

    const orderSummary: OrderSummaryForEmail = {
      id: saved.id,
      customerName,
      customerEmail,
      items: orderItemsDetailed,
      subtotal,
      tax,
      shippingCost,
      total,
      status: saved.status || 'processing',
    };

    // 7) Send confirmation email (non-blocking). Cast EmailService to any if typings missing.
    (EmailService as any).sendOrderConfirmation(orderSummary).catch((err: any) => {
      console.error('Email send failed for order', saved.id, err);
    });

    return saved;
  }

  /**
   * Update status of an order + send email notification
   */
  static async updateOrderStatus(orderId: string, newStatus: string): Promise<OrderSaved> {
    const updated = (await OrdersRepo.update(orderId, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    })) as OrderSaved | null;

    if (!updated) throw new Error('Order not found');

    const customer = await CustomersRepo.getById(updated.customerId);
    const c: any = customer;

    const orderSummary: OrderSummaryForEmail = {
      id: updated.id,
      customerName: c?.name || 'Customer',
      customerEmail: c?.email || 'noreply@example.com',
      items: (updated.orderItems as OrderItemDetailed[]) || [],
      subtotal: updated.subtotal || 0,
      tax: updated.tax || 0,
      shippingCost: updated.shippingCost || 0,
      total: updated.total || 0,
      status: newStatus,
    };

    (EmailService as any).sendOrderStatusUpdate(orderSummary).catch((err: any) => {
      console.error('Email status update failed for order', orderSummary.id, err);
    });

    return updated;
  }

  /**
   * List all orders with optional query filters
   */
  static async listOrders(query: any = {}): Promise<OrderSaved[]> {
    const list = await OrdersRepo.list(query);
    return (list as any) as OrderSaved[];
  }

  /**
   * Get a single order by ID
   */
  static async getOrder(id: string): Promise<OrderSaved | null> {
    const order = await OrdersRepo.getById(id);
    return (order as any) || null;
  }
}

export default OrdersService;
