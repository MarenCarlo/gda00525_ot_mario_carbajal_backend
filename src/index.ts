import app from './app';
import { testConnection } from './database/connection';

class Server {
    start(): void {
        app.listen(app.get('port'), () => {
            testConnection();
            console.log('Server URL:', process.env.SV_URL);
            console.log('Server PORT:', process.env.SV_PORT);
        });
    }
}

const server = new Server();
server.start();