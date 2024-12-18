"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Empresa extends sequelize_1.Model {
}
Empresa.init({
    idEmpresa: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    razon_social: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_comercial: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    nit: {
        type: sequelize_1.DataTypes.STRING(12),
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Empresa',
    tableName: 'tb_Empresas',
    timestamps: false,
});
exports.default = Empresa;
