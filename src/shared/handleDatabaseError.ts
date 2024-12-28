import { Response } from 'express';

export const handleDatabaseError = (error: unknown, res: Response): Response => {
    /**
     * Verificación para validar error de UNIQUE.
     */
    if (
        typeof error === 'object' && error !== null &&
        'name' in error && error.name === 'SequelizeUniqueConstraintError' &&
        'errors' in error
    ) {
        const sequelizeError = error as { errors: { message: string; value: string }[] };
        const uniqueError = sequelizeError.errors[0];
        const conflictingValue = uniqueError?.value;
        if (uniqueError?.message.includes('must be unique')) {
            return res.status(409).json({
                error: true,
                message: `${conflictingValue} ya existe en BD.`,
                data: {}
            });
        }
    }
    /**
     * Manejo de Errores generales de la BD (Si es Instancia de ERROR).
     */
    if (error instanceof Error) {
        return res.status(500).json({
            error: true,
            message: 'Hay problemas al procesar la solicitud.',
            data: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            }
        });
    }
    /**
     * Manejo de Errores generales de la BD (Si No es Instancia de ERROR).
     */
    return res.status(500).json({
        error: true,
        message: 'Hay problemas al procesar la solicitud.',
        data: {
            error: String(error),
        }
    });
};