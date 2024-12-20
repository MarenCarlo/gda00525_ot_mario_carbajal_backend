"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandOptionalSchema = exports.brandSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de Datos ingresados por los usuarios.
 */
exports.brandSchema = joi_1.default.object({
    nombre: joi_1.default.string().min(3).max(32).required().messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 32 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
        'any.required': 'El nombre es obligatorio.',
    }),
    descripcion: joi_1.default.string().min(4).max(255).required().messages({
        'string.base': 'La Descripcion debe ser de tipo texto.',
        'string.min': 'La Descripcion debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion no puede superar los 255 caracteres.',
        'string.empty': 'La Descripcion no puede estar vacía.',
        'any.required': 'La Descripcion es obligatoria.',
    })
});
exports.brandOptionalSchema = joi_1.default.object({
    idMarcaProducto: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    nombre: joi_1.default.string().min(3).max(32).allow(null).messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 32 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
    }),
    descripcion: joi_1.default.string().min(4).max(255).allow(null).messages({
        'string.base': 'La Descripcion debe ser de tipo texto.',
        'string.min': 'La Descripcion debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion no puede superar los 255 caracteres.',
        'string.empty': 'La Descripcion no puede estar vacía.',
    })
});
