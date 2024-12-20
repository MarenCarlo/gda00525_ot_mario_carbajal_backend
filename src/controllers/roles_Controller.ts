import { Request, Response } from 'express';
import sequelize from '../database/connection';
import Rol from '../models/tb_roles';
import { roleOptionalSchema } from '../shared/joiDataValidations/roleController_joi';

class RolesController {

    /**
     * Este Endpoint sirve para editar la data de los roles de la APP
     */
    public async modifyRole(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idRol,
            rol = null,
            descripcion = null
        } = req.body;

        // Validacion si idRol no es un número o es <= 0
        if (typeof idRol === 'number' && !isNaN(idRol) && idRol > 0) {
            //Validacion de Data ingresada por los usuarios
            const { error } = roleOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Empresa
                let empresa = await Rol.findOne({
                    where: {
                        idRol: idRol
                    },
                });
                if (!empresa) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID del Rol que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }
                // OBJETO DE DATOS MSSQL
                const replacements: any = {
                    idRol,
                    rol,
                    descripcion
                };
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Rol :idRol, :rol, :descripcion',
                    {
                        replacements: replacements
                    }
                );
                /**
                 * Respuesta del Servidor
                 */
                return res.status(201).json({
                    error: false,
                    message: 'Data de Rol Modificada exitosamente.',
                    data: {},
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
                            message: `${conflictingValue} ya existe en DB.`,
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
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Rol no valido.",
                data: {}
            });
        }
    }
}

export const rolesController = new RolesController();