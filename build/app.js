"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Importación de Rutas.
 */
const default_Route_1 = __importDefault(require("./routes/default_Route"));
const users_Route_1 = __importDefault(require("./routes/users_Route"));
const auth_Route_1 = __importDefault(require("./routes/auth_Route"));
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
        this.app.use((0, morgan_1.default)('dev'));
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
                    callback(new Error("Esta IP no es permitida"));
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
        this.app.use('/api/v1', auth_Route_1.default);
        /**
         * Protected Routes.
         */
        this.app.use('/api/v1/users', users_Route_1.default);
        /**
         * Not Finded Route.
         */
        this.app.use((req, res) => {
            res.status(404).json({
                error: true,
                error_message: 'Ruta no encontrada',
                info_route: process.env.SV_URL + '/api/v1'
            });
        });
    }
}
exports.default = new App().app;
