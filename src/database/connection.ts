import { Sequelize } from 'sequelize';
import config from '../config';
import texts from '../texts/texts';

const sequelize = new Sequelize(config.DB_database, config.DB_username, config.DB_password, {
    host: config.DB_host,
    dialect: config.DB_dialect,
    port: config.DB_port,
    logging: false
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`${texts.sequelize.connection_success}`);
        console.table({
            'dialect': config.DB_dialect,
            'host': config.DB_host,
            'port': config.DB_port,
            'database': config.DB_database,
            'staging': config.APP_staging === true ? 'production' : 'development'
        });
    } catch (error) {
        console.error(`${texts.sequelize.connection_failed}`, error);
    }
};