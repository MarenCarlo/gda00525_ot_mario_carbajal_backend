"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleOptionalSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de Datos ingresados por los usuarios.
 */
exports.roleOptionalSchema = joi_1.default.object({
    idRol: joi_1.default.number().integer().min(1).messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    rol: joi_1.default.string().min(3).max(32).allow(null).messages({
        'string.base': 'El rol debe ser de tipo texto.',
        'string.min': 'El rol debe tener al menos 3 caracteres.',
        'string.max': 'El rol no puede superar los 32 caracteres.',
    }),
    descripcion: joi_1.default.string().min(4).max(128).allow(null).messages({
        'string.base': 'La Descripcion del Rol debe ser de tipo texto.',
        'string.min': 'La Descripcion del Rol debe tener al menos 4 caracteres.',
        'string.max': 'La Descripcion del Rol no puede superar los 128 caracteres.',
    })
});
