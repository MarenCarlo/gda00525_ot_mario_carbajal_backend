import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class Rol extends Model {
    public idRol!: number;
    public rol!: string;
    public descripcion!: string | null;
}

Rol.init({
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rol: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Rol',
    tableName: 'tb_Roles',
    timestamps: false,
});

export default Rol;