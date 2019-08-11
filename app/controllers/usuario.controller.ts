import {Router} from '../../common/router'
import * as restify from 'restify'
import { Usuario } from '../models/usuario.model';
import { AcessToken } from '../models/acessToken.model';
import { NotFoundError} from 'restify-errors'
import { authenticate } from '../../security/auth.handler';
import { authorize } from '../../security/authz.handler';
import { mail } from '../../common/mailer';


class UsuarioController extends Router {
  applyRoutes(application: restify.Server) {
    
    application.post('/login', authenticate)
    
    application.post('/usuarios', (req, resp, next)=>{
      Usuario.create(req.body)
      .then(data => {
        AcessToken.create({idUsuario:data.id})

        mail.bemVindo(data).then(()=>{
          console.log("send")
        })

        resp.send(200, "usuario criado com sucesso "+data.id)
        next()
      }).catch((e)=>{
         next(e)
      });
    })

    application.get('/usuarios', [authorize('administrador') , (req, resp, next)=>{
      Usuario.findAll({
        include:[{
          model:AcessToken,
          as: 'acessToken',
        }]
      })
      .then(data => {
        resp.json(200, data)
        next()
      }).catch((e)=>{
        next(e)
      });
    }])

    application.get('/usuarios/:id', (req, resp, next)=>{
      Usuario.findByPk(req.params.id)
      .then((data)=>{
        if(data == null){
          resp.send(new NotFoundError('documento não encontrado'))
        }else{
          resp.json(data)
        }
        next()
      })
      .catch((e)=>{
        next(e)
      })
    })

    application.del('/usuarios/:id', [authorize('administrador'), (req, resp, next)=>{
      Usuario.findByPk(req.params.id)
      .then((data)=>{
        Usuario.destroy({
          where:{
            id:req.params.id
          }
        })
        if(data == null){
          resp.send(new NotFoundError('documento não encontrado'))
        }else{
          resp.json(data)
        }
        next()
      })
      .catch((e)=>{
        next(e)
      })
    }])

    application.put('/usuarios/:id', (req, resp, next)=>{
      Usuario.update(req.body, {
        where:{
          id: req.params.id
        },
      })
      .then((data)=>{
        if(data[0] == 1){
          Usuario.findByPk(req.params.id).then((alter)=>{
            resp.json(alter)
          })
        }else{
          resp.send(new NotFoundError('documento não encontrado'))
        }
        next()
      })
      .catch((e)=>{
        next(e)
      })
    })
  }
}

export const usuarioController = new UsuarioController()
