/**
 * Valida si un valor es un número válido, no NaN, mayor que 0 y no es null o undefined.
 */
export const isValidNumber = (value: number): boolean => {
    return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Valida si un valor es un texto no vacío y no es null o undefined.
 */
export const isValidText = (value: string): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
};