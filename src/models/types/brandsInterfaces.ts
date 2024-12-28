/**
 * ADD BRANDS interfaces
 */
export interface addBrandsBody {
    nombre: string;
    descripcion: string;
}

/**
 * MODIFY BRANDS interfaces
 */
export interface modifyBrandsBody {
    idMarcaProducto: number;
    nombre: string | null;
    descripcion: string | null;
}