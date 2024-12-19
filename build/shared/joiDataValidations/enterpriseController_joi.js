"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterpriseOptionalSchema = exports.enterpriseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de Datos ingresados por los usuarios.
 */
exports.enterpriseSchema = joi_1.default.object({
    razon_social: joi_1.default.string().min(3).max(255).required().messages({
        'string.base': 'La Razon Social debe ser de tipo texto.',
        'string.min': 'La Razon Social debe tener al menos 3 caracteres.',
        'string.max': 'La Razon Social no puede superar los 255 caracteres.',
        'string.empty': 'La Razon Social no puede estar vacía.',
        'any.required': 'La Razon Social es obligatoria.',
    }),
    nombre_comercial: joi_1.default.string().min(4).max(255).required().messages({
        'string.base': 'El nombre comercial debe ser de tipo texto.',
        'string.min': 'El nombre comercial debe tener al menos 4 caracteres.',
        'string.max': 'El nombre comercial no puede superar los 255 caracteres.',
        'string.empty': 'El nombre comercial no puede estar vacío.',
        'any.required': 'El nombre comercial es obligatorio.',
    }),
    nit: joi_1.default.string().min(8).max(12).required().messages({
        'string.base': 'El NIT debe ser de tipo texto.',
        'string.min': 'El NIT debe tener al menos 8 caracteres.',
        'string.max': 'El NIT no puede superar los 12 caracteres.',
        'string.empty': 'El NIT no puede estar vacío.',
        'any.required': 'El NIT es obligatorio.',
    }),
    telefono: joi_1.default.string().length(8).required().messages({
        'string.base': 'El Teléfono debe ser de tipo texto.',
        'string.length': 'El teléfono debe tener exactamente 8 caracteres.',
        'string.empty': 'El teléfono no puede estar vacío.',
        'any.required': 'El teléfono es obligatorio.',
    }),
    email: joi_1.default.string().email().max(128).required().messages({
        'string.base': 'El Email debe ser de tipo texto.',
        'string.email': 'El Email no es válido.',
        'string.max': 'El Email no puede superar los 128 caracteres.',
        'string.empty': 'El Email no puede estar vacío.',
        'any.required': 'El Email es obligatorio.',
    }),
});
exports.enterpriseOptionalSchema = joi_1.default.object({
    idEmpresa: joi_1.default.number().integer().min(1).messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    razon_social: joi_1.default.string().min(3).max(255).allow(null).messages({
        'string.base': 'La Razon Social debe ser de tipo texto.',
        'string.min': 'La Razon Social debe tener al menos 3 caracteres.',
        'string.max': 'La Razon Social no puede superar los 255 caracteres.',
        'string.empty': 'La Razon Social no puede estar vacía.',
    }),
    nombre_comercial: joi_1.default.string().min(4).max(255).allow(null).messages({
        'string.base': 'El nombre comercial debe ser de tipo texto.',
        'string.min': 'El nombre comercial debe tener al menos 4 caracteres.',
        'string.max': 'El nombre comercial no puede superar los 255 caracteres.',
        'string.empty': 'El nombre comercial no puede estar vacío.',
    }),
    nit: joi_1.default.string().min(8).max(12).allow(null).messages({
        'string.base': 'El NIT debe ser de tipo texto.',
        'string.min': 'El NIT debe tener al menos 8 caracteres.',
        'string.max': 'El NIT no puede superar los 12 caracteres.',
        'string.empty': 'El NIT no puede estar vacío.',
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
});
