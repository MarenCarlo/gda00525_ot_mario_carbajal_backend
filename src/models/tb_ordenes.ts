import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

class Orden extends Model {
    public idOrden!: number;
    public total_orden!: number;
    public fecha_creacion!: Date;
    public status_Orden!: number;
    public isActive!: boolean;
    public usuarioCliente_idUsuario!: number;
    public usuarioVendedor_idUsuario!: number | null;
}

Orden.init({
    idOrden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_orden: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    status_Orden: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5,
        },
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    usuarioCliente_idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_Usuarios',
            key: 'idUsuario',
        },
    },
    usuarioVendedor_idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tb_Usuarios',
            key: 'idUsuario',
        },
    },
}, {
    sequelize,
    modelName: 'Orden',
    tableName: 'tb_Ordenes',
    timestamps: false,
});

export default Orden;