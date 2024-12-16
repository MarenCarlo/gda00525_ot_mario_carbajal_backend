"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const parseBoolean = (value) => (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'true';
const server_state = parseBoolean(process.env.SV_STATE);
exports.default = {
    DB_host: server_state === true ? process.env.DB_HOST_PRO : process.env.DB_HOST_DEV || "localhost",
    DB_dialect: process.env.DB_DIALECT || "mssql",
    DB_database: server_state === true ? process.env.DB_DATABASE_PRO : process.env.DB_DATABASE_DEV,
    DB_username: process.env.DB_USER || "sa",
    DB_password: process.env.DB_PASSWORD || "",
    DB_port: server_state === true ? Number(process.env.DB_PORT_PRO) : Number(process.env.DB_PORT_DEV) || 1433,
    APP_staging: server_state
};
