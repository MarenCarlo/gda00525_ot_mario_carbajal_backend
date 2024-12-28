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
exports.rolesController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const tb_roles_1 = __importDefault(require("../models/tb_roles"));
const roleController_joi_1 = require("../shared/joiDataValidations/roleController_joi");
const handleDatabaseError_1 = require("../shared/handleDatabaseError");
const inputTypesValidations_1 = require("../shared/inputTypesValidations");
const formatText_1 = require("../shared/formatText");
class RolesController {
    getRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            try {
                const roles = yield tb_roles_1.default.findAll({
                    attributes: ['idRol', 'nombre', 'descripcion'],
                });
                if (roles.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron roles.',
                        data: []
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Roles obtenidos exitosamente.',
                    data: roles
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para editar la data de los roles de la APP
     */
    modifyRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idRol, nombre = null, descripcion = null } = req.body || {};
            let nombreFormatted = nombre;
            if (nombreFormatted !== null) {
                nombreFormatted = (0, formatText_1.formatText)(nombre);
            }
            if ((0, inputTypesValidations_1.isValidNumber)(idRol)) {
                const { error } = roleController_joi_1.roleOptionalSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia del rol
                    let rolDB = yield tb_roles_1.default.findOne({
                        where: {
                            idRol: idRol
                        },
                    });
                    if (!rolDB) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID del Rol que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Rol :idRol, :nombre, :descripcion', {
                        replacements: {
                            idRol,
                            nombre,
                            descripcion
                        }
                    });
                    /**
                     * Respuesta del Servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Rol Modificada exitosamente.',
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
                    message: "Id de Rol no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.rolesController = new RolesController();
