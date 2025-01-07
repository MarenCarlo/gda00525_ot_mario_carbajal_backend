"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * Middlewares
 */
const validate_token_1 = __importDefault(require("../middlewares/validate_token"));
const orders_Controller_1 = require("../controllers/orders_Controller");
class OrdersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/getOwnOrders/:idOrden?', validate_token_1.default, orders_Controller_1.ordersController.getOwnOrders);
        this.router.get('/getOrders/:idOrden?', validate_token_1.default, orders_Controller_1.ordersController.getOrders);
        this.router.post('/addOrder', validate_token_1.default, orders_Controller_1.ordersController.addOrder);
        this.router.put('/modifyOrder', validate_token_1.default, orders_Controller_1.ordersController.modifyOrder);
        this.router.delete('/deleteOrderDetail', validate_token_1.default, orders_Controller_1.ordersController.deleteOrderDetail);
        this.router.post('/addOrderDetail', validate_token_1.default, orders_Controller_1.ordersController.addOrderDetail);
    }
}
const ordersRouter = new OrdersRouter();
exports.default = ordersRouter.router;
