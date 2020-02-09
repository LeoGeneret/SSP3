const nodemailer = require("nodemailer")
const fs = require("fs")


let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.MAIL_SERVICE_HOST,
    port: process.env.MAIL_SERVICE_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

transporter.verify((error, success) => {
    if(error){
        console.log("Error while connecting mailer", error)
    } else {
        console.log("## MAILER CONNECTED")
    }
})


module.exports = {
    send: (to, subject, template, dynamicData = {}) => new Promise((resolve, reject) => {

        if(transporter){

            // fetch template
            fs.readFile(template, "utf8", (errorReadingFile, dataFile) => {

                if(errorReadingFile){
                    return reject(errorReadingFile)
                }


                let stringHtml = dataFile

                for(let key in dynamicData){
                    stringHtml = stringHtml.replace(key, dynamicData[key])
                }
                
                // send mail
                transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: to,
                    subject: subject,
                    html: stringHtml
                }, (errorSendingMail, dataMail) => {

                    if(errorSendingMail){
                        return reject(errorSendingMail)
                    }

                    resolve(dataMail)
                })
            })

            
        } else {
            reject("transporter undefined")
        }
    })
}