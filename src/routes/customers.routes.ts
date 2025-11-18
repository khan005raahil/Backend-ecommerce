// src/routes/customers.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/customers.controller';

const router = Router();

// CRUD for customers
router.post('/', controller.createCustomer);
router.get('/', controller.listCustomers);
router.get('/:id', controller.getCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

export default router;
