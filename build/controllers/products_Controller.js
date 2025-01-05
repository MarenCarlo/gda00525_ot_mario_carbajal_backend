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
const inputTypesValidations_1 = require("../shared/inputTypesValidations");
const handleDatabaseError_1 = require("../shared/handleDatabaseError");
class ProductsController {
    /**
    * Este Endpoint sirve para obtener productos o uno solo
    * para los clientes
    */
    getProductsPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idProducto } = req.params;
            let idProductoParsed = Number(idProducto);
            try {
                let query = 'SELECT * FROM vw_Productos_Publico';
                if (idProducto) {
                    if ((0, inputTypesValidations_1.isValidNumber)(idProductoParsed)) {
                        query += ` WHERE idProducto = ${Number(idProducto)}`;
                    }
                    else {
                        return res.status(400).json({
                            error: true,
                            message: 'El ID de producto no es válido.',
                            data: {}
                        });
                    }
                }
                const productos = yield connection_1.default.query(query, {
                    type: 'SELECT'
                });
                if (!productos) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron productos.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Productos obtenidos exitosamente.',
                    data: productos
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
    * Este Endpoint sirve para obtener productos o uno solo
    * con informacion confidencial
    */
    getProductsInternal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idProducto } = req.params;
            let idProductoParsed = Number(idProducto);
            try {
                let query = 'SELECT * FROM vw_Productos_Internos';
                if (idProducto) {
                    if ((0, inputTypesValidations_1.isValidNumber)(idProductoParsed)) {
                        query += ` WHERE idProducto = ${Number(idProducto)}`;
                    }
                    else {
                        return res.status(400).json({
                            error: true,
                            message: 'El ID de producto no es válido.',
                            data: {}
                        });
                    }
                }
                const productos = yield connection_1.default.query(query, {
                    type: 'SELECT'
                });
                if (!productos) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron productos.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Productos obtenidos exitosamente.',
                    data: productos
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
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
                const { jsonData } = req.body || {};
                const file = req.file;
                let productData;
                productData = JSON.parse(jsonData);
                // Validación de datos del usuario con Joi
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
                    if (file) {
                        fs_1.default.unlinkSync(file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: err.message,
                        data: {}
                    });
                }
                if (!file) {
                    return res.status(400).json({
                        error: true,
                        message: 'La imagen es obligatoria.',
                        data: {}
                    });
                }
                try {
                    // Obtener la ruta de la imagen subida desde req.file
                    const imageUrl = file ? `/images/products/${file.filename}` : '';
                    /**
                     * Ejecucion del Procedimiento Almacenado
                     */
                    const result = yield connection_1.default.query('EXEC sp_Crear_Producto :codigo, :nombre, :descripcion, :imagen, :isActive, :categoria_idCategoria, :marca_idMarca;', {
                        replacements: {
                            codigo,
                            nombre,
                            descripcion,
                            imagen: imageUrl,
                            isActive: false,
                            categoria_idCategoria,
                            marca_idMarca
                        }
                    });
                    /**
                     * Respuesta del servidor
                     */
                    const nuevoID = result[0][0].NuevoID;
                    return res.status(201).json({
                        error: false,
                        message: 'Producto agregado exitosamente',
                        data: { nuevoID },
                    });
                }
                catch (error) {
                    if (file) {
                        fs_1.default.unlinkSync(file.path);
                    }
                    return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
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
                const { jsonData } = req.body || {};
                if (!jsonData) {
                    return res.status(400).json({
                        error: true,
                        message: 'jsonData no está presente en el cuerpo de la solicitud.',
                        data: {},
                    });
                }
                const file = req.file;
                let productData;
                // Aquí convertimos jsonData en un objeto JSON
                try {
                    productData = JSON.parse(jsonData); // Convertir JSON string a objeto
                }
                catch (error) {
                    console.log(error);
                    return res.status(400).json({
                        error: true,
                        message: "Error al procesar los datos JSON",
                        data: {}
                    });
                }
                console.log(productData);
                // Validación de datos del usuario con Joi
                const { error } = productController_joi_1.productOptionalSchema.validate(productData);
                if (error) {
                    if (file) {
                        fs_1.default.unlinkSync(file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: error.details[0].message,
                        data: {}
                    });
                }
                const { idProducto, codigo = null, nombre = null, descripcion = null, categoria_idCategoria = null, marca_idMarca = null, isActive = null } = productData;
                /**
                 * Manejo de Errores en subida de imagenes
                 */
                if (err) {
                    if (file) {
                        fs_1.default.unlinkSync(file.path);
                    }
                    return res.status(400).json({
                        error: true,
                        message: err.message,
                        data: {}
                    });
                }
                if ((0, inputTypesValidations_1.isValidNumber)(idProducto)) {
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
                        if (file) {
                            // Se crea nueva ruta de imagen y nombre de archivo con extensión.
                            imageUrl = `/images/products/${file.filename}`;
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
                            isActive,
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
                        if (file) {
                            fs_1.default.unlinkSync(file.path);
                        }
                        return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
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
   * Este Endpoint sirve para obtener los ingresos de stock existentes
   */
    getIngresosStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            try {
                let query = 'SELECT * FROM vw_Ingresos_Stock ORDER BY fecha_creacion DESC;';
                const [rawResult] = yield connection_1.default.query(query);
                if (!Array.isArray(rawResult)) {
                    return res.status(500).json({
                        error: true,
                        message: 'El resultado de la consulta no es válido.',
                        data: {}
                    });
                }
                const ingresosDB = rawResult;
                if (ingresosDB.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron ingresos.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Ingresos obtenidos exitosamente.',
                    data: ingresosDB
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para agregar ingresos de Stock a cada producto en DB.
     */
    addStockIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { cantidad, precio_compra, precio_venta, producto_idProducto } = req.body || {};
            //Validacion de Data ingresada por los usuarios
            const { error } = productController_joi_1.ingressSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
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
                return res.status(201).json({
                    error: false,
                    message: `El nuevo stock del producto es: ${newStock}`,
                    data: { newStock },
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para modificar un ingreso erroneo de Stock en DB.
     */
    modifyStockIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idIngresoStock, cantidad = null, precio_compra = null, precio_venta = null } = req.body || {};
            //Validacion de Data ingresada por los usuarios
            const { error } = productController_joi_1.ingressOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                if ((0, inputTypesValidations_1.isValidNumber)(idIngresoStock)) {
                    if (cantidad !== null && !(0, inputTypesValidations_1.isValidNumber)(cantidad)) {
                        return res.status(400).json({
                            error: true,
                            message: 'La nueva cantidad de Ingreso no es válida.',
                            data: { cantidad }
                        });
                    }
                    // Búsqueda del ingreso del producto a modificar
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
                    let productoDB = yield tb_productos_1.default.findOne({
                        where: {
                            idProducto: ingresoStockDB.producto_idProducto
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
                    const result = yield connection_1.default.query('EXEC sp_Editar_Ingreso_Stock_Producto :idIngresoStock, :cantidad, :precio_compra, :precio_venta, :producto_idProducto;', {
                        replacements: {
                            idIngresoStock,
                            cantidad,
                            precio_compra,
                            precio_venta,
                            producto_idProducto: productoDB.idProducto
                        }
                    });
                    /**
                     * Respuesta del servidor
                     */
                    const newStock = result[0][0].nuevo_stock;
                    return res.status(201).json({
                        error: false,
                        message: `El nuevo stock del producto es: ${newStock}`,
                        data: { newStock },
                    });
                }
                else {
                    return res.status(400).json({
                        error: true,
                        message: 'El ID de Ingreso no es válido.',
                        data: { idIngresoStock }
                    });
                }
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para modificar el Status de un producto en DB.
     */
    modifyStatusProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idProducto, isActive } = req.body || {};
            //Validacion de Data ingresada por los usuarios
            const { error } = productController_joi_1.productStatusSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            // Validacion si idProducto no es un número o es <= 0
            if ((0, inputTypesValidations_1.isValidNumber)(idProducto)) {
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
                     * Ejecucion del Procedimiento Almacenado
                     */
                    yield connection_1.default.query('EXEC sp_Editar_Producto :idProducto, :codigo, :nombre, :descripcion, :imagen, :isActive, :categoria_idCategoria, :marca_idMarca;', {
                        replacements: {
                            idProducto,
                            codigo: null,
                            nombre: null,
                            descripcion: null,
                            imagen: null,
                            isActive: isActive,
                            categoria_idCategoria: null,
                            marca_idMarca: null
                        }
                    });
                    return res.status(201).json({
                        error: false,
                        message: 'Data de Producto modificada exitosamente.',
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
                    message: "Id de Producto no valido.",
                    data: {}
                });
            }
        });
    }
}
exports.productsController = new ProductsController();
