import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../common/sequelize";
import { validateCPF } from '../../common/validators';
import { TipoUsuario } from '../../security/TipoUsuario'
import * as bcrypt from 'bcrypt';
import { environment } from '../../common/environment';
import { AcessToken } from "./acessToken.model";

//@Author ismael alves
export class Usuario  extends Model{
    id!:number
    nome!:string
    email!:string
    tipoUsuario!:string
    cpf!:string
    senha!:string
    online!:boolean
    ultimoAcesso!:Date
    
    // timestamps!
    readonly dataRegistro!: Date;
    readonly dataAtualizacao!: Date;
    readonly dataDelete!: Date;

    updateToken(token:string, user:Usuario){
      return AcessToken.update({token:token, validate: new Date(new Date().getTime() + 60 *60000)},{
        where:{
          idUsuario:user.id
        }
      })
    }
}

Usuario.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      validate:{
        notNull: {
          msg: 'nome e requirido'
        },
      }
    },
    online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ultimoAcesso: {
      type: new DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique:{
        name:'email',
        msg:'email já cadastrado',
      },
      validate:{
        isEmail:{
          msg:'email não e válido'
        },
        notNull: {
          msg: 'email e requirido'
        },
      }
    },
    tipoUsuario: {
      type: new DataTypes.ENUM(...Object.values(TipoUsuario)),
      allowNull: false,
      validate:{
        notNull: {
          msg: 'tipo usuário e requirido'
        },
        isIn: {
          args: [Object.values(TipoUsuario)],
          msg: "tipo de usuário não existe"
        }
      }
    },
    cpf: {
      type: new DataTypes.STRING(15),
      allowNull: false,
      unique:{
        name:'cpf',
        msg:'cpf já cadastrado',
      },
      validate:{
        notNull: {
          msg: 'cpf e requirido'
        },
        isCpf(value:string) {
          if(validateCPF(value) == false){
            throw new Error('cpf não esta valido.');
          }
        }
      }
    },
    senha:{
      type: new DataTypes.STRING(255),
      allowNull:false,
      validate:{
        min:{
          args:[6],
          msg:'minimo 6 caracteres'
        },
        notNull: {
          msg: 'senha e requirido'
        },
      }
    }
  }, {
    hooks:{
      afterValidate:(usuario:Usuario)=>{
        if(usuario.senha){
          usuario.senha = bcrypt.hashSync(usuario.senha, environment.security.saltRounds);
        }
      },
    },
    defaultScope:{
      attributes:{
        exclude:['senha']
      }
    },
    tableName: 'usuario',
    modelName:'usuario',
    createdAt: 'dataRegistro',
    updatedAt: 'dataAtualizacao',
    deletedAt: 'dataDelete',
    underscored: true,
    sequelize: sequelize, // this bit is important
});

//foreign key
Usuario.hasMany(AcessToken, {
  sourceKey:'id',
  foreignKey:'idUsuario',
  as: 'acessToken'
});