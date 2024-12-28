/**
 * ORDERS interfaces
 */
/**
 * SOFT DELETE
 * - (isActive = 0)
 * STATUS DE ORDENES
 * - (0 eliminado/cancelado)
 * - (1 pendiente)
 * - (2 aceptada)
 */
export interface intOrden {
    idOrden?: number;
    fecha_creacion?: string;
    total_orden?: number;
    status_Orden?: 0 | 1 | 2;
    isActive?: number;
    usuarioCliente_idUsuario?: number;
    usuarioVendedor_idUsuario?: number;
    detalles?: intDetalleOrden[];
}

export interface intDetalleOrden {
    idDetalleOrden?: number;
    cantidad: number;
    precio_venta: number;
    subtotal: number;
    producto_idProducto: number;
    orden_idOrden: number;
}

/**
 * ADD ORDERS interfaces
 */
export interface addOrderBody {
    usuarioCliente_idUsuario: number,
    detalles?: intDetalleOrden[];
}

/**
 * MODIFY ORDERS interface
 */
export interface modifyOrderBody {
    idOrden: number;
    status_Orden: 0 | 1 | 2 | null;
    isActive: number | boolean | null;
    usuarioCliente_idUsuario: number | null;
    usuarioVendedor_idUsuario: number | null;
}

/**
 * DELETE ORDER DETAIL interface
 */
export interface deleteOrderDetailBody {
    idDetalleOrden: number;
}

/**
 * ADD ORDER DETAIL interface
 */
export interface addOrderDetailBody {
    cantidad: number;
    producto_idProducto: number;
    orden_idOrden: number;
}