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
class CategoriesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getCategories', validate_token_1.default, categories_Controller_1.categoriesController.getCategories);
        this.router.post('/addCategory', validate_token_1.default, validate_admin_1.default, categories_Controller_1.categoriesController.addCategory);
        this.router.put('/modifyCategory', validate_token_1.default, validate_admin_1.default, categories_Controller_1.categoriesController.modifyCategory);
    }
}
const categoriesRouter = new CategoriesRouter();
exports.default = categoriesRouter.router;
