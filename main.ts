import {Server} from './server/server'
import { mainRouter } from './app/routers/main.router';


const server = new Server()
server.bootstrap([
  mainRouter
]).then(server=>{
  console.log('Server is listening on:', server.application.address())
}).catch(error=>{
  console.log('Server failed to start')
  console.error(error)
  process.exit(1)
})
