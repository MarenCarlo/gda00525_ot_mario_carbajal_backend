import { Router } from 'express';
import { productsController } from '../controllers/products_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import { ordersController } from '../controllers/orders_Controller';
import validateAdminOrSeller from '../middlewares/validate_adminOrSeller';

class OrdersRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/addOrder', validateToken, ordersController.addOrder);
        this.router.put('/modifyOrder', validateToken, validateAdminOrSeller, ordersController.modifyOrder);
        this.router.delete('/deleteOrderDetail', validateToken, ordersController.deleteOrderDetail);
        this.router.post('/addOrderDetail', validateToken, ordersController.addOrderDetail);
    }
}

const ordersRouter = new OrdersRouter();
export default ordersRouter.router;