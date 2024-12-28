"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatText = void 0;
const inputTypesValidations_1 = require("./inputTypesValidations");
/**
 * Función que se encarga de formatear textos:
 *
 * Con la primer letra de cada palabra como mayuscula
 * y el resto como minusculas.
 *
 * Tambien elimina espacios o simbolos al inicio o final de
 * la frase.
 */
const formatText = (value) => {
    if ((0, inputTypesValidations_1.isValidText)(value)) {
        value = value.trim().replace(/^[^\w]+|[^\w]+$/g, '');
        return value
            .toLowerCase()
            .split(' ')
            .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }
    return null;
};
exports.formatText = formatText;
