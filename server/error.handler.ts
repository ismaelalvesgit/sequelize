import * as restify from 'restify'

//@Author ismael alves
export const handleError = (req: restify.Request, resp: restify.Response, err:any, done:any)=>{
  err.toJSON = ()=>{
    return {
      message : err.message
    }
  }
  const messages: any[] = []
  switch(err.name){
    case 'SequelizeValidationError':
      err.statusCode = 400
      for(let name in err.errors){
        messages.push({message: err.errors[name].message})
      }
      err.toJSON = ()=>({
        message: 'Erro de validação ao processar sua solicitação',
        errors: messages
      })
      break
    case 'SequelizeUniqueConstraintError':
      err.statusCode = 400
      for(let name in err.errors){
        messages.push({message: err.errors[name].message})
      }
      err.toJSON = ()=>({
        message: 'Erro de validação ao processar sua solicitação',
        errors: messages
      })
      break
  }
  done()
}
