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
exports.ordersController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const orderController_joi_1 = require("../shared/joiDataValidations/orderController_joi");
const tb_productos_1 = __importDefault(require("../models/tb_productos"));
const sequelize_1 = require("sequelize");
const tb_ordenes_1 = __importDefault(require("../models/tb_ordenes"));
const tb_detalles_orden_1 = __importDefault(require("../models/tb_detalles_orden"));
class OrdersController {
    /**
     * Este Endpoint sirve para registrar nuevas órdenes en la APP
     */
    addOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const user = req.user;
            const { usuarioCliente_idUsuario = user.idUsuario, detalles, } = req.body;
            const { error } = orderController_joi_1.orderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            /**
             * Iteración de detalles de Orden para obtencion de ARRAY de IDs de Productos
             * en los detalles de la Orden.
             */
            let productsID = Array.from(new Set(detalles.map((detalle) => detalle.producto_idProducto)));
            try {
                /**
                 * Busqueda de Listado de IDs de productos incluidos en los detalles de la Orden,
                 * Busqueda por ARRAY de IDs, para garantizar eficiencia en la consulta.
                 */
                const productosDB = yield tb_productos_1.default.findAll({
                    where: {
                        idProducto: {
                            [sequelize_1.Op.in]: productsID
                        },
                    },
                });
                /**
                 * Fragmento que nos sirve para setear la data de los detalles de los productos vendidos, conforme a la data de DB
                 * para mayor seguridad de las transacciónes obtenidas desde el Frontend.
                 */
                let totalOrden = 0;
                const detallesActualizados = [...detalles];
                for (const detalle of detallesActualizados) {
                    const productoDB = productosDB.find((producto) => producto.idProducto === detalle.producto_idProducto);
                    if (productoDB) {
                        if (productoDB.dataValues.stock < detalle.cantidad) {
                            return res.status(400).json({
                                error: true,
                                message: `No hay suficiente stock de: ${productoDB.dataValues.nombre}. Stock en Inventario: ${productoDB.dataValues.stock}, Cantidad Solicitada: ${detalle.cantidad}`,
                                data: {}
                            });
                        }
                        const totalProducto = productoDB.dataValues.precio_venta * detalle.cantidad;
                        detalle.subtotal = totalProducto;
                        totalOrden += totalProducto;
                    }
                }
                /**
                 * Ejecución del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query(`EXEC sp_Crear_Orden_Y_Detalles 
                 :total_orden, :status_Orden, :usuarioCliente_idUsuario, 
                 :usuarioVendedor_idUsuario, :fecha_creacion, :detalles`, {
                    replacements: {
                        total_orden: totalOrden,
                        status_Orden: 1,
                        usuarioCliente_idUsuario,
                        usuarioVendedor_idUsuario: null,
                        fecha_creacion: null,
                        detalles: JSON.stringify(detallesActualizados),
                    },
                }
                /**
                 * SOFT DELETE
                 * - (isActive = 0)
                 * STATUS DE ORDENES
                 * - (0 eliminado/cancelado)
                 * - (1 pendiente)
                 * - (2 aceptada)
                 */
                );
                /**
                 * Respuesta del servidor
                 */
                const ordenID = result[0][0].NuevoID;
                return res.status(201).json({
                    error: false,
                    message: 'Orden agregada exitosamente.',
                    data: { ordenID, totalOrden, detallesActualizados }
                });
            }
            catch (error) {
                /**
                 * Manejo de errores específicos de la base de datos
                 */
                if (error.original) {
                    if (error.original.message.includes('Violation of PRIMARY KEY')) {
                        return res.status(409).json({
                            error: true,
                            message: 'Violación de clave primaria. Verifica los datos enviados.',
                            data: {},
                        });
                    }
                    else if (error.original.message.includes('Violation of FOREIGN KEY')) {
                        return res.status(409).json({
                            error: true,
                            message: 'Violación de clave foránea. Verifica que los IDs existan en la base de datos.',
                            data: {},
                        });
                    }
                }
                /**
                 * Manejo de errores generales
                 */
                console.log(error);
                return res.status(500).json({
                    error: true,
                    message: 'Hay problemas al procesar la solicitud.',
                    data: { error: error.message || error },
                });
            }
        });
    }
    /**
     * Este endpoint nos sirve para modificar las Ordenes recibidas en DB.
     * CASO DE USO
     * - Cambio de Estado a Cancelado.
     * - Aceptar/Autorizar Venta.
     */
    modifyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const user = req.user;
            const { idOrden, status_Orden = null, isActive = null, usuarioCliente_idUsuario = null, usuarioVendedor_idUsuario = null } = req.body;
            let userVendedor = usuarioVendedor_idUsuario === user.idUsuario ? user.idUsuario : usuarioVendedor_idUsuario;
            const { error } = orderController_joi_1.orderOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            // Validacion si idOrden no es un número o es <= 0
            if (typeof idOrden === 'number' && !isNaN(idOrden) && idOrden > 0) {
                try {
                    // Búsqueda de la existencia de la orden a modificar
                    let ordenDB = yield tb_ordenes_1.default.findOne({
                        where: {
                            idOrden: idOrden
                        },
                    });
                    if (!ordenDB) {
                        return res.status(404).json({
                            error: true,
                            message: 'El ID de la ordens que se intenta modificar, no existe en DB.',
                            data: {},
                        });
                    }
                    /**
                     * Ejecucion del Procedimiento Almacenado
                     */
                    yield connection_1.default.query('EXEC sp_Editar_Orden :idOrden, :status_Orden, :isActive, :usuarioCliente_idUsuario, :usuarioVendedor_idUsuario;', {
                        replacements: {
                            idOrden,
                            status_Orden,
                            isActive,
                            usuarioCliente_idUsuario,
                            usuarioVendedor_idUsuario: userVendedor
                        }
                    });
                    /**
                     * Respuesta del servidor
                     */
                    return res.status(201).json({
                        error: false,
                        message: `Orden Modificada Exitosamente.`,
                        data: {},
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
    /**
     * Este endpoint nos sirve para Eliminar los detalles de las órdenes recibidas en la DB
     * Solamente cuando la orden no este cancelada o aceptada.
     * CASO DE USO
     * - Eliminar Detalles Erróneos de la Orden.
     */
    deleteOrderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { idDetalleOrden } = req.body;
            if (typeof idDetalleOrden !== 'number' && isNaN(idDetalleOrden) && idDetalleOrden <= 0) {
                return res.status(400).json({
                    error: true,
                    message: "ID de Detalle de Orden no válido.",
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia del detalle de la orden
                let ordenDetalleDB = yield tb_detalles_orden_1.default.findOne({
                    where: {
                        idDetalleOrden: idDetalleOrden
                    },
                });
                if (!ordenDetalleDB) {
                    return res.status(404).json({
                        error: true,
                        message: 'El ID del Artículo a Modificar, no existe en en la DB.',
                        data: {},
                    });
                }
                const cantidadArticulos = yield tb_detalles_orden_1.default.count({
                    where: {
                        orden_idOrden: ordenDetalleDB.dataValues.orden_idOrden
                    },
                });
                if (cantidadArticulos <= 1) {
                    return res.status(404).json({
                        error: true,
                        message: 'La Orden Debe tener al menos (1) artículo asignado.',
                        data: {},
                    });
                }
                /**
                 * Ejecución del Procedimiento Almacenado
                 */
                const result = yield connection_1.default.query('EXEC sp_Eliminar_Detalle_Orden :idDetalleOrden;', {
                    replacements: {
                        idDetalleOrden
                    }
                });
                /**
                 * Manejo de Resultados del Procedimiento
                 */
                if (result && result.affectedRows === 0) {
                    return res.status(400).json({
                        error: true,
                        message: 'La Orden a la que se intenta agregar el Artículo, ya no es modificable.',
                        data: {}
                    });
                }
                /**
                 * Respuesta del Servidor
                 */
                return res.status(200).json({
                    error: false,
                    message: "Detalle de Orden eliminado exitosamente.",
                    data: {}
                });
            }
            catch (error) {
                /**
                 * Manejo de Errores Generales de la BD.
                 */
                console.error(error);
                return res.status(500).json({
                    error: true,
                    message: 'Hubo un error al procesar la solicitud.',
                    data: { error }
                });
            }
        });
    }
    /**
     * Este endpoint nos sirve para modificar las Ordenes recibidas en DB.
     * CASO DE USO
     * - Agregar Productos a Ordenes Existentes.
     */
    addOrderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { cantidad, producto_idProducto, orden_idOrden } = req.body;
            if ((typeof producto_idProducto !== 'number' && isNaN(producto_idProducto) && producto_idProducto <= 0) &&
                (typeof orden_idOrden !== 'number' && isNaN(orden_idOrden) && orden_idOrden <= 0)) {
                return res.status(400).json({
                    error: true,
                    message: "ID de Orden o Producto no válido.",
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Orden.
                let ordenDB = yield tb_ordenes_1.default.findOne({
                    where: {
                        idOrden: orden_idOrden
                    },
                });
                if (!ordenDB) {
                    return res.status(404).json({
                        error: true,
                        message: 'La orden a la que intenta asignarse el artículo, no existe en DB.',
                        data: {},
                    });
                }
                /**
                 * Validacion del estado de la Orden contenedora.
                 */
                if (ordenDB.status_Orden === 2 || ordenDB.status_Orden === 0 || ordenDB.isActive === false) {
                    return res.status(404).json({
                        error: true,
                        message: 'La Orden a la que se intenta agregar el Artículo, ya no es modificable.',
                        data: {},
                    });
                }
                // Búsqueda de la existencia del Producto.
                let productoDB = yield tb_productos_1.default.findOne({
                    where: {
                        idProducto: producto_idProducto
                    },
                });
                if (!productoDB) {
                    return res.status(404).json({
                        error: true,
                        message: 'El Producto que intenta asignarse a la Orden, no existe en DB.',
                        data: {},
                    });
                }
                /**
                 * Validacion de Suficiencia de Stock.
                 */
                if (productoDB.stock < cantidad) {
                    return res.status(400).json({
                        error: true,
                        message: `No hay suficiente stock de: ${productoDB.nombre}. Stock en Inventario: ${productoDB.stock}, Cantidad Solicitada: ${cantidad}`,
                        data: {}
                    });
                }
                /**
                 * Actualizacion del Total de Orden y Seteo de Subtotal del Detalle de Orden.
                 */
                let subTotalDetalle = cantidad * productoDB.precio_venta;
                let totalOrdenNuevo = ordenDB.total_orden + subTotalDetalle;
                /**
                 * Procedimiento almacenado que setea la nueva cantidad de total
                 * (total anterior + subtotal detalle nuevo)
                 */
                yield connection_1.default.query('EXEC sp_Editar_Total_Orden :idOrden, :total_orden;', {
                    replacements: {
                        idOrden: ordenDB.idOrden,
                        total_orden: totalOrdenNuevo
                    }
                });
                /**
                 * Procedimiento almacenado que inserta el nuevo detalle de Orden.
                 */
                yield connection_1.default.query('EXEC sp_Crear_Detalle_Orden :cantidad, :subtotal, :producto_idProducto, :orden_idOrden;', {
                    replacements: {
                        cantidad: cantidad,
                        subtotal: subTotalDetalle,
                        producto_idProducto: productoDB.idProducto,
                        orden_idOrden: ordenDB.idOrden
                    }
                });
                /**
                 * Respuesta del Servidor
                 */
                return res.status(200).json({
                    error: false,
                    message: "Detalle de Orden agregado exitosamente.",
                    data: {
                        subTotalDetalle,
                        totalOrdenNuevo,
                        ordenDB,
                        productoDB
                    }
                });
            }
            catch (error) {
                /**
                 * Manejo de Errores Generales de la BD.
                 */
                console.error(error);
                return res.status(500).json({
                    error: true,
                    message: 'Hubo un error al procesar la solicitud.',
                    data: { error }
                });
            }
        });
    }
}
exports.ordersController = new OrdersController();
