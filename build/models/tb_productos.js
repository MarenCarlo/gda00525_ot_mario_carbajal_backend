"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const tb_marcas_productos_1 = __importDefault(require("./tb_marcas_productos"));
const tb_categorias_productos_1 = __importDefault(require("./tb_categorias_productos"));
class Producto extends sequelize_1.Model {
}
Producto.init({
    idProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    precio_compra: {
        type: sequelize_1.DataTypes.DECIMAL(7, 2),
        allowNull: true,
    },
    precio_venta: {
        type: sequelize_1.DataTypes.DECIMAL(7, 2),
        allowNull: true,
    },
    fecha_creacion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    categoria_idCategoria: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Categorias_Productos',
            key: 'idCategoriaProducto',
        },
    },
    marca_idMarca: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Marcas_Productos',
            key: 'idMarcaProducto',
        },
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Producto',
    tableName: 'tb_Productos',
    timestamps: false,
});
/**
 * Relaciones entre modelos
 */
Producto.belongsTo(tb_categorias_productos_1.default, { foreignKey: 'categoria_idCategoria', as: 'categoria' });
Producto.belongsTo(tb_marcas_productos_1.default, { foreignKey: 'marca_idMarca', as: 'marca' });
exports.default = Producto;
