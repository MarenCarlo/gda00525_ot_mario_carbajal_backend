import { Request, Response } from 'express';
import sequelize from '../database/connection';
import { enterpriseSchema } from '../shared/joiDataValidations/enterpriseController_joi';
import { orderOptionalSchema, orderSchema } from '../shared/joiDataValidations/orderController_joi';
import Producto from '../models/tb_productos';
import { Op } from 'sequelize';
import Orden from '../models/tb_ordenes';
import DetalleOrden from '../models/tb_detalles_orden';
import { isValidNumber } from '../shared/inputTypesValidations';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { SequelizeQueryResult, StoredProcedureDeleteResult, StoredProcedureResult } from '../models/types/promiseResultsInterfaces';
import { addOrderBody, addOrderDetailBody, deleteOrderDetailBody, intDetalleOrden, intOrden, modifyOrderBody } from '../models/types/ordersInterfaces';

class OrdersController {

    /**
    * Este Endpoint sirve para obtener las ordenes y sus respectivos detalles
    * o una sola
    */
    public async getOrders(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const { idOrden } = req.params;
        try {
            /**
             * OBTENCION DE ORDENES
             */
            let query1: string = 'SELECT * FROM vw_Ordenes';
            let query2: string = 'SELECT * FROM vw_Detalles_Orden';
            let idEmpresaParsed = Number(idOrden);
            if (idOrden) {
                if (isValidNumber(idEmpresaParsed)) {
                    query1 += ` WHERE idOrden = ${Number(idEmpresaParsed)}`;
                    query2 += ` WHERE orden_idOrden = ${Number(idEmpresaParsed)}`;
                } else {
                    return res.status(400).json({
                        error: true,
                        message: 'El ID de producto no es válido.',
                        data: {}
                    });
                }
            }
            query1 += ` ORDER BY fecha_creacion DESC;`;
            const ordenes = await sequelize.query(query1, {
                type: 'SELECT'
            }) as intOrden[];;
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
            const ordenesDetalles = await sequelize.query(query2, {
                type: 'SELECT'
            }) as intDetalleOrden[];
            /**
             * SETEO DE OBJETO DE ORDENES
             * CON SUS RESPECTIVOS DETALLES
             */
            const ordenesDetalladas: intOrden[] = ordenes.map((orden: intOrden) => {
                return {
                    ...orden,
                    detalles: ordenesDetalles.filter(
                        (detalle: intDetalleOrden) => detalle.orden_idOrden === orden.idOrden
                    ),
                };
            });
            return res.status(200).json({
                error: false,
                message: 'Ordenes obtenidas exitosamente.',
                data: {
                    ordenesDetalladas
                }
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este Endpoint sirve para registrar nuevas órdenes en la APP
     */
    public async addOrder(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const user = req.user;
        const {
            usuarioCliente_idUsuario = user!.idUsuario,
            detalles,
        }: addOrderBody = req.body || {};
        const { error } = orderSchema.validate(req.body);
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
        let productsID = Array.from(
            new Set(detalles!.map((detalle: intDetalleOrden) => detalle.producto_idProducto))
        );
        try {
            /**
             * Busqueda de Listado de IDs de productos incluidos en los detalles de la Orden,
             * Busqueda por ARRAY de IDs, para garantizar eficiencia en la consulta.
             */
            const productosDB: Producto[] = await Producto.findAll({
                where: {
                    idProducto: {
                        [Op.in]: productsID
                    },
                },
            });
            /**
             * Fragmento que nos sirve para setear la data de los detalles de los productos vendidos, conforme a la data de DB
             * para mayor seguridad de las transacciónes obtenidas desde el Frontend.
             */
            let totalOrden = 0;
            const detallesActualizados: intDetalleOrden[] = [...detalles!];
            for (const detalle of detallesActualizados) {
                const productoDB = productosDB.find((producto: Producto) => producto.idProducto === detalle.producto_idProducto);
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
            const result = await sequelize.query(
                `EXEC sp_Crear_Orden_Y_Detalles 
                 :total_orden, :status_Orden, :usuarioCliente_idUsuario, 
                 :usuarioVendedor_idUsuario, :fecha_creacion, :detalles`,
                {
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
            ) as StoredProcedureResult;
            /**
             * Respuesta del servidor
             */
            const ordenID = result[0][0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Orden agregada exitosamente.',
                data: { ordenID, totalOrden, detallesActualizados }
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este endpoint nos sirve para modificar las Ordenes recibidas en DB.
     * CASO DE USO
     * - Cambio de Estado a Cancelado.
     * - Aceptar/Autorizar Venta.
     */
    public async modifyOrder(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const user = req.user;
        const {
            idOrden,
            status_Orden = null,
            isActive = null,
            usuarioCliente_idUsuario = null,
            usuarioVendedor_idUsuario = null
        }: modifyOrderBody = req.body || {};
        let userVendedor: number = usuarioVendedor_idUsuario === user!.idUsuario ? user!.idUsuario : usuarioVendedor_idUsuario;
        let statusOrden: number | null = null;

        /**
         * Condicional que hace que si la orden es eliminada,
         * osea: isActive = 0; el status_order cambie a 0.
         * 
         * Esto es para evitar que ordenes eliminadas, queden
         * con estados de Venta o Pendiente.
         */
        if (isActive !== null && isActive === false) {
            statusOrden = 0;
        } else {
            statusOrden = status_Orden
        }

        const { error } = orderOptionalSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                data: {}
            });
        }
        // Validacion si idOrden no es un número o es <= 0
        if (isValidNumber(idOrden)) {
            try {
                // Búsqueda de la existencia de la orden a modificar
                let ordenDB: Orden | null = await Orden.findOne({
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
                await sequelize.query(
                    'EXEC sp_Editar_Orden :idOrden, :status_Orden, :isActive, :usuarioCliente_idUsuario, :usuarioVendedor_idUsuario;',
                    {
                        replacements: {
                            idOrden,
                            status_Orden: statusOrden,
                            isActive,
                            usuarioCliente_idUsuario,
                            usuarioVendedor_idUsuario: userVendedor
                        }
                    }
                );
                /**
                 * Respuesta del servidor
                 */
                return res.status(201).json({
                    error: false,
                    message: `Orden Modificada Exitosamente.`,
                    data: {},
                });
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Producto no valido.",
                data: {}
            });
        }
    }

    /**
     * Este endpoint nos sirve para Eliminar los detalles de las órdenes recibidas en la DB
     * Solamente cuando la orden no este cancelada o aceptada.
     * CASO DE USO
     * - Eliminar Detalles Erróneos de la Orden.
     */
    public async deleteOrderDetail(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const { idDetalleOrden }: deleteOrderDetailBody = req.body || {};
        if (isValidNumber(idDetalleOrden)) {
            try {
                // Búsqueda de la existencia del detalle de la orden a eliminar
                let ordenDetalleDB: DetalleOrden | null = await DetalleOrden.findOne({
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
                const cantidadArticulos: number = await DetalleOrden.count({
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
                const result = await sequelize.query(
                    'EXEC sp_Eliminar_Detalle_Orden :idDetalleOrden;',
                    {
                        replacements: {
                            idDetalleOrden
                        }
                    }
                ) as [unknown[], number];
                let affectedRows = result[1]
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
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(400).json({
                error: true,
                message: "ID de Detalle de Orden no válido.",
                data: {}
            });
        }
    }

    /**
     * Este endpoint nos sirve para modificar las Ordenes recibidas en DB.
     * CASO DE USO
     * - Agregar Productos a Ordenes Existentes.
     */
    public async addOrderDetail(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            cantidad,
            producto_idProducto,
            orden_idOrden
        }: addOrderDetailBody = req.body || {};
        if (isValidNumber(cantidad) && isValidNumber(producto_idProducto) && isValidNumber(orden_idOrden)) {
            try {
                // Búsqueda de la existencia de la Orden.
                let ordenDB: Orden | null = await Orden.findOne({
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
                let productoDB: Producto | null = await Producto.findOne({
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
                let subTotalDetalle: number = cantidad * productoDB.precio_venta;
                let totalOrdenNuevo: number = ordenDB.total_orden + subTotalDetalle;

                /**
                 * Procedimiento almacenado que setea la nueva cantidad de total
                 * (total anterior + subtotal detalle nuevo)
                 */
                await sequelize.query(
                    'EXEC sp_Editar_Total_Orden :idOrden, :total_orden;',
                    {
                        replacements: {
                            idOrden: ordenDB.idOrden,
                            total_orden: totalOrdenNuevo
                        }
                    }
                );

                /**
                 * Procedimiento almacenado que inserta el nuevo detalle de Orden.
                 */
                await sequelize.query(
                    'EXEC sp_Crear_Detalle_Orden :cantidad, :precio_venta, :subtotal, :producto_idProducto, :orden_idOrden;',
                    {
                        replacements: {
                            cantidad: cantidad,
                            precio_venta: productoDB.precio_venta,
                            subtotal: subTotalDetalle,
                            producto_idProducto: productoDB.idProducto,
                            orden_idOrden: ordenDB.idOrden
                        }
                    }
                );

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
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(400).json({
                error: true,
                message: "ID de Orden o Producto no válido.",
                data: {}
            });
        }
    }
}

export const ordersController = new OrdersController();