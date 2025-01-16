import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.DB_database, config.DB_username, config.DB_password, {
    host: config.DB_host,
    dialect: config.DB_dialect,
    port: config.DB_port,
    timezone: config.DB_timezone,
    logging: false
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado Exitosamente a BD');
        console.table({
            'dialect': config.DB_dialect,
            'host': config.DB_host,
            'port': config.DB_port,
            'database': config.DB_database,
            'user': config.DB_username,
            'timezone': config.DB_timezone,
            'staging': config.APP_staging === true ? 'production' : 'development'
        });
    } catch (error) {
        console.error('Conexión Fallida a BD: ', error);
        console.table({
            'dialect': config.DB_dialect,
            'host': config.DB_host,
            'port': config.DB_port,
            'database': config.DB_database,
            'user': config.DB_username,
            'timezone': config.DB_timezone,
            'staging': config.APP_staging === true ? 'production' : 'development'
        });
    }
};

export default sequelize;