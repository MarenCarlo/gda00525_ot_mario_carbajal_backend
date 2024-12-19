import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class MarcaProducto extends Model {
    public idMarcaProducto!: number;
    public nombre!: string;
    public descripcion!: string | null;
    public fecha_creacion!: Date;
}

MarcaProducto.init({
    idMarcaProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'MarcaProducto',
    tableName: 'tb_Marcas_Productos',
    timestamps: false,
});

export default MarcaProducto;