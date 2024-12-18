import { Request, Response } from 'express';
import { userSchema, userStateSchema } from '../shared/joiDataValidations/userController_joi';
import sequelize from '../database/connection';
import bcrypt from 'bcrypt';
import Usuario from '../models/tb_usuarios';

class UsersController {

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
        } = req.body;
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
            const result: any = await sequelize.query(
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
            );
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Usuario agregado exitosamente.',
                data: { nuevoID },
            });
        } catch (error: any) {
            /**
             * Condiciones de Datos Duplicados en restricciones de
             * UNIQUE
             */
            if (error.name === 'SequelizeUniqueConstraintError') {
                const uniqueError = error.errors[0];
                const conflictingValue = uniqueError?.value
                if (uniqueError?.message.includes('must be unique')) {
                    return res.status(409).json({
                        error: true,
                        message: `${conflictingValue} ya está en uso.`,
                        data: {}
                    });
                }
            }
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
        } = req.body;
        const user = req.user;

        // Validacion si idUsuario no es un número o es <= 0
        if (typeof idUsuario === 'number' && !isNaN(idUsuario) && idUsuario > 0) {
            const { error } = userStateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }

            // Validación de si el idUsuario es igual al usuario en sesión PARA CASOS DE INTENTO DE DESACTIVACION
            if (newStateValue !== undefined && newStateValue !== null && idUsuario === user!.idUsuario) {
                return res.status(404).json({
                    error: true,
                    message: "No se puede cambiar el estado del usuario de la sesión",
                    data: {}
                });
            }

            try {
                // Búsqueda de la existencia del Usuario
                let user = await Usuario.findOne({
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

                // Verificación de si el usuario es un superusuario activo PARA CASOS DE INTENTO DE DESACTIVACION
                if (newStateValue !== undefined && newStateValue !== null && user.isSuperUser === true && user.isActive === true) {
                    return res.status(403).json({
                        error: true,
                        message: "No se puede desactivar a un super usuario",
                        data: {}
                    });
                }
                // OBJETO DE DATOS MSSQL
                const replacements: any = {
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
                };
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Usuario :idUsuario, :nombre_completo, :username, :passphrase, :telefono, :email, :direccion, :fecha_nacimiento, :isSuperUser, :isActive, :rol_idRol, :empresa_idEmpresa;',
                    {
                        replacements: replacements
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
                return res.status(500).json({
                    error: true,
                    message: 'Hay problemas al procesar la solicitud.',
                    data: {
                        error
                    }
                });
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