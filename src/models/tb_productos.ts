import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';
import MarcaProducto from './tb_marcas_productos';
import CategoriaProducto from './tb_categorias_productos';

class Producto extends Model {
    public idProducto!: number;
    public codigo!: string;
    public nombre!: string;
    public descripcion!: string;
    public precio_compra!: number;
    public precio_venta!: number;
    public fecha_creacion!: Date;
    public stock!: number;
    public imagen!: Buffer;
    public isActive!: boolean;
    public categoria_idCategoria!: number;
    public marca_idMarca!: number;
}

Producto.init({
    idProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    codigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    precio_compra: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
    },
    precio_venta: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    categoria_idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Categorias_Productos',
            key: 'idCategoriaProducto',
        },
    },
    marca_idMarca: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Marcas_Productos',
            key: 'idMarcaProducto',
        },
    },
}, {
    sequelize,
    modelName: 'Producto',
    tableName: 'tb_Productos',
    timestamps: false,
});

/**
 * Relaciones entre modelos
 */
Producto.belongsTo(CategoriaProducto, { foreignKey: 'categoria_idCategoria', as: 'categoria' });
Producto.belongsTo(MarcaProducto, { foreignKey: 'marca_idMarca', as: 'marca' });

export default Producto;