import { Request, Response } from 'express';
import { categoryOptionalSchema, categorySchema } from '../shared/joiDataValidations/categoryController_joi';
import sequelize from '../database/connection';
import CategoriaProducto from '../models/tb_categorias_productos';

class CategoriesController {
    /**
        * Este Endpoint sirve para registrar nuevas empresas en la APP
        */
    public async getCategories(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
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
        } = req.body;
        let nombreFormatted;
        if (nombre !== null && nombre !== undefined) {
            nombreFormatted = nombre
                .toLowerCase()
                .split(' ')
                .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                .join(' ');
        }
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
            const result: any = await sequelize.query(
                'EXEC sp_Crear_Categoria_Producto :nombre, :descripcion;',
                {
                    replacements: {
                        nombre: nombreFormatted,
                        descripcion
                    }
                }
            );
            /**
             * Respuesta del servidor
             */
            const nuevoID = result[0].NuevoID;
            return res.status(201).json({
                error: false,
                message: 'Categoria agregada exitosamente.',
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
    public async modifyCategory(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        const {
            idCategoriaProducto,
            nombre = null,
            descripcion = null
        } = req.body;
        let nombreFormatted = null;
        if (nombre !== null && nombre !== undefined) {
            nombreFormatted = nombre
                .toLowerCase()
                .split(' ')
                .map((palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                .join(' ');
        }
        // Validacion si idCategoriaProducto no es un número o es <= 0
        if (typeof idCategoriaProducto === 'number' && !isNaN(idCategoriaProducto) && idCategoriaProducto > 0) {
            //Validacion de Data ingresada por los usuarios
            const { error } = categoryOptionalSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: error.details[0].message,
                    data: {}
                });
            }
            try {
                // Búsqueda de la existencia de la Empresa
                let categoriaProductoDB = await CategoriaProducto.findOne({
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
                // OBJETO DE DATOS MSSQL
                const replacements: any = {
                    idCategoriaProducto,
                    nombre: nombreFormatted,
                    descripcion
                };
                // Ejecucion el procedimiento almacenado
                await sequelize.query(
                    'EXEC sp_Editar_Categoria_Producto :idCategoriaProducto, :nombre, :descripcion;',
                    {
                        replacements: replacements
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
            } catch (error: any) {
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
                message: "Id de Categoría no valido.",
                data: {}
            });
        }
    }
}

export const categoriesController = new CategoriesController();