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
exports.categoriesController = void 0;
const categoryController_joi_1 = require("../shared/joiDataValidations/categoryController_joi");
const connection_1 = __importDefault(require("../database/connection"));
const tb_categorias_productos_1 = __importDefault(require("../models/tb_categorias_productos"));
class CategoriesController {
    /**
        * Este Endpoint sirve para registrar nuevas empresas en la APP
        */
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
        });
    }
    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { nombre, descripcion } = req.body;
            let nombreFormatted;
            if (nombre !== null && nombre !== undefined) {
                nombreFormatted = nombre
                    .toLowerCase()
                    .split(' ')
                    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                    .join(' ');
            }
            const { error } = categoryController_joi_1.categorySchema.validate(req.body);
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
                const result = yield connection_1.default.query('EXEC sp_Crear_Categoria_Producto :nombre, :descripcion;', {
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
                    message: 'Categoria agregada exitosamente.',
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
    modifyCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idCategoriaProducto, nombre = null, descripcion = null } = req.body;
            let nombreFormatted = null;
            if (nombre !== null && nombre !== undefined) {
                nombreFormatted = nombre
                    .toLowerCase()
                    .split(' ')
                    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                    .join(' ');
            }
            // Validacion si idCategoriaProducto no es un número o es <= 0
            if (typeof idCategoriaProducto === 'number' && !isNaN(idCategoriaProducto) && idCategoriaProducto > 0) {
                //Validacion de Data ingresada por los usuarios
                const { error } = categoryController_joi_1.categoryOptionalSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                try {
                    // Búsqueda de la existencia de la Empresa
                    let categoriaProductoDB = yield tb_categorias_productos_1.default.findOne({
                        where: {
                            idCategoriaProducto: idCategoriaProducto
                        },
                    });
                    if (!categoriaProductoDB) {
                        return res.status(403).json({
                            error: true,
                            message: "El ID de Categoría que se busca modificar, no existe en BD.",
                            data: {}
                        });
                    }
                    // OBJETO DE DATOS MSSQL
                    const replacements = {
                        idCategoriaProducto,
                        nombre: nombreFormatted,
                        descripcion
                    };
                    // Ejecucion el procedimiento almacenado
                    yield connection_1.default.query('EXEC sp_Editar_Categoria_Producto :idCategoriaProducto, :nombre, :descripcion;', {
                        replacements: replacements
                    });
                    /**
                     * Respuesta del Servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Categoría modificada exitosamente.',
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
                    message: "Id de Categoría no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.categoriesController = new CategoriesController();
