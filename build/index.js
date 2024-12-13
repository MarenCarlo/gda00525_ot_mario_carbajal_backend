"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
class Server {
    start() {
        app_1.default.listen(app_1.default.get('port'), () => {
            console.log('Server URL:', process.env.SV_URL);
            console.log('Server PORT:', process.env.SV_PORT);
        });
    }
}
const server = new Server();
server.start();
