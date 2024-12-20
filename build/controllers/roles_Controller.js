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
class RolesController {
    /**
     * Este Endpoint sirve para editar la data de los roles de la APP
     */
    modifyRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idRol, rol = null, descripcion = null } = req.body;
            // Validacion si idRol no es un número o es <= 0
            if (typeof idRol === 'number' && !isNaN(idRol) && idRol > 0) {
                //Validacion de Data ingresada por los usuarios
                const { error } = roleController_joi_1.roleOptionalSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia de la Empresa
                    let empresa = yield tb_roles_1.default.findOne({
                        where: {
                            idRol: idRol
                        },
                    });
                    if (!empresa) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID del Rol que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // OBJETO DE DATOS MSSQL
                    const replacements = {
                        idRol,
                        rol,
                        descripcion
                    };
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Rol :idRol, :rol, :descripcion', {
                        replacements: replacements
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
                    /**
                     * Condiciones de Datos Duplicados en restricciones de
                     * UNIQUE
                     */
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        const uniqueError = error.errors[0];
                        const conflictingValue = uniqueError === null || uniqueError === void 0 ? void 0 : uniqueError.value;
                        if (uniqueError === null || uniqueError === void 0 ? void 0 : uniqueError.message.includes('must be unique')) {
                            return res.status(409).json({
                                error: true,
                                message: `${conflictingValue} ya existe en DB.`,
                                data: {}
                            });
                        }
                    }
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
