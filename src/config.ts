import { config } from "dotenv";
config();

const parseBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';
const server_state = parseBoolean(process.env.SV_STATE);

export default {
    DB_host: process.env.DB_HOST || "127.0.0.1",
    DB_database: server_state === true ? process.env.DB_DATABASE_PRO : process.env.DB_DATABASE_DEV,
    DB_port: Number(process.env.DB_PORT) || 3006,
    DB_user: process.env.DB_USER || "root",
    DB_password: process.env.DB_PASSWORD || "",
    DB_timezone: server_state === true ? process.env.DB_TIMEZONE_PRO : process.env.DB_TIMEZONE_DEV || "UTC+0"
}
