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
exports.enterprisesController = void 0;
const enterpriseController_joi_1 = require("../shared/joiDataValidations/enterpriseController_joi");
const connection_1 = __importDefault(require("../database/connection"));
const tb_empresas_1 = __importDefault(require("../models/tb_empresas"));
class EnterprisesController {
    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    addEnterprise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { razon_social, nombre_comercial, nit, telefono, email } = req.body;
            const { error } = enterpriseController_joi_1.enterpriseSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                /**
                 * Ejecucion del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query('EXEC sp_Crear_Empresa :razon_social, :nombre_comercial, :nit, :telefono, :email', {
                    replacements: {
                        razon_social,
                        nombre_comercial,
                        nit,
                        telefono,
                        email
                    }
                });
                /**
                 * Respuesta del servidor
                 */
                const nuevoID = result[0].NuevoID;
                return res.status(201).json({
                    error: false,
                    message: 'Empresa agregada exitosamente.',
                    data: { nuevoID },
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
                            message: `${conflictingValue} ya existe en BD.`,
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
        });
    }
    /**
     * Este Endpoint sirve para editar la data de empresas en la APP
     */
    modifyEnterprise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idEmpresa, razon_social = null, nombre_comercial = null, nit = null, telefono = null, email = null } = req.body;
            // Validacion si idEmpresa no es un número o es <= 0
            if (typeof idEmpresa === 'number' && !isNaN(idEmpresa) && idEmpresa > 0) {
                //Validacion de Data ingresada por los usuarios
                const { error } = enterpriseController_joi_1.enterpriseOptionalSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia de la Empresa
                    let empresa = yield tb_empresas_1.default.findOne({
                        where: {
                            idEmpresa: idEmpresa
                        },
                    });
                    if (!empresa) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID de Empresa que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // OBJETO DE DATOS MSSQL
                    const replacements = {
                        idEmpresa,
                        razon_social,
                        nombre_comercial,
                        nit,
                        telefono,
                        email
                    };
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Empresa :idEmpresa, :razon_social, :nombre_comercial, :nit, :telefono, :email', {
                        replacements: replacements
                    });
                    /**
                     * Respuesta del Servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Empresa Modificada exitosamente.',
                        data: {},
                    });
                }
                catch (error) {
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
                    message: "Id de Empresa no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.enterprisesController = new EnterprisesController();
