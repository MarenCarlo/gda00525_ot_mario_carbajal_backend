import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { config } from "dotenv";
config();
/**
 * Translate Import
 */
import texts from '../texts/texts';

/**
 * Extends the Request interface to include the user property
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
 * Session Token Validation
 */
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    /**
     * Is Token Received?
     */
    if (!token) return res.status(401).json({
        error_token: true,
        error_message: texts.validate_token.denied_access
    });
    const secret = process.env.TOKEN_SECRET as Secret;
    /**
     * Is TOKEN_SECRET defined?
     */
    if (!secret) {
        return res.status(500).json({
            error_token: true,
            error_message: texts.validate_token.secret_not_defined
        });
    }
    try {
        const verified = jwt.verify(token, secret) as JwtPayload;
        req.user = verified;
        next();
    } catch (error) {
        /**
         * Is Token invalid?
         */
        res.status(401).json({
            error_token: true,
            error_message: texts.validate_token.invalid_token
        })
    }
}

export default verifyToken;