import { Request, Response } from 'express';
import sequelize from '../database/connection';
import { brandOptionalSchema, brandSchema } from '../shared/joiDataValidations/brandController_joi';
import MarcaProducto from '../models/tb_marcas_productos';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { isValidNumber, isValidText } from '../shared/inputTypesValidations';
import { formatText } from '../shared/formatText';
import { StoredProcedureResult } from '../models/types/promiseResultsInterfaces';
import { addBrandsBody, modifyBrandsBody } from '../models/types/brandsInterfaces';

class BrandsController {

    /**
    * Este Endpoint sirve para obtener la data de las Marcas
    */
    public async getBrands(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        try {
            const marcas: Awaited<ReturnType<typeof MarcaProducto.findAll>> | null = await MarcaProducto.findAll({
                attributes: ['idMarcaProducto', 'nombre', 'descripcion', 'fecha_creacion'],
            });
            if (marcas.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'No se encontraron marcas de productos.',
                    data: []
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Marcas obtenidas exitosamente.',
                data: marcas
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    public async addBrand(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            nombre,
            descripcion
        }: addBrandsBody = req.body || {};
        let nombreFormatted = formatText(nombre);
        const { error } = brandSchema.validate(req.body);
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
                'EXEC sp_Crear_Marca_Producto :nombre, :descripcion;',
                {
                    replacements: {
                        nombre: nombreFormatted,
                        descripcion
                    }
                }
            ) as StoredProcedureResult;
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0][0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Marca agregada exitosamente.',
                data: { nuevoID },
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este Endpoint sirve para editar la data de empresas en la APP
     */
    public async modifyBrand(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idMarcaProducto,
            nombre = null,
            descripcion = null
        }: modifyBrandsBody = req.body || {};
        let nombreFormatted: string | null = nombre;
        if (nombreFormatted !== null) {
            nombreFormatted = formatText(nombre!);
        }
        if (isValidNumber(idMarcaProducto)) {
            const { error } = brandOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Marca
                let marcaProductoDB: Awaited<ReturnType<typeof MarcaProducto.findOne>> | null = await MarcaProducto.findOne({
                    where: {
                        idMarcaProducto: idMarcaProducto
                    },
                });
                if (!marcaProductoDB) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID de Marca que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Marca_Producto :idMarcaProducto, :nombre, :descripcion;',
                    {
                        replacements: {
                            idMarcaProducto,
                            nombre: nombreFormatted,
                            descripcion
                        }
                    }
                );
                /**
                 * Respuesta del Servidor
                 */
                return res.status(201).json({
                    error: false,
                    message: 'Data de Marca modificada exitosamente.',
                    data: {},
                });
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Marca no valido.",
                data: {}
            });
        }
    }
}

export const brandsController = new BrandsController();