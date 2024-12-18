import Joi from "joi";

/**
 * Validaciones de Datos ingresados por los usuarios.
 */
const authSchema = Joi.object({
    username: Joi.string().min(4).max(64).required().messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 64 caracteres.',
        'any.required': 'El nombre de usuario es obligatorio.',
    }),
    passphrase: Joi.string().min(8).max(255).required().messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
        'any.required': 'La contraseña es obligatoria.',
    }),
});

export default authSchema;