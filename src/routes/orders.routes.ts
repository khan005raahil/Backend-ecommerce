// src/routes/orders.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/orders.controller';
import validateRequest from '../middlewares/validateRequest'; 

const router = Router();

router.post('/', controller.createOrder);
router.get('/', controller.listOrders); // optional
router.get('/:id', controller.getOrder); // optional
router.put('/:id/status', controller.updateOrderStatus); // update only status


export default router;
