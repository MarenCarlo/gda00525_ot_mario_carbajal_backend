"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Text Translations Format:
 *
 * texts.FileName.text
 */
const texts = {
    /**
     * Server Configurations
     */
    app: {
        not_allowed_by_cors: 'Conexion no permitida por CORS',
        not_finded_route: 'Ruta no encontrada',
    },
    /**
     * Middlewares
     */
    validate_token: {
        denied_access: 'Acceso Denegado',
        secret_not_defined: 'La clave secreta no está definida',
        invalid_token: 'Este token no es válido',
    },
    validate_admin: {
        is_not_admin: 'Se requieren permisos de administrador para realizar esta acción',
        not_user_info_error: 'información de User no disponible',
    },
    /**
     * Controllers
     */
    auth_controller: {
        joi: {
            nameUser: {
                string_base: 'El nombre de usuario debe ser de tipo String',
                string_min: 'El nombre de usuario debe tener al menos 4 caracteres',
                string_max: 'El nombre de usuario no debe tener más de 32 caracteres',
                required: 'El nombre de usuario es obligatorio',
            },
            passUser: {
                string_base: 'La Contraseña debe ser de tipo string',
                string_min: 'La Contraseña debe tener al menos 8 caracteres',
                string_max: 'La Contraseña no debe tener más de 32 caracteres',
                required: 'La Contraseña es obligatoria',
            },
        },
        wrong_form_data_error: 'Data del formulario Erronea',
        inactive_user: 'Este usuario debe ser activado por un administrador, para poder ingresar al Software',
        inactive_user_error: 'Usuario Inactivado',
        nonexistent_user: 'No existe ningún usuario con el nombre de Usuario:',
        nonexistent_user_error: 'Usuario No Encontrado',
        wrong_password: 'La Contraseña es incorrecta',
        wrong_password_error: 'Contraseña Incorrecta',
        secret_not_defined: 'TOKEN_SECRET is not defined in the environment variables.',
        secret_not_defined_error: 'TOKEN_SECRET is not defined.',
        clg_successfully_logged_in: 'Logueado Correctamente',
        successfully_logged_in: "Sesión Iniciada",
    },
    user_controller: {
        joi: {
            nameUser: {
                string_base: 'El nombre de usuario debe ser de tipo String',
                string_min: 'El nombre de usuario debe tener al menos 4 caracteres',
                string_max: 'El nombre de usuario no debe tener más de 32 caracteres',
                required: 'El nombre de usuario es obligatorio',
            },
            passUser: {
                string_base: 'La Contraseña debe ser de tipo string',
                string_min: 'La Contraseña debe tener al menos 8 caracteres',
                string_max: 'La Contraseña no debe tener más de 32 caracteres',
                required: 'La Contraseña es obligatoria',
            },
            roleUser: {
                number_base: 'El Rol debe ser de tipo number',
                number_integer: 'El Número de ID de Rol Recibido en el servidor debe ser de tipo integer',
                number_min: 'El Rol debe tener al menos 1 digito',
                number_max: 'El Rol no debe tener más de 2 digitos',
                required: 'El Rol es obligatorio',
            },
        },
        wrong_form_data_error: 'Data del formulario Erronea',
        previously_registered_user: 'Este Nombre de usuario ya ha sido registrado anteriormente',
        previously_registered_user_error: 'Usuario Ya Existe',
        clg_new_user: 'Usuario Nuevo Registrado',
        new_registered_user: 'Usuario Registrado Exitosamente',
    },
};
exports.default = texts;
