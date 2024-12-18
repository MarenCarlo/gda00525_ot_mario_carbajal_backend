import { NextFunction, Request, Response } from 'express';

/**
 * MIDDLEWARE
 * 
 * Validacion de usuario Admin o Vendedor
 */
const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user!.rol.idRol === 1) {
        next();
    } else {
        return res.status(401).json({
            error_token: true,
            error_message: 'No tiene los permisos suficientes para realizar esta acción.'
        })
    }
}

export default validateAdmin;