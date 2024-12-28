import { Request, Response } from 'express';
import sequelize from '../database/connection';
import Rol from '../models/tb_roles';
import { roleOptionalSchema } from '../shared/joiDataValidations/roleController_joi';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { isValidNumber } from '../shared/inputTypesValidations';
import { formatText } from '../shared/formatText';
import { modifyRolesBody } from '../models/types/rolesInterfaces';

class RolesController {

    public async getRoles(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        try {
            const roles: Awaited<ReturnType<typeof Rol.findAll>> | null = await Rol.findAll({
                attributes: ['idRol', 'nombre', 'descripcion'],
            });
            if (roles.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'No se encontraron roles.',
                    data: []
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Roles obtenidos exitosamente.',
                data: roles
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }
    /**
     * Este Endpoint sirve para editar la data de los roles de la APP
     */
    public async modifyRole(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idRol,
            nombre = null,
            descripcion = null
        }: modifyRolesBody = req.body || {};
        let nombreFormatted: string | null = nombre;
        if (nombreFormatted !== null) {
            nombreFormatted = formatText(nombre!);
        }
        if (isValidNumber(idRol)) {
            const { error } = roleOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia del rol
                let rolDB: Awaited<ReturnType<typeof Rol.findOne>> | null = await Rol.findOne({
                    where: {
                        idRol: idRol
                    },
                });
                if (!rolDB) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID del Rol que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Rol :idRol, :nombre, :descripcion',
                    {
                        replacements: {
                            idRol,
                            nombre,
                            descripcion
                        }
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
            } catch (error) {
                return handleDatabaseError(error, res);
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