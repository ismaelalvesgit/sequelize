import { environment } from './environment';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs'
import { Usuario } from '../app/models/usuario.model';

const transport = nodemailer.createTransport({
    host:environment.email.host,
    auth:{
        user: environment.email.user,
        pass: environment.email.pass
    }
})

const readHTMLFILE = function(path:any, callback:any){
    fs.readFile('./views/mail/'+path, {encoding:'utf-8'}, function(error, html){
        if(error){
            throw error;
            callback(error);
        }else{
            callback(null, html)
        }
    })
}

//@Author ismael alves
class Mail{

    bemVindo(user:Usuario){
        return this.send(user.email, "bem-vindo", "bem-vindo.html", user)
    }

    resetSenha(user:Usuario, link:string){
        let data:any = user
        data.link = link
        return this.send(user.email, "recuperação-senha", "recuperacao-senha.html", data)
    }

    private send(destinatario:string, subject:string , template:string, data?:any):Promise<any>{
        return new Promise((resolve, reject)=>{
            readHTMLFILE(template, function(error:any, html:any){
                let templateCompile = handlebars.compile(html)
                const htlmToSend = templateCompile(data)
                transport.sendMail({
                    to:environment.email.user,
                    from:destinatario,
                    subject:subject,
                    html: htlmToSend
                })
                .then(resolve)
                .catch(reject)
            }) 
        })
    }
}

export const mail = new Mail()