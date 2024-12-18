import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { config } from "dotenv";
config();

/**
 * Extiende la interface de Request para que acepte la propiedad user
 */
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * MIDDLEWARE
 * 
 * Validacion del token de Sesión
 */
const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    /**
     * Se recibe token?
     */
    if (!token) return res.status(401).json({
        error_token: true,
        message: 'Acceso Denegado.'
    });
    const secret = process.env.TOKEN_SECRET as Secret;
    /**
     * Esta TOKEN_SECRET definida en las variables de entorno?
     */
    if (!secret) {
        return res.status(500).json({
            error_token: true,
            message: 'La clave secreta no está definida.'
        });
    }
    try {
        const verified = jwt.verify(token, secret) as JwtPayload;
        /**
         * Objeto con datos del usuario 
         * seteado en la request segun el token de sesión recibido
         */
        req.user = verified;
        next();
    } catch (error) {
        /**
         * El token es invalido?
         */
        return res.status(401).json({
            error_token: true,
            error_message: 'Esta sesión no es valida o ha caducado.'
        })
    }
}

export default validateToken;