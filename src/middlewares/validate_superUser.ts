import { NextFunction, Request, Response } from 'express';

/**
 * MIDDLEWARE
 * 
 * Validacion de usuario con rol de Administrador
 */
const validateSuperUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user!.isSuperUser === true) {
        next();
    } else {
        return res.status(401).json({
            error: true,
            message: 'Se requiere tener permisos mayores para llevar a cabo esta acción.',
            data: {}
        })
    }
}

export default validateSuperUser;