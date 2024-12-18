import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class Empresa extends Model {
    public idEmpresa!: number;
    public razon_social!: string;
    public nombre_comercial!: string;
    public nit!: string;
    public telefono!: string;
    public email!: string;
}

Empresa.init({
    idEmpresa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_comercial: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    nit: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'tb_Empresas',
    timestamps: false,
});

export default Empresa;