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
exports.brandsController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const brandController_joi_1 = require("../shared/joiDataValidations/brandController_joi");
const tb_marcas_productos_1 = __importDefault(require("../models/tb_marcas_productos"));
const handleDatabaseError_1 = require("../shared/handleDatabaseError");
const inputTypesValidations_1 = require("../shared/inputTypesValidations");
const formatText_1 = require("../shared/formatText");
class BrandsController {
    /**
    * Este Endpoint sirve para obtener la data de las Marcas
    */
    getBrands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            try {
                const marcas = yield tb_marcas_productos_1.default.findAll({
                    attributes: ['idMarcaProducto', 'nombre', 'descripcion', 'fecha_creacion'],
                });
                if (marcas.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron marcas de productos.',
                        data: []
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Marcas obtenidas exitosamente.',
                    data: marcas
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    addBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { nombre, descripcion } = req.body || {};
            let nombreFormatted = (0, formatText_1.formatText)(nombre);
            const { error } = brandController_joi_1.brandSchema.validate(req.body);
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
                const result = yield connection_1.default.query('EXEC sp_Crear_Marca_Producto :nombre, :descripcion;', {
                    replacements: {
                        nombre: nombreFormatted,
                        descripcion
                    }
                });
                /**
                 * Respuesta del servidor
                 */
                const nuevoID = result[0][0].NuevoID;
                return res.status(201).json({
                    error: false,
                    message: 'Marca agregada exitosamente.',
                    data: { nuevoID },
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para editar la data de empresas en la APP
     */
    modifyBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idMarcaProducto, nombre = null, descripcion = null } = req.body || {};
            let nombreFormatted = nombre;
            if (nombreFormatted !== null) {
                nombreFormatted = (0, formatText_1.formatText)(nombre);
            }
            if ((0, inputTypesValidations_1.isValidNumber)(idMarcaProducto)) {
                const { error } = brandController_joi_1.brandOptionalSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia de la Marca
                    let marcaProductoDB = yield tb_marcas_productos_1.default.findOne({
                        where: {
                            idMarcaProducto: idMarcaProducto
                        },
                    });
                    if (!marcaProductoDB) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID de Marca que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Marca_Producto :idMarcaProducto, :nombre, :descripcion;', {
                        replacements: {
                            idMarcaProducto,
                            nombre: nombreFormatted,
                            descripcion
                        }
                    });
                    /**
                     * Respuesta del Servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Marca modificada exitosamente.',
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
                    message: "Id de Marca no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.brandsController = new BrandsController();
