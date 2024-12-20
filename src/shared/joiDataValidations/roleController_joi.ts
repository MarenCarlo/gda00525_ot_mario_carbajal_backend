import Joi from "joi";

/**
 * Validaciones de Datos ingresados por los usuarios.
 */
export const roleOptionalSchema = Joi.object({
    idRol: Joi.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    rol: Joi.string().min(3).max(32).allow(null).messages({
        'string.base': 'El rol debe ser de tipo texto.',
        'string.min': 'El rol debe tener al menos 3 caracteres.',
        'string.max': 'El rol no puede superar los 32 caracteres.',
        'string.empty': 'El rol no puede estar vacío.',
    }),
    descripcion: Joi.string().min(4).max(128).allow(null).messages({
        'string.base': 'La Descripcion del Rol debe ser de tipo texto.',
        'string.min': 'La Descripcion del Rol debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion del Rol no puede superar los 128 caracteres.',
        'string.empty': 'La Descripcion no puede estar vacía.',
    })
});