import Joi from "joi";

/**
 * Validaciones de Datos ingresados por los usuarios.
 */
export const enterpriseSchema = Joi.object({
    razon_social: Joi.string().min(3).max(255).required().messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
        'any.required': 'El nombre completo es obligatorio.',
    }),
    nombre_comercial: Joi.string().min(4).max(255).required().messages({
        'string.base': 'El nombre comercial debe ser de tipo texto.',
        'string.min': 'El nombre comercial debe tener al menos 4 caracteres.',
        'string.max': 'El nombre comercial no puede superar los 255 caracteres.',
        'any.required': 'El nombre comercial es obligatorio.',
    }),
    nit: Joi.string().min(8).max(12).required().messages({
        'string.base': 'El NIT debe ser de tipo texto.',
        'string.min': 'El NIT debe tener al menos 8 caracteres.',
        'string.max': 'El NIT no puede superar los 12 caracteres.',
        'any.required': 'El NIT es obligatorio.',
    }),
    telefono: Joi.string().length(8).required().messages({
        'string.base': 'El Teléfono debe ser de tipo texto.',
        'string.length': 'El teléfono debe tener exactamente 8 caracteres.',
        'any.required': 'El teléfono es obligatorio.',
    }),
    email: Joi.string().email().max(128).required().messages({
        'string.base': 'El Email debe ser de tipo texto.',
        'string.email': 'El correo electrónico no es válido.',
        'string.max': 'El correo electrónico no puede superar los 128 caracteres.',
        'any.required': 'El correo electrónico es obligatorio.',
    }),
});

export const enterpriseOptionalSchema = Joi.object({
    idEmpresa: Joi.number().integer().min(1).messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    razon_social: Joi.string().min(3).max(255).allow(null).messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
    }),
    nombre_comercial: Joi.string().min(4).max(255).allow(null).messages({
        'string.base': 'El nombre comercial debe ser de tipo texto.',
        'string.min': 'El nombre comercial debe tener al menos 4 caracteres.',
        'string.max': 'El nombre comercial no puede superar los 255 caracteres.',
    }),
    nit: Joi.string().min(8).max(12).allow(null).messages({
        'string.base': 'El NIT debe ser de tipo texto.',
        'string.min': 'El NIT debe tener al menos 8 caracteres.',
        'string.max': 'El NIT no puede superar los 12 caracteres.',
    }),
    telefono: Joi.string().length(8).allow(null).messages({
        'string.base': 'El Teléfono debe ser de tipo texto.',
        'string.length': 'El teléfono debe tener exactamente 8 caracteres.',
    }),
    email: Joi.string().email().max(128).allow(null).messages({
        'string.base': 'El Email debe ser de tipo texto.',
        'string.email': 'El correo electrónico no es válido.',
        'string.max': 'El correo electrónico no puede superar los 128 caracteres.',
    }),
});