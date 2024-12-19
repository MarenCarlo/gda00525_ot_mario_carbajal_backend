import { Request, Response } from 'express';
import { categoryOptionalSchema, categorySchema } from '../shared/joiDataValidations/categoryController_joi';
import sequelize from '../database/connection';
import CategoriaProducto from '../models/tb_categorias_productos';

class ProductsController {

    /**
    * Este Endpoint sirve para registrar nuevas empresas en la APP
    */
    public async addProduct(req: Request, res: Response) {
        const ip = req.socket.remoteAddress;
        console.info(ip);
        return res.status(200).json({
            error: true,
            message: `Producto Agregado Exitosamente.`,
            data: {}
        });
    }
}

export const productsController = new ProductsController();