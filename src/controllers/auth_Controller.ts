import { Request, Response } from 'express';
import authSchema from '../shared/joiDataValidations/authController_joi';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from "dotenv";
import { WhereOptions } from 'sequelize';
import Usuario from '../models/tb_usuarios';
import Empresa from '../models/tb_empresas';
import Rol from '../models/tb_roles';
config();

interface UserData {
    idUsuario: number;
    nombre_completo: string;
    username: string;
    passphrase: string;
    telefono: string;
    email: string;
    direccion: string;
    fecha_nacimiento: string;
    fecha_creacion: string
    isSuperUser: boolean;
    isActive: boolean;
    rol_idRol: number;
    empresa_idEmpresa: number;
    rol: RolData,
    empresa: EmpresaData
}

interface RolData {
    idRol: number,
    rol: string
}

interface EmpresaData {
    idEmpresa: number,
    nombre_comercial: string
}

class AuthController {

    /**
    * Este Endpoint sirve para iniciar un nuevo token de sesión en la APP
    */
    public async authUser(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            username,
            passphrase
        } = req.body;
        /**
         * Validacion de Data de Formularios
         */
        const { error } = authSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                data: {}
            });
        }
        try {
            /**
             * Busqueda de Usuario por Username o Email
             */
            const findUser = async (condition: WhereOptions<UserData>) => {
                const result = await Usuario.findOne({
                    where: condition,
                    include: [
                        {
                            model: Rol,
                            as: 'rol',
                            attributes: ['idRol', 'nombre'],
                        },
                        {
                            model: Empresa,
                            as: 'empresa',
                            attributes: ['idEmpresa', 'nombre_comercial'],
                        }
                    ]
                });
                return result ? result.toJSON() as UserData : null;
            };
            // Intentar búsqueda por username o email
            let user = await findUser({ username: username });
            if (!user) user = await findUser({ email: username });

            // Validar si no se encontró usuario
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: 'No se encontró ningún usuario con ese Username o Email.',
                    data: {}
                });
            }

            /**
             * Validacion de usuario activo
             */
            if (!user.isActive) {
                return res.status(401).json({
                    error: true,
                    message: 'Este usuario ha sido desactivado por un administrador',
                    data: {}
                });
            }

            /**
             * Validacion de Hash de contraseña
             */
            const validPassword = bcrypt.compareSync(passphrase, user.passphrase!);
            if (!validPassword) {
                return res.status(401).json({
                    error: true,
                    message: 'Contraseña incorrecta.',
                    data: {}
                });
            }

            if (!process.env.TOKEN_SECRET) {
                console.error('Secret Sign no esta definido en las variables de entorno');
                throw new Error('Secret Sign no esta definido en las variables de entorno');
            }

            /**
             * Construccion de JWT
             */
            const token = jwt.sign({
                idUsuario: user.idUsuario,
                username: user.username,
                nombreUsuario: user.nombre_completo,
                isSuperUser: user.isSuperUser,
                isActive: user.isActive,
                rol: user.rol,
                empresa: user.empresa
            }, process.env.TOKEN_SECRET as Secret, {
                expiresIn: '24h'
            });

            /**
             * Objeto de Inicio de Sesion
             */
            return res.status(202).header('auth-token', token).json({
                error: false,
                message: 'Sesión iniciada.',
                data: {
                    'auth-token': token
                },
            });
        } catch (error: unknown) {
            /**
             * Manejo de Errores generales de la BD.
             */
            return res.status(500).json({
                error: true,
                message: 'Hay problemas al procesar la solicitud.',
                data: {
                    error
                }
            });
        }
    }
}

export const authController = new AuthController();