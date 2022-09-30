const nodemailer = require("nodemailer");

async function sendEmail (dest,messsage,attachFile){

  let attach=[];
  if(attachFile){
    attach=attachFile
  }
    let transporter = nodemailer.createTransport({
        
        port: 587 || 50000 ,
        secure: false, // true for 465, false for other ports
        service:`gmail`,
        auth: {
          user:process.env.senderEmail, // generated ethereal user
          pass:process.env.senderPassword, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Fred Foo 👻" <${process.env.senderEmail}>`, // sender address
        to: dest, // list of receivers
        subject: "Hello ✔", // Subject line
        attachments:attach,
        text: "Hello world?", // plain text body
        html: messsage, // html body
      });

}


module.exports=sendEmail;