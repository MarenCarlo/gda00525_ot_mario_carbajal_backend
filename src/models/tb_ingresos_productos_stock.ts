import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class IngresoProductoStock extends Model {
    public idIngresoStock!: number;
    public cantidad!: number;
    public precio_compra!: number;
    public precio_venta!: number;
    public fecha_creacion!: Date;
    public producto_idProducto!: number;
}

IngresoProductoStock.init({
    idIngresoStock: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
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
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    producto_idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Productos',
            key: 'idProducto',
        },
    },
}, {
    sequelize,
    modelName: 'IngresoProductoStock',
    tableName: 'tb_Ingresos_Productos_Stock',
    timestamps: false,
});

export default IngresoProductoStock;