import Joi from "joi";

/**
 * Validaciones de Datos ingresados por los usuarios.
 */
export const userSchema = Joi.object({
    nombre_completo: Joi.string().min(3).max(255).required().messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
        'any.required': 'El nombre completo es obligatorio.',
    }),
    username: Joi.string().min(4).max(32).pattern(/^\S*$/).required().messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.pattern.base': 'El Nombre de usuario no debe contener espacios',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 32 caracteres.',
        'any.required': 'El nombre de usuario es obligatorio.',
    }),
    passphrase: Joi.string().min(8).max(255).required().messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
        'any.required': 'La contraseña es obligatoria.',
    }),
    repeat_passphrase: Joi.string().valid(Joi.ref('passphrase')).required()
        .messages({
            'any.only': 'La contraseña no coincide.'
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
    direccion: Joi.string().min(5).max(255).required().messages({
        'string.base': 'La dirección debe ser de tipo texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 255 caracteres.',
        'any.required': 'La dirección es obligatoria.',
    }),
    fecha_nacimiento: Joi.date().allow(null).messages({
        'date.base': 'La fecha de nacimiento no es válida.',
    }),
    isSuperUser: Joi.boolean().default(false).messages({
        'boolean.base': 'El campo Superusuario debe ser un valor booleano.',
    }),
    isActive: Joi.boolean().default(false).messages({
        'boolean.base': 'El campo Activo debe ser un valor booleano.',
    }),
    rol_idRol: Joi.number().integer().min(1).required().messages({
        'number.base': 'El rol debe ser un número.',
        'number.integer': 'El rol debe ser un número entero.',
        'number.min': 'El rol debe ser al menos 1.',
        'any.required': 'El rol es obligatorio.',
    }),
    empresa_idEmpresa: Joi.number().integer().min(1).required().messages({
        'number.base': 'La empresa debe ser un número.',
        'number.integer': 'La empresa debe ser un número entero.',
        'number.min': 'La empresa debe ser al menos 1.',
        'any.required': 'La empresa es obligatoria.',
    }),
});

export const userStateSchema = Joi.object({
    idUsuario: Joi.number().integer().min(1).messages({
        'number.base': 'El campo idUsuario debe ser un valor numérico.',
        'number.integer': 'El campo idUsuario debe ser un número entero.',
        'number.min': 'El campo idUsuario debe ser mayor o igual a 1.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    nombre_completo: Joi.string().min(3).max(255).allow(null).messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
    }),
    username: Joi.string().min(4).max(32).pattern(/^\S*$/).allow(null).messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.pattern.base': 'El Nombre de usuario no debe contener espacios',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 32 caracteres.',
    }),
    passphrase: Joi.string().min(8).max(255).allow(null).messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
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
    direccion: Joi.string().min(5).max(255).allow(null).messages({
        'string.base': 'La dirección debe ser de tipo texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 255 caracteres.',
    }),
    fecha_nacimiento: Joi.date().allow(null).messages({
        'date.base': 'La fecha de nacimiento no es válida.',
    }),
    newStateValue: Joi.boolean().allow(null).messages({
        'boolean.base': 'El estado debe ser un valor booleano.',
    })
});