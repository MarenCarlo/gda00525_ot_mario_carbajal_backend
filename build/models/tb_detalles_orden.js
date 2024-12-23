"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class DetalleOrden extends sequelize_1.Model {
}
DetalleOrden.init({
    idDetalleOrden: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    subtotal: {
        type: sequelize_1.DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
    producto_idProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Productos',
            key: 'idProducto',
        },
    },
    orden_idOrden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Ordenes',
            key: 'idOrden',
        },
    },
}, {
    sequelize: connection_1.default,
    modelName: 'DetalleOrden',
    tableName: 'tb_Detalles_Orden',
    timestamps: false,
});
exports.default = DetalleOrden;
