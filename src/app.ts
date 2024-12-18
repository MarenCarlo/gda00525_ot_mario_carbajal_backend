import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Importación de Rutas.
 */
import default_Route from './routes/default_Route';
import usersRouter from './routes/users_Route';
import authRouter from './routes/auth_Route';

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
        this.app.use(morgan('dev'));
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
                    callback(new Error("Esta IP no es permitida"))
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
        this.app.use('/api/v1', authRouter);

        /**
         * Protected Routes.
         */
        this.app.use('/api/v1/users', usersRouter);

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

export default new App().app;