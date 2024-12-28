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
const validate_superUser_1 = __importDefault(require("../middlewares/validate_superUser"));
const validate_adminOrSeller_1 = __importDefault(require("../middlewares/validate_adminOrSeller"));
class ProductsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getProductsPublic/:idProducto?', validate_token_1.default, products_Controller_1.productsController.getProductsPublic);
        this.router.get('/getProductsInternal/:idProducto?', validate_token_1.default, validate_adminOrSeller_1.default, products_Controller_1.productsController.getProductsInternal);
        this.router.post('/addProduct', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.addProduct);
        this.router.put('/modifyProduct', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.modifyProduct);
        this.router.get('/getIngresosStock', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.getIngresosStock);
        this.router.post('/addStockEntry', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.addStockIngreso);
        this.router.put('/modifyStockEntry', validate_token_1.default, validate_admin_1.default, validate_superUser_1.default, products_Controller_1.productsController.modifyStockIngreso);
        this.router.put('/modifyStatusProduct', validate_token_1.default, validate_admin_1.default, products_Controller_1.productsController.modifyStatusProduct);
    }
}
const productsRouter = new ProductsRouter();
exports.default = productsRouter.router;
