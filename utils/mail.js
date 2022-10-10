const nodemailer = require('nodemailer'); 

function sendMail(sendTo, subject, text){

        var mailOptions = {
            from: "kashifraza08012001@gmail.com",
            to : sendTo,
            subject :subject,
            html : text
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: "kashifraza08012001@gmail.com",
                pass: "wmlrsjwcfcgfzbqc"
            }
            
        })
    
        transporter.sendMail(mailOptions, (err, info)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('Email Sent!' + info.response);
                }
        });  
    };

    module.exports = sendMail;

