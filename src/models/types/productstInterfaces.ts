/**
 * Generales
 */
export interface AddProductRequestBody {
    jsonData: string;
}
export interface UploadedFile {
    path: string;
    filename: string;
    mimetype: string;
    size: number;
}

/**
 * ADD PRODUCTS interfaces
 */
export interface addProductData {
    codigo: string;
    nombre: string;
    descripcion: string;
    categoria_idCategoria: number;
    marca_idMarca: number;
}

/**
 * MODIFY PRODUCTS interfaces
 */
export interface modifyProductData {
    idProducto: number;
    codigo?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    imagen?: string | null;
    isActive?: string | null;
    categoria_idCategoria?: number | null;
    marca_idMarca?: number | null;
    [key: string]: string | number | null | undefined;
}

/**
 * GET STOCK INGRESOS
 */
export interface IngresoStock {
    idIngresoStock: number;
    cantidad: number;
    codigo: string;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    idProducto: number;
    isActive: boolean;
    marca_idMarca: number;
    categoria_idCategoria: number;
    fecha_creacion: string;
}

/**
 * ADD STOCK INGRESO interfaces
 */
export interface AddStockRequestBody {
    cantidad: number;
    precio_compra: number;
    precio_venta: number;
    producto_idProducto: number;
}
export interface AddStockIngressSchema {
    cantidad: number;
    precio_compra: number;
    precio_venta: number;
    producto_idProducto: number;
}
export interface AddStockQueryResult {
    0: { nuevo_stock: number }[];
    1: number;
}

/**
 * MODIFY STOCK INGRESO interfaces
 */
export interface ModifyStockRequestBody {
    idIngresoStock: number;
    cantidad?: number | null;
    precio_compra?: number | null;
    precio_venta?: number | null;
}

/**
 * MODIFY STATUS PRODUCT interfaces
 */
export interface ModifyStatusProduct {
    idProducto: number;
    isActive: boolean;
}