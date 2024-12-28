import { Request, Response } from 'express';
import { categoryOptionalSchema, categorySchema } from '../shared/joiDataValidations/categoryController_joi';
import sequelize from '../database/connection';
import CategoriaProducto from '../models/tb_categorias_productos';
import { handleDatabaseError } from '../shared/handleDatabaseError';
import { isValidNumber } from '../shared/inputTypesValidations';
import { formatText } from '../shared/formatText';
import { StoredProcedureResult } from '../models/types/promiseResultsInterfaces';
import { addCategoriesBody, modifyCategoriesBody } from '../models/types/categoriesInterfaces';

class CategoriesController {

    /**
     * Este Endpoint sirve para obtener la data de las Categorias
     */
    public async getCategories(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        try {
            const categories: Awaited<ReturnType<typeof CategoriaProducto.findAll>> | null = await CategoriaProducto.findAll({
                attributes: ['idCategoriaProducto', 'nombre', 'descripcion', 'fecha_creacion'],
            });
            if (categories.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'No se encontraron categorias de productos.',
                    data: []
                });
            }
            return res.status(200).json({
                error: false,
                message: 'Categorias obtenidas exitosamente.',
                data: categories
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    public async addCategory(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            nombre,
            descripcion
        }: addCategoriesBody = req.body || {};
        let nombreFormatted = formatText(nombre);
        const { error } = categorySchema.validate(req.body);
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
                'EXEC sp_Crear_Categoria_Producto :nombre, :descripcion;',
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
                message: 'Categoria agregada exitosamente.',
                data: { nuevoID },
            });
        } catch (error) {
            return handleDatabaseError(error, res);
        }
    }

    /**
     * Este Endpoint sirve para editar la data de empresas en la APP
     */
    public async modifyCategory(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idCategoriaProducto,
            nombre = null,
            descripcion = null
        }: modifyCategoriesBody = req.body || {};
        let nombreFormatted: string | null = nombre;
        if (nombreFormatted !== null) {
            nombreFormatted = formatText(nombre!);
        }
        if (isValidNumber(idCategoriaProducto)) {
            const { error } = categoryOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Categoría
                let categoriaProductoDB: Awaited<ReturnType<typeof CategoriaProducto.findOne>> | null = await CategoriaProducto.findOne({
                    where: {
                        idCategoriaProducto: idCategoriaProducto
                    },
                });
                if (!categoriaProductoDB) {
                    return res.status(403).json({
                        error: true,
                        message: "El ID de Categoría que se busca modificar, no existe en BD.",
                        data: {}
                    });
                }
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Categoria_Producto :idCategoriaProducto, :nombre, :descripcion;',
                    {
                        replacements: {
                            idCategoriaProducto,
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
                    message: 'Data de Categoría modificada exitosamente.',
                    data: {},
                });
            } catch (error) {
                return handleDatabaseError(error, res);
            }
        } else {
            return res.status(404).json({
                error: true,
                message: "Id de Categoría no valido.",
                data: {}
            });
        }
    }
}

export const categoriesController = new CategoriesController();