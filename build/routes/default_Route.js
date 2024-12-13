"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const default_Controller_1 = require("../controllers/default_Controller");
class DefaultRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', default_Controller_1.defaultController.default);
    }
}
const defaultRoute = new DefaultRoute();
exports.default = defaultRoute.router;
