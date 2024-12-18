import { Router } from 'express';
import { rolesController } from '../controllers/roles_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdmin from '../middlewares/validate_admin';
import validateSuperUser from '../middlewares/validate_superUser';

class RolesRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.put('/modifyRole', validateToken, validateAdmin, validateSuperUser, rolesController.modifyRole);
    }
}

const rolesRouter = new RolesRouter();
export default rolesRouter.router;