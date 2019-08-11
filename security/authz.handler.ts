import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from "../common/environment";
import {ForbiddenError} from 'restify-errors'
import { InvalidCredentialsError } from 'restify-errors';
import { Usuario } from '../app/models/usuario.model';

export const authorize: (...profiles: string[])=> restify.RequestHandler = (...profiles)=>{
  return (req, resp, next)=>{
    if(req.headers.authorization !== undefined){
        const token = req.headers.authorization
        try {
          const verify:any = jwt.verify(token, environment.security.apiSecret)
          Usuario.findOne({
            where:{
              email:verify.sub
            }
          }).then((data:any)=>{
            if(profiles.some(profile => data.tipoUsuario.indexOf(profile)!== -1)){
              next()
            }else{  
              next(new InvalidCredentialsError('seu perfil não tem acesso a isso'))
            }
          }).catch(next)
        }catch (error) {
          next(new ForbiddenError('token expirado'))
        }
    } else {
      next(new ForbiddenError('token não encontrado'))
    }
  }
}
