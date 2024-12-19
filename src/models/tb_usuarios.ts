import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';
import Rol from './tb_roles';
import Empresa from './tb_empresas';

class Usuario extends Model {
    public idUsuario!: number;
    public nombre_completo!: string;
    public username!: string;
    public passphrase!: string;
    public telefono!: string;
    public email!: string;
    public direccion!: string;
    public fecha_nacimiento!: string;
    public fecha_creacion!: string;
    public isSuperUser!: boolean;
    public isActive!: boolean;
}

Usuario.init({
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_completo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    passphrase: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(8),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    isSuperUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rol_idRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Roles',
            key: 'idRol',
        },
    },
    empresa_idEmpresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'idEmpresa',
            key: 'idEmpresa',
        },
    },
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'tb_Usuarios',
    timestamps: false,
});

/**
 * Relaciones entre modelos
 */
Usuario.belongsTo(Rol, { foreignKey: 'rol_idRol', as: 'rol' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_idEmpresa', as: 'empresa' });

export default Usuario;
