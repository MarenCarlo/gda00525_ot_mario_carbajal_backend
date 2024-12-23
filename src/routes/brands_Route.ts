import { Router } from 'express';
import { brandsController } from '../controllers/brands_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdmin from '../middlewares/validate_admin';

class BrandsRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/getBrands', validateToken, brandsController.getBrands);
        this.router.post('/addBrand', validateToken, validateAdmin, brandsController.addBrand);
        this.router.put('/modifyBrand', validateToken, validateAdmin, brandsController.modifyBrand);
    }
}

const brandsRouter = new BrandsRouter();
export default brandsRouter.router;