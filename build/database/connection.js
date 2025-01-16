"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const sequelize = new sequelize_1.Sequelize(config_1.default.DB_database, config_1.default.DB_username, config_1.default.DB_password, {
    host: config_1.default.DB_host,
    dialect: config_1.default.DB_dialect,
    port: config_1.default.DB_port,
    timezone: config_1.default.DB_timezone,
    logging: false
});
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Conectado Exitosamente a BD');
        console.table({
            'dialect': config_1.default.DB_dialect,
            'host': config_1.default.DB_host,
            'port': config_1.default.DB_port,
            'database': config_1.default.DB_database,
            'user': config_1.default.DB_username,
            'timezone': config_1.default.DB_timezone,
            'staging': config_1.default.APP_staging === true ? 'production' : 'development'
        });
    }
    catch (error) {
        console.error('Conexión Fallida a BD: ', error);
        console.table({
            'dialect': config_1.default.DB_dialect,
            'host': config_1.default.DB_host,
            'port': config_1.default.DB_port,
            'database': config_1.default.DB_database,
            'user': config_1.default.DB_username,
            'timezone': config_1.default.DB_timezone,
            'staging': config_1.default.APP_staging === true ? 'production' : 'development'
        });
    }
});
exports.testConnection = testConnection;
exports.default = sequelize;
