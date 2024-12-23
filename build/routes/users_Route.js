"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_Controller_1 = require("../controllers/users_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_adminOrSeller_1 = __importDefault(require("../middlewares/validate_adminOrSeller"));
const validate_admin_1 = __importDefault(require("../middlewares/validate_admin"));
class UsersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getUsers/:idUsuario?', validate_token_1.default, validate_adminOrSeller_1.default, users_Controller_1.usersController.getUsers);
        this.router.post('/SignUp', validate_token_1.default, validate_adminOrSeller_1.default, users_Controller_1.usersController.addUser);
        this.router.put('/modifyUser', validate_token_1.default, validate_admin_1.default, users_Controller_1.usersController.modifyUser);
    }
}
const usersRouter = new UsersRouter();
exports.default = usersRouter.router;
