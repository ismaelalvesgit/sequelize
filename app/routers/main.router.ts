import {Router} from '../../common/router'
import * as restify from 'restify'
import { Usuario } from '../models/usuario.model';


class MainRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get('/', (req, resp, next)=>{
      Usuario.create({ nome: "Jane" }).then(jane => {
        console.log("Jane's auto-gnerated ID:", jane.id);
      });
      resp.send(200,"deu certo")
    })
  }
}

export const mainRouter = new MainRouter()
