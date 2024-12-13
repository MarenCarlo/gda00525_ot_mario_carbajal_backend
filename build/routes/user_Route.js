"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_Controller_1 = require("../controllers/user_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_admin_1 = __importDefault(require("../middlewares/validate_admin"));
class UserRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/sign_up', validate_token_1.default, validate_admin_1.default, user_Controller_1.userController.signUp);
    }
}
const userRoute = new UserRoute();
exports.default = userRoute.router;
