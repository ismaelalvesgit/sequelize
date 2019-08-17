import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../common/sequelize";
import { Usuario } from "./usuario.model";


export class AcessToken  extends Model{
    id!:number
    idUsuario!:Usuario
    token!:string
    validade!:Date

    // timestamps!
    readonly dataRegistro!: Date;
    readonly dataAtualizacao!: Date;
    readonly dataDelete!: Date;
}

AcessToken.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    idUsuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Usuario, 
            key: 'id', 
        },
        allowNull: false,
    },
    validate:{
        type: new DataTypes.DATE,
        allowNull:true
    },
    token:{
        type: new DataTypes.STRING(255),
        allowNull:true
    }
  },{
    tableName: 'acess_token',
    modelName:'acessToken',
    createdAt: 'dataRegistro',
    updatedAt: 'dataAtualizacao',
    deletedAt: 'dataDelete',
    underscored: true,
    sequelize: sequelize, // this bit is important
});