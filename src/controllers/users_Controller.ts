import { Request, Response } from 'express';
import { userSchema, userStateSchema } from '../shared/joiDataValidations/userController_joi';
import sequelize from '../database/connection';
import bcrypt from 'bcrypt';
import Usuario from '../models/tb_usuarios';
import { isValidNumber } from '../shared/inputTypesValidations';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { AddUsuario, modifyUsuario } from '../models/types/usersInterfaces';
import { StoredProcedureResult } from '../models/types/promiseResultsInterfaces';

class UsersController {

    /**
    * Este Endpoint sirve para obtener usuarios o uno solo
    */
    public async getUsers(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const { idUsuario } = req.params;
        let idUsuarioParsed = Number(idUsuario);
        try {
            let query = 'SELECT * FROM vw_Usuarios';
            if (idUsuario) {
                if (isValidNumber(idUsuarioParsed)) {
                    query += ` WHERE idUsuario = ${Number(idUsuario)}`;
                } else {
                    return res.status(400).json({
                        error: true,
                        message: 'El ID de usuario no es válido.',
                        data: {}
                    });
                }
            }
            const usuarios = await sequelize.query(query, {
                type: 'SELECT'
            });
            if (!usuarios) {
                return res.status(404).json({
                    error: true,
                    message: 'No se encontraron usuarios.',
                    data: {}
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Usuarios obtenidos exitosamente.',
                data: usuarios
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }


    /**
    * Este Endpoint sirve para registrar a nuevos usuarios en la APP
    */
    public async addUser(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            nombre_completo,
            username,
            passphrase,
            repeat_passphrase,
            telefono,
            email,
            direccion,
            fecha_nacimiento,
            rol_idRol,
            empresa_idEmpresa,
            isSuperUser = 0,
            isActive = 0,
        }: AddUsuario = req.body || {};
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                data: {}
            });
        }
        try {
            /**
             * Encriptación de Contraseñas de Usuarios
             */
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(passphrase, salt);
            /**
             * Ejecucion del Procedimiento Almacenado
             */
            const result = await sequelize.query(
                'EXEC sp_Crear_Usuario :nombre_completo, :username, :passphrase, :telefono, :email, :direccion, :fecha_nacimiento, :isSuperUser, :isActive, :rol_idRol, :empresa_idEmpresa',
                {
                    replacements: {
                        nombre_completo,
                        username,
                        passphrase: hashedPass,
                        telefono,
                        email,
                        direccion,
                        fecha_nacimiento,
                        isSuperUser,
                        isActive,
                        rol_idRol,
                        empresa_idEmpresa,
                    }
                }
            ) as StoredProcedureResult;
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0][0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Usuario agregado exitosamente.',
                data: { nuevoID },
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este Endpoint sirve para editar data de usuarios registrados en la APP
     */
    public async modifyUser(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idUsuario,
            newStateValue = null,
            nombre_completo = null,
            username = null,
            passphrase = null,
            telefono = null,
            email = null,
            direccion = null,
            fecha_nacimiento = null,
            rol_idRol = null,
            empresa_idEmpresa = null
        }: modifyUsuario = req.body || {};
        const user = req.user;
        // Validacion si idUsuario no es un número o es <= 0
        if (isValidNumber(idUsuario)) {
            const { error } = userStateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }

            // Validación de si el idUsuario es igual al usuario en sesión PARA CASOS DE INTENTO DE DESACTIVACION DEL PROPIO USUARIO
            if (newStateValue !== undefined && newStateValue !== null && idUsuario === user!.idUsuario) {
                return res.status(404).json({
                    error: true,
                    message: "No se puede cambiar el estado del usuario de la sesión",
                    data: {}
                });
            }

            try {
                // Búsqueda de la existencia del Usuario
                let user: Usuario | null = await Usuario.findOne({
                    where: {
                        idUsuario: idUsuario
                    },
                });

                if (!user) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID de Usuario que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }

                // Verificación de si el usuario es un superusuario activo PARA CASOS DE INTENTO DE DESACTIVACION DE SUPER USUARIO
                if (newStateValue !== undefined && newStateValue !== null && user.isSuperUser === true && user.isActive === true) {
                    return res.status(403).json({
                        error: true,
                        message: "No se puede desactivar a un super usuario",
                        data: {}
                    });
                }

                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Usuario :idUsuario, :nombre_completo, :username, :passphrase, :telefono, :email, :direccion, :fecha_nacimiento, :isSuperUser, :isActive, :rol_idRol, :empresa_idEmpresa;',
                    {
                        replacements: {
                            idUsuario: idUsuario,
                            nombre_completo: nombre_completo,
                            username: username,
                            passphrase: null,
                            telefono: telefono,
                            email: email,
                            direccion: direccion,
                            fecha_nacimiento: fecha_nacimiento,
                            isSuperUser: null,
                            isActive: newStateValue,
                            rol_idRol: rol_idRol,
                            empresa_idEmpresa: empresa_idEmpresa
                        }
                    }
                );
                /**
                 * Respuesta del Servidor
                 */
                return res.status(201).json({
                    error: false,
                    message: 'Data de Usuario Modificada exitosamente.',
                    data: {},
                });

            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Usuario no valido.",
                data: {}
            });
        }
    }
}

export const usersController = new UsersController();