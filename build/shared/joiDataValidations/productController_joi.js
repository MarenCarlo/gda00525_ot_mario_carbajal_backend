"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productStatusSchema = exports.ingressOptionalSchema = exports.ingressSchema = exports.productOptionalSchema = exports.productSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.productSchema = joi_1.default.object({
    codigo: joi_1.default.string().max(8).required().messages({
        'string.base': 'El código debe ser de tipo texto.',
        'string.max': 'El código no puede superar los 8 caracteres.',
        'string.empty': 'El código no puede estar vacío.',
        'any.required': 'El código es obligatorio.',
    }),
    nombre: joi_1.default.string().min(3).max(128).required().messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 128 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
        'any.required': 'El nombre es obligatorio.',
    }),
    descripcion: joi_1.default.string().min(4).max(128).required().messages({
        'string.base': 'La descripción debe ser de tipo texto.',
        'string.min': 'La descripción debe tener al menos 4 caracteres.',
        'string.max': 'La descripción no puede superar los 128 caracteres.',
        'string.empty': 'La descripción no puede estar vacía.',
        'any.required': 'La descripción es obligatoria.',
    }),
    categoria_idCategoria: joi_1.default.number().integer().required().messages({
        'number.base': 'La categoría debe ser un número.',
        'number.integer': 'La categoría debe ser un número entero.',
        'number.empty': 'La categoría no puede estar vacía.',
        'any.required': 'La categoría es obligatoria.',
    }),
    marca_idMarca: joi_1.default.number().integer().required().messages({
        'number.base': 'La marca debe ser un número.',
        'number.integer': 'La marca debe ser un número entero.',
        'number.empty': 'La marca no puede estar vacía.',
        'any.required': 'La marca es obligatoria.',
    }),
});
exports.productOptionalSchema = joi_1.default.object({
    idProducto: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    codigo: joi_1.default.string().max(8).allow(null).messages({
        'string.base': 'El código debe ser de tipo texto.',
        'string.max': 'El código no puede superar los 8 caracteres.',
        'string.empty': 'El código no puede estar vacío.',
    }),
    nombre: joi_1.default.string().min(3).max(128).allow(null).messages({
        'string.base': 'El nombre debe ser de tipo texto.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede superar los 128 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
    }),
    descripcion: joi_1.default.string().min(4).max(128).allow(null).messages({
        'string.base': 'La descripción debe ser de tipo texto.',
        'string.min': 'La descripción debe tener al menos 4 caracteres.',
        'string.max': 'La descripción no puede superar los 128 caracteres.',
        'string.empty': 'La descripción no puede estar vacía.',
    }),
    categoria_idCategoria: joi_1.default.number().integer().allow(null).messages({
        'number.base': 'La categoría debe ser un número.',
        'number.integer': 'La categoría debe ser un número entero.',
        'number.empty': 'La categoría no puede estar vacía.',
    }),
    marca_idMarca: joi_1.default.number().integer().allow(null).messages({
        'number.base': 'La marca debe ser un número.',
        'number.integer': 'La marca debe ser un número entero.',
        'number.empty': 'La marca no puede estar vacía.',
    }),
});
exports.ingressSchema = joi_1.default.object({
    cantidad: joi_1.default.number().integer().positive().min(1).required().messages({
        'number.base': 'La cantidad debe ser un valor numérico.',
        'number.integer': 'La cantidad debe ser un número entero.',
        'number.min': 'La cantidad debe ser mayor o igual a 1.',
        'number.positive': 'La cantidad debe ser un valor positivo.',
        'string.empty': 'La cantidad no puede estar vacía.',
        'any.required': 'La cantidad es Obligatoria.',
    }),
    precio_compra: joi_1.default.number().positive().precision(2).min(1).required().messages({
        'number.base': 'El precio de compra debe ser un número.',
        'number.positive': 'El precio de compra debe ser un valor positivo.',
        'number.empty': 'El precio de compra no puede estar vacío.',
        'number.min': 'El precio de compra debe ser al menos de 1.00.',
        'any.required': 'El precio de compra es obligatorio.',
    }),
    precio_venta: joi_1.default.number().positive().precision(2).min(1).required().messages({
        'number.base': 'El precio de venta debe ser un número.',
        'number.positive': 'El precio de venta debe ser un valor positivo.',
        'number.empty': 'El precio de venta no puede estar vacío.',
        'number.min': 'El precio de venta debe ser al menos de 1.00.',
        'any.required': 'El precio de venta es obligatorio.',
    }),
    producto_idProducto: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El ID Producto debe ser un número.',
        'number.positive': 'El ID Producto debe ser un valor positivo.',
        'number.empty': 'El ID Producto no puede estar vacío.',
        'number.min': 'El ID Producto no puede ser 0 o menor a este.',
        'any.required': 'El ID Producto es obligatorio.',
    }),
});
exports.ingressOptionalSchema = joi_1.default.object({
    idIngresoStock: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El ID  debe ser un número.',
        'number.positive': 'El ID debe ser un valor positivo.',
        'number.empty': 'El ID no puede estar vacío.',
        'number.min': 'El ID no puede ser 0 o menor a este.',
        'any.required': 'El ID es obligatorio.',
    }),
    cantidad: joi_1.default.number().integer().positive().min(1).allow(null).messages({
        'number.base': 'La cantidad debe ser un valor numérico.',
        'number.integer': 'La cantidad debe ser un número entero.',
        'number.min': 'La cantidad debe ser mayor o igual a 1.',
        'number.positive': 'La cantidad debe ser un valor positivo.',
        'string.empty': 'La cantidad no puede estar vacía.',
    }),
    precio_compra: joi_1.default.number().positive().precision(2).min(1).allow(null).messages({
        'number.base': 'El precio de compra debe ser un número.',
        'number.positive': 'El precio de compra debe ser un valor positivo.',
        'number.empty': 'El precio de compra no puede estar vacío.',
        'number.min': 'El precio de compra debe ser al menos de 1.00.',
    }),
    precio_venta: joi_1.default.number().positive().precision(2).min(1).allow(null).messages({
        'number.base': 'El precio de venta debe ser un número.',
        'number.positive': 'El precio de venta debe ser un valor positivo.',
        'number.empty': 'El precio de venta no puede estar vacío.',
        'number.min': 'El precio de venta debe ser al menos de 1.00.',
    }),
});
exports.productStatusSchema = joi_1.default.object({
    idProducto: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un valor numérico.',
        'number.integer': 'El id debe ser un número entero.',
        'number.min': 'El id debe ser mayor o igual a 1.',
        'string.empty': 'El id no puede estar vacío.',
        'any.required': 'El Identificador es Obligatorio.',
    }),
    isActive: joi_1.default.boolean().required().messages({
        'boolean.base': 'El estado debe ser un valor booleano.',
        'any.required': 'El estado es Obligatorio.',
    })
});
