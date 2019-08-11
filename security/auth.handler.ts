import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import {NotAuthorizedError} from 'restify-errors'
import {environment} from '../common/environment'
import { Usuario } from '../app/models/usuario.model';
import { AcessToken } from '../app/models/acessToken.model';

export const authenticate: restify.RequestHandler = (req, resp, next)=>{
  const {email, senha} = req.body
  Usuario.findOne({
    where:{
      email: email
    },
    attributes:['email', 'senha','id']
  }).then((user)=>{
      if(user && bcrypt.compareSync(senha, user.senha)){
        const token = jwt.sign({sub: user.email, iss: 'meat-api'} as any, environment.security.apiSecret, {
          algorithm:'HS256',
          expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
        })
        AcessToken.update({token:token, validate: new Date(new Date().getTime() + 60 *60000)},{
          where:{
            idUsuario:user.id
          }
        }).then((data)=>{
          resp.json({nome: user.nome, email: user.email, accessToken: token})
          return next(false)
        })
      } else {
        return next(new NotAuthorizedError('Credenciais invalidas'))
      }
  }).catch(next)
}
