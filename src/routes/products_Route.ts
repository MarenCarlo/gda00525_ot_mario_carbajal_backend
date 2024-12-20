import { Router } from 'express';
import { productsController } from '../controllers/products_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdmin from '../middlewares/validate_admin';
import validateSuperUser from '../middlewares/validate_superUser';

class ProductsRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/addProduct', validateToken, validateAdmin, productsController.addProduct);
        this.router.put('/modifyProduct', validateToken, validateAdmin, productsController.modifyProduct);
        this.router.post('/addStockEntry', validateToken, validateAdmin, productsController.addStockIngreso);
        this.router.put('/modifyStockEntry', validateToken, validateAdmin, validateSuperUser, productsController.modifyStockIngreso);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.router;