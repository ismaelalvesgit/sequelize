import * as bunyan from 'bunyan'
import {environment} from './environment'

export const logger = bunyan.createLogger({
  name: environment.log.name,
  level: (<any>bunyan).resolveLevel(environment.log.level),
  streams: [
    {
      level: 'info',
      path: `/bunyan/${environment.log.name}.log` 
    },
    {
      level: 'error',
      path: `/bunyan/${environment.log.name}.log`  // log ERROR and above to a file
    }
  ]
})
