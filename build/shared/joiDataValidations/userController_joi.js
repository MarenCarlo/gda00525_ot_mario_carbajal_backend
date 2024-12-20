"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStateSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de Datos ingresados por los usuarios.
 */
exports.userSchema = joi_1.default.object({
    nombre_completo: joi_1.default.string().min(3).max(255).required().messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
        'string.empty': 'El nombre completo no puede estar vacío.',
        'any.required': 'El nombre completo es obligatorio.',
    }),
    username: joi_1.default.string().min(4).max(32).pattern(/^\S*$/).required().messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.pattern.base': 'El Nombre de usuario no debe contener espacios',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 32 caracteres.',
        'string.empty': 'El nombre de usuario no puede estar vacío.',
        'any.required': 'El nombre de usuario es obligatorio.',
    }),
    passphrase: joi_1.default.string().min(8).max(255).required().messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
        'string.empty': 'La Contraseña no puede estar vacía.',
        'any.required': 'La contraseña es obligatoria.',
    }),
    repeat_passphrase: joi_1.default.string().valid(joi_1.default.ref('passphrase')).required()
        .messages({
        'any.only': 'La contraseña no coincide.'
    }),
    telefono: joi_1.default.string().length(8).required().messages({
        'string.base': 'El Teléfono debe ser de tipo texto.',
        'string.length': 'El teléfono debe tener exactamente 8 caracteres.',
        'string.empty': 'El Teléfono no puede estar vacío.',
        'any.required': 'El teléfono es obligatorio.',
    }),
    email: joi_1.default.string().email().max(128).required().messages({
        'string.base': 'El Email debe ser de tipo texto.',
        'string.email': 'El Email no es válido.',
        'string.max': 'El Email no puede superar los 128 caracteres.',
        'string.empty': 'El Email no puede estar vacío.',
        'any.required': 'El Email es obligatorio.',
    }),
    direccion: joi_1.default.string().min(5).max(255).required().messages({
        'string.base': 'La dirección debe ser de tipo texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 255 caracteres.',
        'string.empty': 'La dirección no puede estar vacía.',
        'any.required': 'La dirección es obligatoria.',
    }),
    fecha_nacimiento: joi_1.default.date().allow(null).messages({
        'date.base': 'La fecha de nacimiento no es válida.',
    }),
    isSuperUser: joi_1.default.boolean().default(false).messages({
        'boolean.base': 'El campo Superusuario debe ser un valor booleano.',
    }),
    isActive: joi_1.default.boolean().default(false).messages({
        'boolean.base': 'El campo Activo debe ser un valor booleano.',
    }),
    rol_idRol: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El rol debe ser un número.',
        'number.integer': 'El rol debe ser un número entero.',
        'number.min': 'El rol debe ser al menos 1.',
        'any.required': 'El rol es obligatorio.',
    }),
    empresa_idEmpresa: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'La empresa debe ser un número.',
        'number.integer': 'La empresa debe ser un número entero.',
        'number.min': 'La empresa debe ser al menos 1.',
        'any.required': 'La empresa es obligatoria.',
    }),
});
exports.userStateSchema = joi_1.default.object({
    idUsuario: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    nombre_completo: joi_1.default.string().min(3).max(255).allow(null).messages({
        'string.base': 'El nombre completo debe ser de tipo texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede superar los 255 caracteres.',
        'string.empty': 'El nombre completo no puede estar vacío.',
    }),
    username: joi_1.default.string().min(4).max(32).pattern(/^\S*$/).allow(null).messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.pattern.base': 'El Nombre de usuario no debe contener espacios',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 32 caracteres.',
        'string.empty': 'El nombr de usuario no puede estar vacío.',
    }),
    passphrase: joi_1.default.string().min(8).max(255).allow(null).messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
        'string.empty': 'La contraseña no puede estar vacía.',
    }),
    telefono: joi_1.default.string().length(8).allow(null).messages({
        'string.base': 'El Teléfono debe ser de tipo texto.',
        'string.length': 'El teléfono debe tener exactamente 8 caracteres.',
        'string.empty': 'El teléfono no puede estar vacío.',
    }),
    email: joi_1.default.string().email().max(128).allow(null).messages({
        'string.base': 'El Email debe ser de tipo texto.',
        'string.email': 'El Email no es válido.',
        'string.max': 'El Email no puede superar los 128 caracteres.',
        'string.empty': 'El Email no puede estar vacío.',
    }),
    direccion: joi_1.default.string().min(5).max(255).allow(null).messages({
        'string.base': 'La dirección debe ser de tipo texto.',
        'string.min': 'La dirección debe tener al menos 5 caracteres.',
        'string.max': 'La dirección no puede superar los 255 caracteres.',
        'string.empty': 'La dirección no puede estar vacía.',
    }),
    fecha_nacimiento: joi_1.default.date().allow(null).messages({
        'date.base': 'La fecha de nacimiento no es válida.',
        'string.empty': 'La fecha de nacimiento no puede estar vacía.',
    }),
    newStateValue: joi_1.default.boolean().allow(null).messages({
        'boolean.base': 'El estado debe ser un valor booleano.',
    })
});
