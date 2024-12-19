"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_Controller_1 = require("../controllers/products_Controller");
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
        this.router.post('/addProduct', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.addProduct);
    }
}
const categoriesRouter = new CategoriesRouter();
exports.default = categoriesRouter.router;
