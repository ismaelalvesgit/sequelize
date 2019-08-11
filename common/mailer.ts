import { environment } from './environment';
import * as nodemailer from 'nodemailer';
import { Usuario } from '../app/models/usuario.model';

const transport = nodemailer.createTransport({
    host:environment.email.host,
    auth:{
        user: environment.email.user,
        pass: environment.email.pass
    }
})

class Mail{

    bemVindo(user:Usuario){
        return this.send(user.email, "teste")
    }

    private send(destinatario:string, subject:string ,template?:string, data?:any){
        return transport.sendMail({
            to:environment.email.user,
            from:destinatario,
            subject:subject,
            
        })
    }
}

export const mail = new Mail()