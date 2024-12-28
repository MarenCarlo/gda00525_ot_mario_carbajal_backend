/**
 * ADD ENTERPRISES interfaces
 */
export interface addEnterpriseBody {
    razon_social: string;
    nombre_comercial: string;
    nit: string;
    telefono: string;
    email: string;
}

/**
 * ADD ENTERPRISES interfaces
 */
export interface modifyEnterpriseBody {
    idEmpresa: number;
    razon_social: string | null;
    nombre_comercial: string | null;
    nit: string | null;
    telefono: string | null;
    email: string | null;
}