import { Router } from 'express';
import { enterprisesController } from '../controllers/enterprises_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdminOrSeller from '../middlewares/validate_adminOrSeller';

class EnterprisesRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/getEnterprises/:idEmpresa?', validateToken, enterprisesController.getEnterprises);
        this.router.post('/addEnterprise', validateToken, enterprisesController.addEnterprise);
        this.router.put('/modifyEnterprise', validateToken, validateAdminOrSeller, enterprisesController.modifyEnterprise);
    }
}

const enterprisesRouter = new EnterprisesRouter();
export default enterprisesRouter.router;