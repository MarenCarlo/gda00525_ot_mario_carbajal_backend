"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidText = exports.isValidNumber = void 0;
/**
 * Valida si un valor es un número válido, no NaN, mayor que 0 y no es null o undefined.
 */
const isValidNumber = (value) => {
    return typeof value === 'number' && !isNaN(value) && value > 0;
};
exports.isValidNumber = isValidNumber;
/**
 * Valida si un valor es un texto no vacío y no es null o undefined.
 */
const isValidText = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};
exports.isValidText = isValidText;
