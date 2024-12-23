import { Request, Response } from 'express';
import { enterpriseOptionalSchema, enterpriseSchema } from '../shared/joiDataValidations/enterpriseController_joi';
import sequelize from '../database/connection';
import Empresa from '../models/tb_empresas';

class EnterprisesController {

    /**
    * Este Endpoint sirve para obtener empresas o una sola
    */
    public async getEnterprises(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const { idEmpresa } = req.params;
        try {
            if (idEmpresa) {
                if (typeof idEmpresa === 'number' && !isNaN(idEmpresa) && idEmpresa > 0) {
                    return res.status(400).json({
                        error: true,
                        message: 'El ID de empresa no es válido.',
                        data: {}
                    });
                }
                const empresa = await Empresa.findOne({
                    where: { idEmpresa: Number(idEmpresa) }
                });
                if (!empresa) {
                    return res.status(404).json({
                        error: true,
                        message: 'La empresa no existe en DB.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Empresa obtenida exitosamente.',
                    data: empresa
                });
            } else {
                const empresas = await Empresa.findAll();
                if (!empresas || empresas.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: 'No se encontraron empresas.',
                        data: {}
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: 'Empresas obtenidas exitosamente.',
                    data: empresas
                });
            }
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                message: 'Hubo un error al obtener las empresas.',
                data: {
                    error
                }
            });
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
        } = req.body;
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
            const result: any = await sequelize.query(
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
            );
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0][0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Empresa agregada exitosamente.',
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
                        message: `${conflictingValue} ya existe en BD.`,
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
        } = req.body;

        // Validacion si idEmpresa no es un número o es <= 0
        if (typeof idEmpresa === 'number' && !isNaN(idEmpresa) && idEmpresa > 0) {
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
                let empresa = await Empresa.findOne({
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
                // OBJETO DE DATOS MSSQL
                const replacements: any = {
                    idEmpresa,
                    razon_social,
                    nombre_comercial,
                    nit,
                    telefono,
                    email
                };
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Empresa :idEmpresa, :razon_social, :nombre_comercial, :nit, :telefono, :email',
                    {
                        replacements: replacements
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
                message: "Id de Empresa no valido.",
                data: {}
            });
        }
    }
}

export const enterprisesController = new EnterprisesController();