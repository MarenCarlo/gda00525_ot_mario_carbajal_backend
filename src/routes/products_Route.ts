import { Router } from 'express';
import { productsController } from '../controllers/products_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdmin from '../middlewares/validate_admin';

class CategoriesRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/addProduct', validateToken, validateAdmin, productsController.addProduct);
    }
}

const categoriesRouter = new CategoriesRouter();
export default categoriesRouter.router;