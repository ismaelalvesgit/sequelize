import * as fs from 'fs'
import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'
import {tokenParser} from '../security/token.parser'
import { sequelize } from '../common/sequelize'
import { Sequelize } from 'sequelize';
import { logger } from '../common/logger';

//@Author ismael alves
export class Server {

  application!: restify.Server;

  inicializeDb():Sequelize{
    return sequelize
  }

  initRoutes(routers: Router[]): Promise<any>{
    return new Promise((resolve, reject)=>{
      try{

        const options: restify.ServerOptions = {
          name: 'big-ecommerce-api',
          version: '1.0.0',
        }
        if(environment.security.enableHTTPS){
          options.certificate = fs.readFileSync(environment.security.certificate),
          options.key = fs.readFileSync(environment.security.key)
        }

        this.application = restify.createServer(options)
        
        this.application.pre(restify.plugins.requestLogger({
          log: logger
        }))

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        //iniciando server
        this.application.listen(environment.server.port, ()=>{
           resolve(this.application)
        })

        //quando ocorrem os eventos no server
        this.application.on('InternalServer', function(req, res, err, callback) {
          // this will get fired first, as it's the most relevant listener
          console.log("error interno", err)
          return callback();
        })
        this.application.on('restifyError', handleError)

      }catch(error){
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server>{
    return  this.inicializeDb().sync({alter:true}).then(()=> this.initRoutes(routers).then(()=> this))  
  }

  shutdown(){
    return this.application.close()
  }

}
