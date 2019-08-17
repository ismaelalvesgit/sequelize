import {Router} from '../../common/router'
import * as restify from 'restify'
import { Usuario } from '../models/usuario.model';
import { AcessToken } from '../models/acessToken.model';
import { NotFoundError} from 'restify-errors'
import { authenticate } from '../../security/auth.handler';
import { authorize } from '../../security/authz.handler';
import { mail } from '../../common/mailer';
import { utils } from '../utils/util';

//@Author ismael alves
class UsuarioController extends Router {
  applyRoutes(application: restify.Server) {
    
    //metodo de login
    application.post('/login', authenticate)

    //metodo de reset senha
    application.post('/reset', (req, resp, next)=>{
      Usuario.findOne({
        where:{
          email: req.body.email
        }
      }).then((user)=>{
        if(user){
          const link = "http://localhost:3000/reset/"+ utils.geradorToken()
          console.log(link)
          mail.resetSenha(user, link).then(()=>{
            resp.send(`enviamos um email para ${user.email}`)
          })
        }else{
          resp.send(404,'usuário não cadastrado')
        }
        next()
      })
      .catch(next)
    })

    //metodo que verifica link do reset
    application.get('/reset', (req, resp, next)=>{

    })

    //metodo de logout
    application.post('/logout', [authorize('administrador', 'cliente') ,(req, resp, next)=>{
      utils.usuarioLogado(req).then((user)=>{
        AcessToken.update({token:null, validate:null},{
          where:{
            idUsuario: user.id
          }
        }).then(()=> Usuario.update({online:false, ultimoAcesso:new Date()},{
          where:{
            id: user.id
          }          
        })).then(()=>{
          resp.send(`usuario ${user.nome} deslogado com sucesso !!!`)
        }).catch(next)
      }).catch(next)
    }])
    
    //metodo de criar usuário
    application.post('/usuarios', (req, resp, next)=>{
      Usuario.create(req.body)
      .then(data => {
        AcessToken.create({idUsuario:data.id})
        mail.bemVindo(data).then(()=>{
          resp.send(200, "usuario criado com sucesso "+data.id)
        })
        next()
      }).catch(next);
    })

    //metodo que lista os usuario 
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
      }).catch(next);
    }])

    //metodo que pega usuario por id
    application.get('/usuarios/:id', (req, resp, next)=>{
      Usuario.findByPk(req.params.id)
      .then((data)=>{
        if(data == null){
          resp.send(new NotFoundError('documento não encontrado'))
        }else{
          resp.json(data)
        }
        next()
      }).catch(next)
    })

    //metodo que deleta usuario
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
      }).catch(next)
    }])

    //metodo que atualiza usuário por id
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
      }).catch(next)
    })
  }
}

export const usuarioController = new UsuarioController()
