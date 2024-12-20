"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class IngresoProductoStock extends sequelize_1.Model {
}
IngresoProductoStock.init({
    idIngresoStock: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    precio_compra: {
        type: sequelize_1.DataTypes.DECIMAL(7, 2),
        allowNull: false,
    },
    precio_venta: {
        type: sequelize_1.DataTypes.DECIMAL(7, 2),
        allowNull: false,
    },
    fecha_creacion: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
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
}, {
    sequelize: connection_1.default,
    modelName: 'IngresoProductoStock',
    tableName: 'tb_Ingresos_Productos_Stock',
    timestamps: false,
});
exports.default = IngresoProductoStock;
