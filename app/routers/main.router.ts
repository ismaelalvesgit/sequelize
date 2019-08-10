import {Router} from '../../common/router'
import * as restify from 'restify'
import { Usuario } from '../models/usuario.model';
import { AcessToken } from '../models/acessToken.model';
import { NotFoundError} from 'restify-errors'

class MainRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.post('/usuarios', (req, resp, next)=>{
      Usuario.create(req.body)
      .then(data => {
        AcessToken.create({idUsuario:data.id})
        resp.send(200, "usuario criado com sucesso "+data.id)
      }).catch((e)=>{
        resp.json(400,e)
      });
    })

    application.get('/usuarios', (req, resp, next)=>{
      Usuario.findAll({
        include:[{
          model:AcessToken,
          as: 'acessToken',
        }]
      })
      .then(data => {
        resp.json(200, data)
      }).catch((e)=>{
        resp.json(500, e)
      });
    })

    application.get('/usuarios/:id', (req, resp, next)=>{
      Usuario.findByPk(req.params.id)
      .then((data)=>{
        resp.json(data)
      })
      .catch((e)=>{
        resp.send(new NotFoundError('documento não encontrado'))
      })
    })

    application.del('/usuarios/:id', (req, resp, next)=>{
      Usuario.destroy({
        where:{
          id:req.params.id
        }
      })
      .then((data)=>{
        resp.json(data)
      })
      .catch((e)=>{
        resp.send(new NotFoundError('documento não encontrado'))
      })
    })

    application.put('/usuarios/:id', (req, resp, next)=>{
      Usuario.update(req.body, {
        where:{
          id: req.params.id
        },
      })
      .then((data)=>{
        resp.json(data)
      })
      .catch((e)=>{
        if(e.name == 'SequelizeUniqueConstraintError'){
          resp.send(400, e)
        }else{
          resp.send(new NotFoundError('documento não encontrado'))
        }
      })
    })


  }
}

export const mainRouter = new MainRouter()
