import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../common/sequelize";

export class Usuario  extends Model{
    id!:number
    nome!:string

    // timestamps!
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
}

Usuario.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  }, {
    tableName: 'usuario',
    sequelize: sequelize, // this bit is important
});