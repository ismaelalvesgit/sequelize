import { Sequelize } from 'sequelize'
import { environment } from "./environment";
import { Usuario } from '../app/models/usuario.model';
export const sequelize = new Sequelize(environment.db.database, environment.db.user, environment.db.password,{
    host:environment.db.host,
    dialect:'mysql'
})

