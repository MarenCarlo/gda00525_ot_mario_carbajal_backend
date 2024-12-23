"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_Controller_1 = require("../controllers/roles_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_admin_1 = __importDefault(require("../middlewares/validate_admin"));
const validate_superUser_1 = __importDefault(require("../middlewares/validate_superUser"));
class RolesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getRoles', validate_token_1.default, validate_admin_1.default, roles_Controller_1.rolesController.getRoles);
        this.router.put('/modifyRole', validate_token_1.default, validate_admin_1.default, validate_superUser_1.default, roles_Controller_1.rolesController.modifyRole);
    }
}
const rolesRouter = new RolesRouter();
exports.default = rolesRouter.router;
