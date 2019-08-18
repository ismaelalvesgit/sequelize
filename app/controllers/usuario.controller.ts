import {Router} from '../../common/router'
import * as restify from 'restify'
import * as validator from 'express-validator'
import { Usuario } from '../models/usuario.model';
import { AcessToken } from '../models/acessToken.model';
import { NotFoundError, InvalidCredentialsError} from 'restify-errors'
import { authenticate } from '../../security/auth.handler';
import { authorize } from '../../security/authz.handler';
import { mail } from '../../common/mailer';
import { utils } from '../utils/util';
import { environment } from '../../common/environment';

//@Author ismael alves
class UsuarioController extends Router {
  applyRoutes(application: restify.Server) {
    
    //metodo de login
    application.post('/login', [
      validator.check('email').isEmail(),
      validator.check('senha').isString(),
      authenticate
    ])

    //metodo que faz a alteração da senha
    application.post('/alterar-senha', [
      validator.header('link').isString(),
      validator.check('senha').isString(),
      (req, resp, next)=>{
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
          return resp.json(400,{ errors: errors.array() })
        }
        AcessToken.findOne({
          where:{
            token:req.header('link')
          }
        }).then((data)=>{
          if(data){
            Usuario.update({senha:req.body.senha},{
              where:{
                id:data.idUsuario
              }
            }).then((user)=>{
              if(user[0] == 1){
                Usuario.findByPk(data.idUsuario).then((alter)=>{
                  utils.updateToken(alter!, utils.geradorToken(alter!)).then(()=>{
                    resp.send('senha alterada com sucesso')
                  }).catch(next)
                })
              }else{
                resp.send(new NotFoundError('usuário não encontrado'))
              }
            }).catch(next)
          }else{
            resp.send(new InvalidCredentialsError('link não está mais ativo'))
          }
        }).catch(next)
      }
    ])

    //metodo de reset senha
    application.post('/reset', [validator.check('email').isEmail(), (req, resp, next)=>{
      const errors = validator.validationResult(req);
      if (!errors.isEmpty()) {
        return resp.json(400,{ errors: errors.array() })
      }
      Usuario.findOne({
        where:{
          email: req.body.email
        }
      }).then((user)=>{
        if(user){
          utils.gerarHash().then((token)=>{
            utils.updateToken(user, token).then(()=>{
              mail.resetSenha(user, environment.server.url+"/reset/"+ token).then(()=>{
                resp.send(`enviamos um email para ${user.email}`)
                next()
              })
            }).catch(next)
          }).catch(next)
        }else{
          resp.send(new NotFoundError('usuario não encontrado ou não exite'))
        }
      }).catch(next)
    }])

    //metodo que verifica link do reset
    application.get('/reset/:link', (req, resp, next)=>{
      AcessToken.findOne({
        where:{
          token:req.params.link
        }
      }).then((data)=>{
        if(data){
          if(new Date() > data.validade){
            resp.send(new InvalidCredentialsError('link não está mais ativo'))
          }else{
            resp.send('link ativo')
          }
        }else{
          resp.send(new InvalidCredentialsError('link não está mais ativo'))
        }
        next()
      }).catch(next)
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
          next()
        }).catch(next)
      }).catch(next)
    }])
    
    //metodo de criar usuário
    application.post('/usuarios', (req, resp, next)=>{
      Usuario.create(req.body)
      .then(data => {
        AcessToken.create({idUsuario:data.id}).then(()=>{
          mail.bemVindo(data).then(()=>{
            resp.send(200, "usuario criado com sucesso "+data.id)
            next()
          }).catch(next)
        }).catch(next)
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
        if(data){
          resp.json(data)
        }else{
          resp.send(new NotFoundError('usuário não encontrado'))
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
        if(data){
          resp.json(data)
        }else{
          resp.send(new NotFoundError('usuário não encontrado'))
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
          resp.send(new NotFoundError('usuário não encontrado'))
        }
        next()
      }).catch(next)
    })
  }
}

export const usuarioController = new UsuarioController()
