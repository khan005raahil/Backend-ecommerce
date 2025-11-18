import { Request, Response, NextFunction } from 'express';
import CustomersService from '../services/customers.service';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await CustomersService.createCustomer(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const listCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query || {};
    const list = await CustomersService.listCustomers(q);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await CustomersService.getCustomer(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await CustomersService.updateCustomer(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CustomersService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
