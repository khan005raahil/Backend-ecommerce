import { Router } from 'express';
import * as controller from '../controllers/products.controller';
import validateRequest from '../middlewares/validateRequest';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

const router = Router();

router.post('/', validateRequest(createProductSchema), controller.createProduct);
router.get('/', controller.listProducts);
router.get('/:id', controller.getProduct);
router.put('/:id', validateRequest(updateProductSchema), controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

export default router;
