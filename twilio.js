const accountSid = 'ACa1a5deebe805e43ab02464b8a152dbcf';
const authToken = '2b44fae1eb79e441f38bf41279ea4ed0';
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