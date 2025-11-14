import { Request, Response, NextFunction } from 'express';
import ProductsService from '../services/products.service';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductsService.listProducts(req.query);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await ProductsService.getProduct(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ProductsService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductsService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
