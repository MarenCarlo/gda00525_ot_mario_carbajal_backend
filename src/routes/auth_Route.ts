import { Router } from 'express';
import { authController } from '../controllers/auth_Controller';

class AuthRouter {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/LogIn', authController.authUser);
    }
}

const authRouter = new AuthRouter();
export default authRouter.router;