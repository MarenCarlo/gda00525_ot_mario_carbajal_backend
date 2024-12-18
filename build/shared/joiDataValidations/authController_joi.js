"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de Datos ingresados por los usuarios.
 */
const authSchema = joi_1.default.object({
    username: joi_1.default.string().min(4).max(64).required().messages({
        'string.base': 'El nombre de usuario debe ser de tipo texto.',
        'string.min': 'El nombre de usuario debe tener al menos 4 caracteres.',
        'string.max': 'El nombre de usuario no puede superar los 64 caracteres.',
        'any.required': 'El nombre de usuario es obligatorio.',
    }),
    passphrase: joi_1.default.string().min(8).max(255).required().messages({
        'string.base': 'La contraseña debe ser de tipo texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 255 caracteres.',
        'any.required': 'La contraseña es obligatoria.',
    }),
});
exports.default = authSchema;
