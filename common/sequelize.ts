import { Sequelize } from 'sequelize'
import { environment } from "./environment";
import { logger } from './logger';
export const sequelize = new Sequelize(environment.db.database, environment.db.user, environment.db.password,{
    host:environment.db.host,
    dialect:'mysql',
    timezone:'-03:00',
    dialectOptions:{
        useUTC: true, //for reading from database
        dateStrings: true,
        typeCast: true
    }
})

