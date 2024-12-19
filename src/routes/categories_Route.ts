import { Router } from 'express';
import { categoriesController } from '../controllers/categories_Controller';

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
        this.router.post('/addCategory', validateToken, validateAdmin, categoriesController.addCategory);
        this.router.put('/modifyCategory', validateToken, validateAdmin, categoriesController.modifyCategory);
    }
}

const categoriesRouter = new CategoriesRouter();
export default categoriesRouter.router;