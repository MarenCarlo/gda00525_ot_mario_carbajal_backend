import { Router } from 'express';
import { usersController } from '../controllers/users_Controller';

/**
 * Middlewares
 */
import validateToken from '../middlewares/validate_token';
import validateAdminOrSeller from '../middlewares/validate_adminOrSeller';
import validateAdmin from '../middlewares/validate_admin';

class UsersRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/getUsers/:idUsuario?', validateToken, validateAdminOrSeller, usersController.getUsers);
        this.router.post('/SignUp', validateToken, validateAdminOrSeller, usersController.addUser);
        this.router.put('/modifyUser', validateToken, validateAdmin, usersController.modifyUser);
    }
}

const usersRouter = new UsersRouter();
export default usersRouter.router;