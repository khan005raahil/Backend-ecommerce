import { Request, Response, NextFunction } from 'express';
import OrdersService from '../services/orders.service';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerId, items, shipping, paymentMethod } = req.body;
    const order = await OrdersService.createOrder(customerId, items, shipping, paymentMethod);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}


export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query || {};
    const orders = await OrdersService.listOrders(q);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrdersService.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await OrdersService.updateOrderStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
