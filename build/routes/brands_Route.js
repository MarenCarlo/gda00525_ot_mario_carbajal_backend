"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brands_Controller_1 = require("../controllers/brands_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_admin_1 = __importDefault(require("../middlewares/validate_admin"));
class BrandsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/addBrand', validate_token_1.default, validate_admin_1.default, brands_Controller_1.brandsController.addBrand);
        this.router.put('/modifyBrand', validate_token_1.default, validate_admin_1.default, brands_Controller_1.brandsController.modifyBrand);
    }
}
const brandsRouter = new BrandsRouter();
exports.default = brandsRouter.router;
