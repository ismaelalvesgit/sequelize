import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { NotAuthorizedError } from 'restify-errors'
import { environment } from '../common/environment'
import { Usuario } from '../app/models/usuario.model';
import { AcessToken } from '../app/models/acessToken.model';
import { utils } from '../app/utils/util';

export const authenticate: restify.RequestHandler = (req, resp, next)=>{
  const {email, senha} = req.body
  Usuario.findOne({
    where:{
      email: email
    },
    attributes:['email', 'senha','id']
  }).then((user)=>{
      if(user && bcrypt.compareSync(senha, user.senha)){
        const token = utils.geradorToken(user)
        AcessToken.update({token:token, validate: new Date(new Date().getTime() + 60 *60000)},{
          where:{
            idUsuario:user.id
          }
        }).then(()=>{
          Usuario.update({online:true},{
            where:{
              id: user.id
            },
          }).then(()=> Usuario.findOne({
              where:{
                email: email
              },
            }).then((data)=>{
              resp.json({user:data, accessToken: token})
              return next(false)
            })
          )
        })
      } else {
        return next(new NotAuthorizedError('Credenciais invalidas'))
      }
  }).catch(next)
}
