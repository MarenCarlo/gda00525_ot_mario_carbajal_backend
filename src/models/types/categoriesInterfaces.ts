/**
 * ADD CATEGORIES interfaces
 */
export interface addCategoriesBody {
    nombre: string;
    descripcion: string;
}

/**
 * MODIFY CATEGORIES interfaces
 */
export interface modifyCategoriesBody {
    idCategoriaProducto: number;
    nombre: string | null;
    descripcion: string | null;
}