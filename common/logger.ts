import * as bunyan from 'bunyan'
import {environment} from './environment'

//@Author ismael alves
export const logger = bunyan.createLogger({
  name: environment.log.name,
  level: (<any>bunyan).resolveLevel(environment.log.level),
})
