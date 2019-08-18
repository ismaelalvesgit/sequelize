import * as restify from 'restify'
import {ForbiddenError} from 'restify-errors'
import { InvalidCredentialsError } from 'restify-errors';
import { Usuario } from '../app/models/usuario.model';
import { utils } from '../app/utils/util';

//@Author ismael alves
export const authorize: (...profiles: string[])=> restify.RequestHandler = (...profiles)=>{
  return (req, resp, next)=>{
    if(req.headers.authorization !== undefined){
        const token = req.headers.authorization
        try {
          const verify:any = utils.verfiricaToken(token)
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
          next(new ForbiddenError('token expirado ou não identificado'))
        }
    } else {
      next(new ForbiddenError('token não encontrado'))
    }
  }
}
