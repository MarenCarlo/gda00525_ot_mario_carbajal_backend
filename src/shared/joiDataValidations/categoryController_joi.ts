import Joi from "joi";

/**
 * Validaciones de Datos ingresados por los usuarios.
 */
export const categorySchema = Joi.object({
    nombre: Joi.string().min(3).max(32).required().messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 32 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
        'any.required': 'El nombre es obligatorio.',
    }),
    descripcion: Joi.string().min(4).max(255).required().messages({
        'string.base': 'La Descripcion debe ser de tipo texto.',
        'string.min': 'La Descripcion debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion no puede superar los 255 caracteres.',
        'string.empty': 'La Descripcion no puede estar vacía.',
        'any.required': 'La Descripcion es obligatoria.',
    })
});

export const categoryOptionalSchema = Joi.object({
    idCategoriaProducto: Joi.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    nombre: Joi.string().min(3).max(32).allow(null).messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 32 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
    }),
    descripcion: Joi.string().min(4).max(255).allow(null).messages({
        'string.base': 'La Descripcion debe ser de tipo texto.',
        'string.min': 'La Descripcion debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion no puede superar los 255 caracteres.',
        'string.empty': 'La Descripcion no puede estar vacía.',
    })
});