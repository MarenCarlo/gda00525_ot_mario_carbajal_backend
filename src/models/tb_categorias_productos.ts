import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class CategoriaProducto extends Model {
    public idCategoriaProducto!: number;
    public nombre!: string;
    public descripcion!: string | null;
    public fecha_creacion!: Date;
}

CategoriaProducto.init({
    idCategoriaProducto: {
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
    modelName: 'CategoriaProducto',
    tableName: 'tb_Categorias_Productos',
    timestamps: false,
});

export default CategoriaProducto;