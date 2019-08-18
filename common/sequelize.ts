import { Sequelize } from 'sequelize'
import { environment } from "./environment";

//@Author ismael alves
export const sequelize = new Sequelize(environment.db.database, environment.db.user, environment.db.password,{
    host:environment.db.host,
    dialect:'mysql',
    timezone:'-03:00',
    dialectOptions:{
        dateStrings: true,
    }
})

