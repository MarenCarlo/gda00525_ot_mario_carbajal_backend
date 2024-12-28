/**
 * ADD USER interfaces
 */
export interface AddUsuario {
    nombre_completo: string;
    username: string;
    passphrase: string;
    repeat_passphrase: string;
    telefono: string;
    email: string;
    direccion: string;
    fecha_nacimiento: string;
    rol_idRol: number;
    empresa_idEmpresa: number;
    isSuperUser: number;
    isActive: number;
}

/**
 * MODIFY USER interfaces
 */
export interface modifyUsuario {
    idUsuario: number;
    newStateValue?: string | null;
    nombre_completo?: string | null;
    username?: string | null;
    passphrase?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    fecha_nacimiento?: string | null;
    rol_idRol?: number | null;
    empresa_idEmpresa?: number | null;
    isSuperUser?: number | null;
    isActive?: number | null;
}