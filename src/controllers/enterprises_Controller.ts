import { Request, Response } from 'express';
import { enterpriseOptionalSchema, enterpriseSchema } from '../shared/joiDataValidations/enterpriseController_joi';
import sequelize from '../database/connection';
import Empresa from '../models/tb_empresas';
import { isValidNumber } from '../shared/inputTypesValidations';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { StoredProcedureResult } from '../models/types/promiseResultsInterfaces';
import { addEnterpriseBody, modifyEnterpriseBody } from '../models/types/enterprisesInterfaces';

class EnterprisesController {

    /**
    * Este Endpoint sirve para obtener empresas o una sola
    */
    public async getEnterprises(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const { idEmpresa } = req.params;
        let idEmpresaParsed = Number(idEmpresa);
        try {
            if (idEmpresaParsed) {
                if (isValidNumber(idEmpresaParsed)) {
                    const empresaDB: Awaited<ReturnType<typeof Empresa.findOne>> | null = await Empresa.findOne({
                        where: { idEmpresa: idEmpresaParsed }
                    });
                    if (!empresaDB) {
                        return res.status(404).json({
                            error: true,
                            message: 'La empresa no existe en DB.',
                            data: {}
                        });
                    }
                    return res.status(200).json({
                        error: false,
                        message: 'Empresa obtenida exitosamente.',
                        data: empresaDB
                    });
                } else {
                    return res.status(400).json({
                        error: true,
                        message: 'El ID de empresa no es válido.',
                        data: { idEmpresaParsed }
                    });
                }
            } else {
                const empresasDB: Awaited<ReturnType<typeof Empresa.findAll>> = await Empresa.findAll();
                if (!empresasDB || empresasDB.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron empresas.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Empresas obtenidas exitosamente.',
                    data: empresasDB
                });
            }
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    public async addEnterprise(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            razon_social,
            nombre_comercial,
            nit,
            telefono,
            email
        }: addEnterpriseBody = req.body || {};
        const { error } = enterpriseSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                data: {}
            });
        }
        try {
            /**
             * Ejecucion del Procedimiento Almacenado
             */
            const result = await sequelize.query(
                'EXEC sp_Crear_Empresa :razon_social, :nombre_comercial, :nit, :telefono, :email',
                {
                    replacements: {
                        razon_social,
                        nombre_comercial,
                        nit,
                        telefono,
                        email
                    }
                }
            ) as StoredProcedureResult;
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0][0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Empresa agregada exitosamente.',
                data: { nuevoID },
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este Endpoint sirve para editar la data de empresas en la APP
     */
    public async modifyEnterprise(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idEmpresa,
            razon_social = null,
            nombre_comercial = null,
            nit = null,
            telefono = null,
            email = null
        }: modifyEnterpriseBody = req.body || {};
        if (isValidNumber(idEmpresa)) {
            //Validacion de Data ingresada por los usuarios
            const { error } = enterpriseOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Empresa
                let empresa: Awaited<ReturnType<typeof Empresa.findOne>> = await Empresa.findOne({
                    where: {
                        idEmpresa: idEmpresa
                    },
                });
                if (!empresa) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID de Empresa que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Empresa :idEmpresa, :razon_social, :nombre_comercial, :nit, :telefono, :email',
                    {
                        replacements: {
                            idEmpresa,
                            razon_social,
                            nombre_comercial,
                            nit,
                            telefono,
                            email
                        }
                    }
                );
                /**
                 * Respuesta del Servidor
                 */
                return res.status(201).json({
                    error: false,
                    message: 'Data de Empresa Modificada exitosamente.',
                    data: {},
                });
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Empresa no valido.",
                data: {}
            });
        }
    }
}

export const enterprisesController = new EnterprisesController();