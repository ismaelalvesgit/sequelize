import {Server} from './server/server'
import { usuarioController } from './app/controllers/usuario.controller';


const server = new Server()
server.bootstrap([
  usuarioController
]).then(server=>{
  console.log('Server is listening on:', server.application.address())
}).catch(error=>{
  console.log('Server failed to start')
  console.error(error)
  process.exit(1)
})
