"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderOptionalSchema = exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validaciones de datos para los endpoints de Ordenes.
 */
exports.orderSchema = joi_1.default.object({
    usuarioCliente_idUsuario: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'El ID del cliente debe ser un número.',
        'number.integer': 'El ID del cliente debe ser un número entero.',
        'number.positive': 'El ID del cliente debe ser mayor a 0.',
        'string.empty': 'El ID del cliente no puede estar vacío.',
        'any.required': 'El ID del cliente es obligatorio.',
    }),
    detalles: joi_1.default.array()
        .items(joi_1.default.object({
        cantidad: joi_1.default.number().integer().positive().required().messages({
            'number.base': 'La cantidad debe ser un número.',
            'number.integer': 'La cantidad debe ser un número entero.',
            'number.positive': 'La cantidad debe ser mayor a 0.',
            'string.empty': 'La cantidad no puede estar vacía.',
            'any.required': 'La cantidad es obligatoria.',
        }),
        producto_idProducto: joi_1.default.number().integer().positive().required().messages({
            'number.base': 'El ID del producto debe ser un número.',
            'number.integer': 'El ID del producto debe ser un número entero.',
            'number.positive': 'El ID del producto debe ser mayor a 0.',
            'string.empty': 'El ID del producto no puede estar vacío.',
            'any.required': 'El ID del producto es obligatorio.',
        }),
    })).min(1).required().messages({
        'array.base': 'Los detalles deben ser un arreglo.',
        'array.min': 'Debe haber al menos un producto en la orden de venta.',
        'any.required': 'Los detalles son obligatorios.',
    }),
});
exports.orderOptionalSchema = joi_1.default.object({
    idOrden: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    status_Orden: joi_1.default.number().integer().allow(null).messages({
        'number.base': 'El Estado de Orden debe ser un número.',
        'number.integer': 'El Estado de Orden debe ser un número entero.',
        'string.empty': 'El Estado de Orden no puede estar vacío.',
    }),
    isActive: joi_1.default.boolean().allow(null).messages({
        'boolean.base': 'El estado debe ser un valor booleano.',
    }),
    usuarioCliente_idUsuario: joi_1.default.number().integer().positive().allow(null).messages({
        'number.base': 'El ID del cliente debe ser un número.',
        'number.integer': 'El ID del cliente debe ser un número entero.',
        'number.positive': 'El ID del cliente debe ser mayor a 0.',
        'string.empty': 'El ID del cliente no puede estar vacío.',
    }),
    usuarioVendedor_idUsuario: joi_1.default.number().integer().positive().allow(null).messages({
        'number.base': 'El ID del vendedor debe ser un número.',
        'number.integer': 'El ID del vendedor debe ser un número entero.',
        'number.positive': 'El ID del vendedor debe ser mayor a 0.',
        'string.empty': 'El ID del vendedor no puede estar vacío.',
    }),
});
