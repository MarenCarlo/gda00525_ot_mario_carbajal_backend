"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enterprises_Controller_1 = require("../controllers/enterprises_Controller");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const validate_adminOrSeller_1 = __importDefault(require("../middlewares/validate_adminOrSeller"));
class EnterprisesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getEnterprises/:idEmpresa?', validate_token_1.default, enterprises_Controller_1.enterprisesController.getEnterprises);
        this.router.post('/addEnterprise', validate_token_1.default, enterprises_Controller_1.enterprisesController.addEnterprise);
        this.router.put('/modifyEnterprise', validate_token_1.default, validate_adminOrSeller_1.default, enterprises_Controller_1.enterprisesController.modifyEnterprise);
    }
}
const enterprisesRouter = new EnterprisesRouter();
exports.default = enterprisesRouter.router;
