"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Orden extends sequelize_1.Model {
}
Orden.init({
    idOrden: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_orden: {
        type: sequelize_1.DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
    fecha_creacion: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    status_Orden: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5,
        },
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    usuarioCliente_idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Usuarios',
            key: 'idUsuario',
        },
    },
    usuarioVendedor_idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tb_Usuarios',
            key: 'idUsuario',
        },
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Orden',
    tableName: 'tb_Ordenes',
    timestamps: false,
});
exports.default = Orden;
