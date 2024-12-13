"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const config_1 = __importDefault(require("../config"));
const connection = promise_mysql_1.default.createConnection({
    host: config_1.default.DB_host,
    port: config_1.default.DB_port,
    database: config_1.default.DB_database,
    user: config_1.default.DB_user,
    password: config_1.default.DB_password,
    timezone: config_1.default.DB_timezone
});
connection.catch((err) => {
    console.error('Database connection error:', err);
});
const getConnection = () => {
    return connection;
};
exports.default = getConnection;
