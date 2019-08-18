import * as restify from 'restify'
import * as bcrypt from 'bcrypt'
import * as validator from 'express-validator'
import { NotAuthorizedError } from 'restify-errors'
import { Usuario } from '../app/models/usuario.model';
import { utils } from '../app/utils/util';

export const authenticate: restify.RequestHandler = (req, resp, next)=>{
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return resp.json(400,{ errors: errors.array() })
  }
  const {email, senha} = req.body
  Usuario.findOne({
    where:{
      email: email
    },
    attributes:['email', 'senha','id']
  }).then((user)=>{
    if(user && bcrypt.compareSync(senha, user.senha)){
      const token = utils.geradorToken(user)
      utils.updateToken(user, token).then(()=>{
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
