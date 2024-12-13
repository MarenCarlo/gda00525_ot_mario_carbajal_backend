"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Importación de Rutas.
 */
const default_Route_1 = __importDefault(require("./routes/default_Route"));
/**
 * Translate Import
 */
const texts_1 = __importDefault(require("./texts/texts"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    /**
     * Configuraciónes varias del Server.
     */
    config() {
        this.app.set('port', process.env.SV_PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, helmet_1.default)());
        // Configuraciones CORS para uso de Whitelist
        const whiteList = [process.env.CR_DOMAIN_1];
        var corsOptions = {
            origin: function (origin, callback) {
                if (whiteList.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                }
                else {
                    callback(new Error(texts_1.default.app.not_allowed_by_cors));
                }
            },
            methods: "GET, POST HEAD, PUT, PATCH ,DELETE",
            preflightContinue: false,
        };
        this.app.use((0, cors_1.default)(corsOptions));
    }
    /**
     * Available Routes API.
     */
    routes() {
        /**
         * Public Routes.
         */
        this.app.use('/api/v1', default_Route_1.default);
        /**
         * Protected Routes.
         */
        /**
         * Not Finded Route.
         */
        this.app.use((req, res) => {
            res.status(404).json({
                error: true,
                error_message: texts_1.default.app.not_finded_route,
                info_route: process.env.SV_URL + '/api/v1'
            });
        });
    }
}
exports.default = new App().app;
