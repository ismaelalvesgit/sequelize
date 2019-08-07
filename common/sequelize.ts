import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('ecommerce','root','',{
    host:'localhost',
    dialect:'mysql'
})