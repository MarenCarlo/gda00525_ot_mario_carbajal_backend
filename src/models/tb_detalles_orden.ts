import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class DetalleOrden extends Model {
    public idDetalleOrden!: number;
    public cantidad!: number;
    public subtotal!: number;
    public producto_idProducto!: number;
    public orden_idOrden!: number;
}

DetalleOrden.init({
    idDetalleOrden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(9, 2),
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
    orden_idOrden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Ordenes',
            key: 'idOrden',
        },
    },
}, {
    sequelize,
    modelName: 'DetalleOrden',
    tableName: 'tb_Detalles_Orden',
    timestamps: false,
});

export default DetalleOrden;