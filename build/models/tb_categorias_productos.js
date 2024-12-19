"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class CategoriaProducto extends sequelize_1.Model {
}
CategoriaProducto.init({
    idCategoriaProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    fecha_creacion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'CategoriaProducto',
    tableName: 'tb_Categorias_Productos',
    timestamps: false,
});
exports.default = CategoriaProducto;
