import { config } from "dotenv";
import { Dialect } from "sequelize";
config();

const parseBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';
const server_state = parseBoolean(process.env.SV_STATE);

export default {
    DB_host: server_state === true ? process.env.DB_HOST_PRO : process.env.DB_HOST_DEV || "localhost",
    DB_dialect: process.env.DB_DIALECT as Dialect || "mssql",
    DB_database: server_state === true ? process.env.DB_DATABASE_PRO! : process.env.DB_DATABASE_DEV!,
    DB_username: process.env.DB_USER || "sa",
    DB_password: process.env.DB_PASSWORD || "",
    DB_port: server_state === true ? Number(process.env.DB_PORT_PRO) : Number(process.env.DB_PORT_DEV) || 1433,
    APP_staging: server_state,
    DB_timezone: process.env.DB_TIMEZONE || "UTC"
}
