import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Importación de Rutas.
 */
import default_Route from './routes/default_Route';

/**
 * Translate Import
 */
import texts from './texts/texts';

class App {
    /**
     * Constructor del API.
     */
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    /**
     * Configuraciónes varias del Server.
     */
    private config(): void {
        this.app.set('port', process.env.SV_PORT || 3000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(helmet());

        // Configuraciones CORS para uso de Whitelist
        const whiteList = [process.env.CR_DOMAIN_1];
        var corsOptions = {
            origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
                if (whiteList.indexOf(origin) !== -1 || !origin) {
                    callback(null, true)
                } else {
                    callback(new Error(texts.app.not_allowed_by_cors))
                }
            },
            methods: "GET, POST HEAD, PUT, PATCH ,DELETE",
            preflightContinue: false,
        }
        this.app.use(cors(corsOptions));
    }

    /**
     * Available Routes API.
     */
    private routes(): void {
        /**
         * Public Routes.
         */
        this.app.use('/api/v1', default_Route);

        /**
         * Protected Routes.
         */

        /**
         * Not Finded Route.
         */
        this.app.use((req, res) => {
            res.status(404).json({
                error: true,
                error_message: texts.app.not_finded_route,
                info_route: process.env.SV_URL + '/api/v1'
            });
        });
    }
}

export default new App().app;