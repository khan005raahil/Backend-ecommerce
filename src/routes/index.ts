import { Router } from 'express';
import productsRoutes from './products.routes';
// import ordersRoutes from './orders.routes';
// import customersRoutes from './customers.routes';

const router = Router();
router.use('/products', productsRoutes);
// router.use('/orders', ordersRoutes);
// router.use('/customers', customersRoutes);

export default router;
