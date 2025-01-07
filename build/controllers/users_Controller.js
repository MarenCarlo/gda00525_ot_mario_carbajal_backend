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
exports.usersController = void 0;
const userController_joi_1 = require("../shared/joiDataValidations/userController_joi");
const connection_1 = __importDefault(require("../database/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tb_usuarios_1 = __importDefault(require("../models/tb_usuarios"));
const inputTypesValidations_1 = require("../shared/inputTypesValidations");
const handleDatabaseError_1 = require("../shared/handleDatabaseError");
class UsersController {
    /**
    * Este Endpoint sirve para obtener usuarios o uno solo
    */
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idUsuario } = req.params;
            let idUsuarioParsed = Number(idUsuario);
            try {
                let query = 'SELECT * FROM vw_Usuarios';
                if (idUsuario) {
                    if ((0, inputTypesValidations_1.isValidNumber)(idUsuarioParsed)) {
                        query += ` WHERE idUsuario = ${Number(idUsuario)}`;
                    }
                    else {
                        return res.status(400).json({
                            error: true,
                            message: 'El ID de usuario no es válido.',
                            data: {}
                        });
                    }
                }
                const usuarios = yield connection_1.default.query(query, {
                    type: 'SELECT'
                });
                if (!usuarios) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron usuarios.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Usuarios obtenidos exitosamente.',
                    data: usuarios
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
    * Este Endpoint sirve para registrar a nuevos usuarios en la APP
    */
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { nombre_completo, username, passphrase, repeat_passphrase, telefono, email, direccion, fecha_nacimiento, rol_idRol, empresa_idEmpresa, isSuperUser = 0, isActive = 1, } = req.body || {};
            const { error } = userController_joi_1.userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                /**
                 * Encriptación de Contraseñas de Usuarios
                 */
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPass = yield bcrypt_1.default.hash(passphrase, salt);
                /**
                 * Ejecucion del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query('EXEC sp_Crear_Usuario :nombre_completo, :username, :passphrase, :telefono, :email, :direccion, :fecha_nacimiento, :isSuperUser, :isActive, :rol_idRol, :empresa_idEmpresa', {
                    replacements: {
                        nombre_completo,
                        username,
                        passphrase: hashedPass,
                        telefono,
                        email,
                        direccion,
                        fecha_nacimiento,
                        isSuperUser,
                        isActive,
                        rol_idRol,
                        empresa_idEmpresa,
                    }
                });
                /**
                 * Respuesta del servidor
                 */
                const nuevoID = result[0][0].NuevoID;
                return res.status(201).json({
                    error: false,
                    message: 'Usuario agregado exitosamente.',
                    data: { nuevoID },
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para editar data de usuarios registrados en la APP
     */
    modifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idUsuario, newStateValue = null, nombre_completo = null, username = null, passphrase = null, telefono = null, email = null, direccion = null, fecha_nacimiento = null, rol_idRol = null, empresa_idEmpresa = null } = req.body || {};
            const user = req.user;
            // Validacion si idUsuario no es un número o es <= 0
            if ((0, inputTypesValidations_1.isValidNumber)(idUsuario)) {
                const { error } = userController_joi_1.userStateSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                // Validación de si el idUsuario es igual al usuario en sesión PARA CASOS DE INTENTO DE DESACTIVACION DEL PROPIO USUARIO
                if (newStateValue !== undefined && newStateValue !== null && idUsuario === user.idUsuario) {
                    return res.status(404).json({
                        error: true,
                        message: "No se puede cambiar el estado del usuario de la sesión",
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia del Usuario
                    let user = yield tb_usuarios_1.default.findOne({
                        where: {
                            idUsuario: idUsuario
                        },
                    });
                    if (!user) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID de Usuario que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // Verificación de si el usuario es un superusuario activo PARA CASOS DE INTENTO DE DESACTIVACION DE SUPER USUARIO
                    if (newStateValue !== undefined && newStateValue !== null && user.isSuperUser === true && user.isActive === true) {
                        return res.status(403).json({
                            error: true,
                            message: "No se puede desactivar a un super usuario",
                            data: {}
                        });
                    }
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Usuario :idUsuario, :nombre_completo, :username, :passphrase, :telefono, :email, :direccion, :fecha_nacimiento, :isSuperUser, :isActive, :rol_idRol, :empresa_idEmpresa;', {
                        replacements: {
                            idUsuario: idUsuario,
                            nombre_completo: nombre_completo,
                            username: username,
                            passphrase: null,
                            telefono: telefono,
                            email: email,
                            direccion: direccion,
                            fecha_nacimiento: fecha_nacimiento,
                            isSuperUser: null,
                            isActive: newStateValue,
                            rol_idRol: rol_idRol,
                            empresa_idEmpresa: empresa_idEmpresa
                        }
                    });
                    /**
                     * Respuesta del Servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Usuario Modificada exitosamente.',
                        data: {},
                    });
                }
                catch (error) {
                    return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
                }
            }
            else {
                return res.status(404).json({
                    error: true,
                    message: "Id de Usuario no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.usersController = new UsersController();
