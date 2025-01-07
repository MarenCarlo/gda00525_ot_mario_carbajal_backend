"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authController_joi_1 = __importDefault(require("../shared/joiDataValidations/authController_joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const tb_usuarios_1 = __importDefault(require("../models/tb_usuarios"));
const tb_empresas_1 = __importDefault(require("../models/tb_empresas"));
const tb_roles_1 = __importDefault(require("../models/tb_roles"));
(0, dotenv_1.config)();
class AuthController {
    /**
    * Este Endpoint sirve para iniciar un nuevo token de sesión en la APP
    */
    authUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { username, passphrase } = req.body;
            /**
             * Validacion de Data de Formularios
             */
            const { error } = authController_joi_1.default.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                /**
                 * Busqueda de Usuario por Username o Email
                 */
                const findUser = (condition) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield tb_usuarios_1.default.findOne({
                        where: condition,
                        include: [
                            {
                                model: tb_roles_1.default,
                                as: 'rol',
                                attributes: ['idRol', 'nombre'],
                            },
                            {
                                model: tb_empresas_1.default,
                                as: 'empresa',
                                attributes: ['idEmpresa', 'nombre_comercial'],
                            }
                        ]
                    });
                    return result ? result.toJSON() : null;
                });
                // Intentar búsqueda por username o email
                let user = yield findUser({ username: username });
                if (!user)
                    user = yield findUser({ email: username });
                // Validar si no se encontró usuario
                if (!user) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontró ningún usuario con ese Username o Email.',
                        data: {}
                    });
                }
                /**
                 * Validacion de usuario activo
                 */
                if (!user.isActive) {
                    return res.status(401).json({
                        error: true,
                        message: 'Este usuario ha sido desactivado por un administrador',
                        data: {}
                    });
                }
                /**
                 * Validacion de Hash de contraseña
                 */
                const validPassword = bcrypt_1.default.compareSync(passphrase, user.passphrase);
                if (!validPassword) {
                    return res.status(401).json({
                        error: true,
                        message: 'Contraseña incorrecta.',
                        data: {}
                    });
                }
                if (!process.env.TOKEN_SECRET) {
                    console.error('Secret Sign no esta definido en las variables de entorno');
                    throw new Error('Secret Sign no esta definido en las variables de entorno');
                }
                /**
                 * Construccion de JWT
                 */
                const token = jsonwebtoken_1.default.sign({
                    idUsuario: user.idUsuario,
                    username: user.username,
                    nombreUsuario: user.nombre_completo,
                    isSuperUser: user.isSuperUser,
                    isActive: user.isActive,
                    rol: user.rol,
                    empresa: user.empresa
                }, process.env.TOKEN_SECRET, {
                    expiresIn: '24h'
                });
                /**
                 * Objeto de Inicio de Sesion
                 */
                return res.status(202).header('auth-token', token).json({
                    error: false,
                    message: 'Sesión iniciada.',
                    data: {
                        'authToken': token,
                        'userData': {
                            idUsuario: user.idUsuario,
                            username: user.username,
                            nombreUsuario: user.nombre_completo,
                            isActive: user.isActive,
                            rol: user.rol,
                            empresa: user.empresa
                        }
                    },
                });
            }
            catch (error) {
                /**
                 * Manejo de Errores generales de la BD.
                 */
                return res.status(500).json({
                    error: true,
                    message: 'Hay problemas al procesar la solicitud.',
                    data: {
                        error
                    }
                });
            }
        });
    }
}
exports.authController = new AuthController();
