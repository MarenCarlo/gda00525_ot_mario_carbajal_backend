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
const inputTypesValidations_1 = require("../shared/inputTypesValidations");
const handleDatabaseError_1 = require("../shared/handleDatabaseError");
class OrdersController {
    /**
     * Este Endpoint sirve para recibir las Ordenes del usuario de la sesion.
     */
    getOwnOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const user = req.user;
            console.log(user);
            const { idOrden } = req.params;
            try {
                /**
                 * OBTENCION DE ORDENES
                 */
                let query1 = 'SELECT * FROM vw_Ordenes';
                let query2 = 'SELECT * FROM vw_Detalles_Orden';
                let idEmpresaParsed = Number(idOrden);
                if (idOrden) {
                    if ((0, inputTypesValidations_1.isValidNumber)(idEmpresaParsed)) {
                        query1 += ` WHERE idOrden = ${Number(idEmpresaParsed)} AND cliente = '${user.nombreUsuario} AND isActive = 1'`;
                        query2 += ` WHERE orden_idOrden = ${Number(idEmpresaParsed)}`;
                    }
                    else {
                        return res.status(400).json({
                            error: true,
                            message: 'El ID de producto no es válido.',
                            data: {}
                        });
                    }
                }
                else {
                    query1 += ` WHERE cliente = '${user.nombreUsuario}' AND isActive = 1`;
                }
                query1 += ` ORDER BY fecha_creacion DESC;`;
                const ordenes = yield connection_1.default.query(query1, {
                    type: 'SELECT'
                });
                ;
                if (!ordenes || ordenes === null) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron ordenes.',
                        data: {}
                    });
                }
                /**
                 * OBTENCION DE DETALLES DE ORDENES
                 */
                const ordenesDetalles = yield connection_1.default.query(query2, {
                    type: 'SELECT'
                });
                /**
                 * SETEO DE OBJETO DE ORDENES
                 * CON SUS RESPECTIVOS DETALLES
                 */
                const ordenesDetalladas = ordenes.map((orden) => {
                    return Object.assign(Object.assign({}, orden), { detalles: ordenesDetalles.filter((detalle) => detalle.orden_idOrden === orden.idOrden) });
                });
                return res.status(200).json({
                    error: false,
                    message: 'Ordenes obtenidas exitosamente.',
                    data: {
                        ordenesDetalladas
                    }
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
    * Este Endpoint sirve para obtener las ordenes y sus respectivos detalles
    * o una sola
    */
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const { state } = req.params;
            try {
                /**
                 * OBTENCION DE ORDENES
                 */
                let query1 = 'SELECT * FROM vw_Ordenes';
                let query2 = 'SELECT * FROM vw_Detalles_Orden';
                let status_order_param = Number(state);
                if (state) {
                    if ((0, inputTypesValidations_1.isValidNumber)(status_order_param)) {
                        query1 += ` WHERE status_Orden = ${Number(status_order_param)}`;
                    }
                    else {
                        return res.status(400).json({
                            error: true,
                            message: 'El ID de producto no es válido.',
                            data: {}
                        });
                    }
                }
                query1 += ` ORDER BY fecha_creacion DESC;`;
                const ordenes = yield connection_1.default.query(query1, {
                    type: 'SELECT'
                });
                ;
                if (!ordenes || ordenes === null) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron ordenes.',
                        data: {}
                    });
                }
                /**
                 * OBTENCION DE DETALLES DE ORDENES
                 */
                const ordenesDetalles = yield connection_1.default.query(query2, {
                    type: 'SELECT'
                });
                /**
                 * SETEO DE OBJETO DE ORDENES
                 * CON SUS RESPECTIVOS DETALLES
                 */
                const ordenesDetalladas = ordenes.map((orden) => {
                    return Object.assign(Object.assign({}, orden), { detalles: ordenesDetalles.filter((detalle) => detalle.orden_idOrden === orden.idOrden) });
                });
                return res.status(200).json({
                    error: false,
                    message: 'Ordenes obtenidas exitosamente.',
                    data: {
                        ordenesDetalladas
                    }
                });
            }
            catch (error) {
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
            }
        });
    }
    /**
     * Este Endpoint sirve para registrar nuevas órdenes en la APP
     */
    addOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.info(ip);
            const user = req.user;
            const { usuarioCliente_idUsuario = user.idUsuario, detalles, } = req.body || {};
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
                        detalle.precio_venta = productoDB.precio_venta;
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
                return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
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
            const { idOrden, status_Orden = null, isActive = null, usuarioCliente_idUsuario = null, usuarioVendedor_idUsuario = null } = req.body || {};
            let userVendedor = usuarioVendedor_idUsuario;
            let statusOrden = null;
            /**
             * Condicional que hace que si la orden es eliminada,
             * osea: isActive = 0; el status_order cambie a 0.
             *
             * Esto es para evitar que ordenes eliminadas, queden
             * con estados de Venta o Pendiente.
             */
            if (isActive !== null && isActive === false) {
                statusOrden = 0;
            }
            else {
                statusOrden = status_Orden;
            }
            if (status_Orden === 2) {
                userVendedor = user.idUsuario;
            }
            const { error } = orderController_joi_1.orderOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            // Validacion si idOrden no es un número o es <= 0
            if ((0, inputTypesValidations_1.isValidNumber)(idOrden)) {
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
                    if (ordenDB.isActive === false) {
                        return res.status(403).json({
                            error: true,
                            message: 'No se puede modificar un detalle de orden cancelado/eliminado.',
                            data: {},
                        });
                    }
                    if (ordenDB.status_Orden === 2 || ordenDB.status_Orden === 3) {
                        return res.status(403).json({
                            error: true,
                            message: 'No se puede modificar una Orden Vendida.',
                            data: {},
                        });
                    }
                    yield connection_1.default.query('EXEC sp_Editar_Orden :idOrden, :status_Orden, :isActive, :usuarioCliente_idUsuario, :usuarioVendedor_idUsuario;', {
                        replacements: {
                            idOrden,
                            status_Orden: statusOrden,
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
            const { idDetalleOrden } = req.body || {};
            if ((0, inputTypesValidations_1.isValidNumber)(idDetalleOrden)) {
                try {
                    // Búsqueda de la existencia del detalle de la orden a eliminar
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
                    let affectedRows = result[1];
                    /**
                     * Manejo de Resultados del Procedimiento
                     */
                    if (!affectedRows && affectedRows === 0) {
                        return res.status(400).json({
                            error: true,
                            message: 'La Orden a la que se intenta eliminar el Artículo, ya no es modificable.',
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
                    return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
                }
            }
            else {
                return res.status(400).json({
                    error: true,
                    message: "ID de Detalle de Orden no válido.",
                    data: {}
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
            const { cantidad, producto_idProducto, orden_idOrden } = req.body || {};
            if ((0, inputTypesValidations_1.isValidNumber)(cantidad) && (0, inputTypesValidations_1.isValidNumber)(producto_idProducto) && (0, inputTypesValidations_1.isValidNumber)(orden_idOrden)) {
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
                    if (ordenDB.status_Orden === 3 || ordenDB.status_Orden === 2 || ordenDB.status_Orden === 0 || ordenDB.isActive === false) {
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
                    yield connection_1.default.query('EXEC sp_Crear_Detalle_Orden :cantidad, :precio_venta, :subtotal, :producto_idProducto, :orden_idOrden;', {
                        replacements: {
                            cantidad: cantidad,
                            precio_venta: productoDB.precio_venta,
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
                        }
                    });
                }
                catch (error) {
                    return (0, handleDatabaseError_1.handleDatabaseError)(error, res);
                }
            }
            else {
                return res.status(400).json({
                    error: true,
                    message: "ID de Orden o Producto no válido.",
                    data: {}
                });
            }
        });
    }
}
exports.ordersController = new OrdersController();
