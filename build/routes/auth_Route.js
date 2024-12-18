"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_Controller_1 = require("../controllers/auth_Controller");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/LogIn', auth_Controller_1.authController.authUser);
    }
}
const authRouter = new AuthRouter();
exports.default = authRouter.router;
