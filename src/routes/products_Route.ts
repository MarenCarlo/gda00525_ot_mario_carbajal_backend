import { Router } from 'express';
import { productsController } from '../controllers/products_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdmin from '../middlewares/validate_admin';
import validateSuperUser from '../middlewares/validate_superUser';
import validateAdminOrSeller from '../middlewares/validate_adminOrSeller';

class ProductsRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/getProductsPublic/:idProducto?', validateToken, productsController.getProductsPublic);
        this.router.get('/getProductsInternal/:idProducto?', validateToken, validateAdminOrSeller, productsController.getProductsInternal);
        this.router.post('/addProduct', validateToken, validateAdmin, productsController.addProduct);
        this.router.put('/modifyProduct', validateToken, validateAdmin, productsController.modifyProduct);
        this.router.get('/getIngresosStock', validateToken, validateAdmin, productsController.getIngresosStock);
        this.router.post('/addStockEntry', validateToken, validateAdmin, productsController.addStockIngreso);
        this.router.put('/modifyStockEntry', validateToken, validateAdmin, validateSuperUser, productsController.modifyStockIngreso);
        this.router.put('/modifyStatusProduct', validateToken, validateAdmin, validateSuperUser, productsController.modifyStatusProduct);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.router;