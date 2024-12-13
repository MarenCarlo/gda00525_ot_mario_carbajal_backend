import { Router } from 'express';
import { defaultController } from '../controllers/default_Controller';

class DefaultRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', defaultController.default);
    }

}

const defaultRoute = new DefaultRoute();
export default defaultRoute.router;