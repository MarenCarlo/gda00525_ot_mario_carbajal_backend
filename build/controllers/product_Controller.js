"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
class ProductController {
    /**
     * Función que Obtiene el Listado de los productos.
     */
    getProductsList(req, res) {
        let connection;
        (0, connection_1.default)()
            .then((conn) => {
            connection = conn;
            var ip = req.socket.remoteAddress;
            console.info(ip);
            const sql = `
                    SELECT
                        product.id_Product,
                        product.name_product,
                        product.url_image,
                        product.price,
                        category.id_Category,
                        category.category_Name,
                        brand.id_Brand,
                        brand.brand_Name
                    FROM
                        product
                    INNER JOIN category ON product.fk_Category = category.id_Category
                    INNER JOIN brand ON product.fk_Brand = brand.id_Brand
                    ORDER BY
                        added_date
                    DESC;
                `;
            return connection.query(sql);
        })
            .then((result) => {
            console.log('Listado de Productos Obtenidos');
            res.status(200).json({
                error: false,
                data: result,
            });
        })
            .catch((error) => {
            console.error(error);
            res.status(500).json({
                error: true,
                error_message: 'Error al obtener los productos',
            });
        });
    }
}
exports.productController = new ProductController();
