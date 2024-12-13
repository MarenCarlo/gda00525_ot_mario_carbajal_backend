"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_Controller_1 = require("../controllers/auth_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_admin_1 = __importDefault(require("../middlewares/validate_admin"));
class AuthRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/login', auth_Controller_1.authController.logIn);
        this.router.post('/get_temporal_token', validate_token_1.default, validate_admin_1.default, auth_Controller_1.authController.get_temporal_token);
    }
}
const authRoute = new AuthRoute();
exports.default = authRoute.router;
