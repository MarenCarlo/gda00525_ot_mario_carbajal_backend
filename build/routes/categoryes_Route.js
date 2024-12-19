"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_Controller_1 = require("../controllers/categories_Controller");
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
        this.router.post('/addCategory', validate_token_1.default, validate_admin_1.default, validate_superUser_1.default, categories_Controller_1.categoriesController.addCategory);
    }
}
const rolesRouter = new RolesRouter();
exports.default = rolesRouter.router;
