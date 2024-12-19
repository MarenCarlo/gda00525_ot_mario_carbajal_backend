"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const tb_roles_1 = __importDefault(require("./tb_roles"));
const tb_empresas_1 = __importDefault(require("./tb_empresas"));
class Usuario extends sequelize_1.Model {
}
Usuario.init({
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_completo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    passphrase: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_nacimiento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    fecha_creacion: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    isSuperUser: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rol_idRol: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Roles',
            key: 'idRol',
        },
    },
    empresa_idEmpresa: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'idEmpresa',
            key: 'idEmpresa',
        },
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Usuario',
    tableName: 'tb_Usuarios',
    timestamps: false,
});
/**
 * Relaciones entre modelos
 */
Usuario.belongsTo(tb_roles_1.default, { foreignKey: 'rol_idRol', as: 'rol' });
Usuario.belongsTo(tb_empresas_1.default, { foreignKey: 'empresa_idEmpresa', as: 'empresa' });
exports.default = Usuario;
