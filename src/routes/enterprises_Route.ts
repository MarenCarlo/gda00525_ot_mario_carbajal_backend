import { Router } from 'express';
import { enterprisesController } from '../controllers/enterprises_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdminOrSeller from '../middlewares/validate_adminOrSeller';
import validateAdmin from '../middlewares/validate_admin';

class EnterprisesRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/addEnterprise', validateToken, validateAdminOrSeller, enterprisesController.addEnterprise);
        this.router.put('/modifyEnterprise', validateToken, validateAdmin, enterprisesController.modifyEnterprise);
    }
}

const enterprisesRouter = new EnterprisesRouter();
export default enterprisesRouter.router;