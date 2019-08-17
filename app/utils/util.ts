import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from '../../common/environment'
import { AcessToken } from '../models/acessToken.model';
import { Usuario } from '../models/usuario.model';

class Utils{
    
    //metodo que pega usuario logado pelo token
    usuarioLogado(req:restify.Request){
        return new Promise<Usuario>((resolve, reject)=>{
            AcessToken.findOne({
                where:{
                    token: `${req.headers.authorization}`
                },
            }).then((data:any)=>{
                resolve(Usuario.findByPk(data.id))
            })
        })
    }

    //metodo que gera token
    geradorToken(user?:Usuario){
        if(user){
            return jwt.sign({sub: user.email, iss: 'ecommerce-api'} as any, environment.security.apiSecret, {
                algorithm:'HS256',
                expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
            }) 
        }else{
            return jwt.sign({iss: 'ecommerce-api'} as any, environment.security.apiSecret, {
                algorithm:'HS256',
                expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
            })
        }
    }

    //metodo que veirifica token ativo
    verfiricaToken(token:string){
        return jwt.verify(token, environment.security.apiSecret)
    }
}

export const utils = new Utils()