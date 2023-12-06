const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendTwilioSms=(msg,toPhono)=>{
    console.log(msg,toPhono)
    client.messages
    .create({
        body: msg,
        from: '+17257267717',
        to: toPhono
    })
    .then(message =>{ 
        console.log(message.sid)
    })
    .catch(err=>{
        console.log(err)
        
    })
 
    
}
module.exports={sendTwilioSms}