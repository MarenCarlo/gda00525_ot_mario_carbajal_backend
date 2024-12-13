import app from './app';

class Server {
    start(): void {
        app.listen(app.get('port'), () => {
            console.log('Server URL:', process.env.SV_URL);
            console.log('Server PORT:', process.env.SV_PORT);
        });
    }
}

const server = new Server();
server.start();