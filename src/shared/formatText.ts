import { isValidText } from "./inputTypesValidations";

/**
 * Función que se encarga de formatear textos:
 * 
 * Con la primer letra de cada palabra como mayuscula
 * y el resto como minusculas.
 * 
 * Tambien elimina espacios o simbolos al inicio o final de
 * la frase.
 */
export const formatText = (value: string): string | null => {
    if (isValidText(value)) {
        value = value.trim().replace(/^[^\w]+|[^\w]+$/g, '');
        return value
            .toLowerCase()
            .split(' ')
            .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }
    return null;
};