"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Rol extends sequelize_1.Model {
}
Rol.init({
    idRol: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rol: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Rol',
    tableName: 'tb_Roles',
    timestamps: false,
});
exports.default = Rol;
