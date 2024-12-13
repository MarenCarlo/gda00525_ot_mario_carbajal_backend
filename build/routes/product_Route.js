"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_Controller_1 = require("../controllers/product_Controller");
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
class DefaultRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/products_list', validate_token_1.default, product_Controller_1.productController.getProductsList);
    }
}
const defaultRoute = new DefaultRoute();
exports.default = defaultRoute.router;
