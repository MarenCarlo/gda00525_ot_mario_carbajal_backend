/**
 * INTERFACE Reutilizable en todas las respuestas de NuevoId's
 */
export interface StoredProcedureResult {
    0: { NuevoID: number }[];
    1: number;
}

/**
 * INTERFACE Reutilizable en procedimientos de consultas DELETE
 */
export interface SequelizeQueryResult<T> {
    data: T[];
    metadata: number;
}
export interface StoredProcedureDeleteResult {
    affectedRows: number;
}