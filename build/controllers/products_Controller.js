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
exports.productsController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const tb_productos_1 = __importDefault(require("../models/tb_productos"));
const productController_joi_1 = require("../shared/joiDataValidations/productController_joi");
const multerConfig_1 = require("../shared/multerConfig");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tb_ingresos_productos_stock_1 = __importDefault(require("../models/tb_ingresos_productos_stock"));
class ProductsController {
    /**
     * Este Endpoint sirve para registrar nuevos productos en la APP
     */
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            /**
             * Funcion para manejo de subida de imagenes a Servidor.
             */
            multerConfig_1.upload.single('image')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                // Validación de datos del usuario con Joi
                const { jsonData } = req.body;
                let productData = JSON.parse(jsonData);
                const { error } = productController_joi_1.productSchema.validate(productData);
                if (error) {
                    if (req.file) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                const { codigo, nombre, descripcion, categoria_idCategoria, marca_idMarca, } = productData;
                /**
                 * Manejo de Errores en subida de imagenes
                 */
                if (err) {
                    if (req.file) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: err.message,
                        data: {}
                    });
                }
                if (!req.file) {
                    return res.status(400).json({
                        error: true,
                        message: 'La imagen es obligatoria.',
                        data: {}
                    });
                }
                try {
                    // Obtener la ruta de la imagen subida desde req.file
                    const imageUrl = req.file ? `/images/products/${req.file.filename}` : '';
                    // OBJETO DE DATOS MSSQL
                    const replacements = {
                        codigo,
                        nombre,
                        descripcion,
                        imagen: imageUrl,
                        isActive: false,
                        categoria_idCategoria,
                        marca_idMarca
                    };
                    /**
                     * Ejecucion del Procedimiento Almacenado
                     */
                    const nuevoProducto = yield connection_1.default.query('EXEC sp_Crear_Producto :codigo, :nombre, :descripcion, :imagen, :isActive, :categoria_idCategoria, :marca_idMarca;', {
                        replacements: replacements
                    });
                    return res.status(201).json({
                        error: false,
                        message: 'Producto agregado exitosamente',
                        data: { idProducto: nuevoProducto.idProducto },
                    });
                }
                catch (error) {
                    if (req.file) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
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
                                message: `${conflictingValue} ya existe en la Base de Datos.`,
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
            }));
        });
    }
    /**
     * Este Endpoint sirve para editar los productos registrados en la APP
     */
    modifyProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            /**
             * Funcion para manejo de subida de imagenes a Servidor.
             */
            multerConfig_1.upload.single('image')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                // Validación de datos del usuario con Joi
                const { jsonData } = req.body;
                let productData = JSON.parse(jsonData);
                const { error } = productController_joi_1.productOptionalSchema.validate(productData);
                if (error) {
                    if (req.file) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                const { idProducto, codigo = null, nombre = null, descripcion = null, isActive = null, categoria_idCategoria = null, marca_idMarca = null, } = productData;
                /**
                 * Manejo de Errores en subida de imagenes
                 */
                if (err) {
                    if (req.file) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: err.message,
                        data: {}
                    });
                }
                // Validacion si idProducto no es un número o es <= 0
                if (typeof idProducto === 'number' && !isNaN(idProducto) && idProducto > 0) {
                    try {
                        // Búsqueda de la existencia del producto a modificar
                        let productoDB = yield tb_productos_1.default.findOne({
                            where: {
                                idProducto: idProducto
                            },
                        });
                        if (!productoDB) {
                            return res.status(404).json({
                                error: true,
                                message: 'El ID del producto que se intenta modificar, no existe en DB.',
                                data: {},
                            });
                        }
                        /**
                         * Fragmento de Codigo que nos ayuda a eliminar la imagen anterior
                         * para evitar la saturacion de archivos basura en servidor.
                         */
                        // Obtener la ruta de la imagen subida desde req.file
                        let imageUrl = null;
                        if (req.file) {
                            // Se crea nueva ruta de imagen y nombre de archivo con extensión.
                            imageUrl = `/images/products/${req.file.filename}`;
                            // Se Obtiene el nombre de la imagen de producto antigua
                            const filePath = productoDB.imagen.split('/products/')[1];
                            // Obtener la ruta completa del servidor de la imagen antigua
                            const oldImagePath = path_1.default.join(__dirname, '../images/products', filePath);
                            // Se obtiene el Directorio raíz del proyecto
                            const projectRoot = path_1.default.join(__dirname, '..');
                            // Calculamos la ruta relativa desde el directorio raíz del proyecto hasta la imagen para asegurar la correcta posicion de esta
                            const relativePath = path_1.default.relative(projectRoot, oldImagePath);
                            // Se Verifica si el archivo antiguo existe antes de eliminarlo en esa ubicacion
                            if (fs_1.default.existsSync(relativePath)) {
                                // Eliminamos el Archivo
                                fs_1.default.unlinkSync(relativePath);
                            }
                        }
                        // OBJETO DE DATOS MSSQLs
                        const replacements = {
                            idProducto,
                            codigo,
                            nombre,
                            descripcion,
                            imagen: imageUrl,
                            isActive: isActive,
                            categoria_idCategoria,
                            marca_idMarca
                        };
                        /**
                         * Ejecucion del Procedimiento Almacenado
                         */
                        yield connection_1.default.query('EXEC sp_Editar_Producto :idProducto, :codigo, :nombre, :descripcion, :imagen, :isActive, :categoria_idCategoria, :marca_idMarca;', {
                            replacements: replacements
                        });
                        return res.status(201).json({
                            error: false,
                            message: 'Data de Producto modificada exitosamente.',
                            data: {},
                        });
                    }
                    catch (error) {
                        if (req.file) {
                            fs_1.default.unlinkSync(req.file.path);
                        }
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
                                    message: `${conflictingValue} ya existe en la Base de Datos.`,
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
                        message: "Id de Producto no valido.",
                        data: {}
                    });
                }
            }));
        });
    }
    /**
     * Este Endpoint sirve para agregar ingresos de Stock a cada producto en DB.
     */
    addStockIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            //Validacion de Data ingresada por los usuarios
            const { cantidad, precio_compra, precio_venta, producto_idProducto } = req.body;
            const { error } = productController_joi_1.ingressSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia del producto a modificar
                let productoDB = yield tb_productos_1.default.findOne({
                    where: {
                        idProducto: producto_idProducto
                    },
                });
                if (!productoDB) {
                    return res.status(404).json({
                        error: true,
                        message: 'El ID del producto a modificar, no existe en DB.',
                        data: {},
                    });
                }
                /**
                 * Ejecucion del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query('EXEC sp_Agregar_Ingreso_Stock_Producto :cantidad, :precio_compra, :precio_venta, :producto_idProducto;', {
                    replacements: {
                        cantidad,
                        precio_compra,
                        precio_venta,
                        producto_idProducto
                    }
                });
                /**
                 * Respuesta del servidor
                 */
                const newStock = result[0][0].nuevo_stock;
                console.log(newStock);
                return res.status(201).json({
                    error: false,
                    message: `El nuevo stock del producto es: ${newStock}`,
                    data: { newStock },
                });
            }
            catch (error) {
                /**
                 * Manejo de Errores generales de la BD.
                 */
                console.log(error);
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
     * Este Endpoint sirve para modificar un erroneo de Stock en DB.
     */
    modifyStockIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            //Validacion de Data ingresada por los usuarios
            const { idIngresoStock, cantidad = null, precio_compra = null, precio_venta = null } = req.body;
            const { error } = productController_joi_1.ingressOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia del producto a modificar
                let ingresoStockDB = yield tb_ingresos_productos_stock_1.default.findOne({
                    where: {
                        idIngresoStock: idIngresoStock
                    },
                });
                if (!ingresoStockDB) {
                    return res.status(404).json({
                        error: true,
                        message: 'El ID del ingreso a modificar, no existe en DB.',
                        data: {},
                    });
                }
                /**
                 * Ejecucion del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query('EXEC sp_Editar_Ingreso_Stock_Producto :idIngresoStock, :cantidad, :precio_compra, :precio_venta;', {
                    replacements: {
                        idIngresoStock,
                        cantidad,
                        precio_compra,
                        precio_venta
                    }
                });
                /**
                 * Respuesta del servidor
                 */
                const newStock = result[0][0].nuevo_stock;
                console.log(newStock);
                return res.status(201).json({
                    error: false,
                    message: `El nuevo stock del producto es: ${newStock}`,
                    data: { newStock },
                });
            }
            catch (error) {
                /**
                 * Manejo de Errores generales de la BD.
                 */
                console.log(error);
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
exports.productsController = new ProductsController();
