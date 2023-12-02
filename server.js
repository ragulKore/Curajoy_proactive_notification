const express =require('express')
const app=express()
require("dotenv").config()
app.use(express.json());
const {getUserData,questionPreprocessor,updateFormDetails}=require('./ddb.js')
const {msgTemplate}=require('./msgTemplate.js')
const {sendTwilioSms}=require('./twilio.js')
const {send_insta_msg}=require('./SinchInstagram.js')
const cron = require('node-cron');
app.get('/notifyUsers',async (req,res)=>{
    const[userData,userKey,error]=await getUserData()
    if(error) return  res.sendStatus(400)
    // console.log('in data 1',userData,userKey);
    for(let i=0;i<userKey.length;i++){
        let data=userData[i][userKey[i]]
        console.log('in data2',data)

        let unansweredQuestions=questionPreprocessor(data)
        console.log(unansweredQuestions)
        if(unansweredQuestions){
            if(data.Recent_Channel==='SMS'){
                let notifyMsg=msgTemplate(unansweredQuestions,data.username)
                sendTwilioSms(notifyMsg,data.Phone_Number)
            }
        }
        else{
            console.log('no unanswered questions')
        }
        
    }

    return res.send(userData)

})

// Schedule the cron job s
cron.schedule('*/2 * * * *', async() => {
    console.log('in cron job')
    const[userData,userKey,error]=await getUserData()
    if(error) return  res.sendStatus(400)
    // console.log('in data 1',userData,userKey);
    for(let i=0;i<userKey.length;i++){  
        let data=userData[i][userKey[i]]
        console.log('in data2',data)
         console.log('in crt flow ')
            let unansweredQuestions=questionPreprocessor(data)
            console.log(unansweredQuestions,Object.keys(unansweredQuestions).length)
            if(Object.keys(unansweredQuestions).length !== 0){
                

                if(data.Recent_Channel==='SMS'){

                    console.log('in sms channel')
                    let notifyMsg=msgTemplate(unansweredQuestions,data.username)
                    sendTwilioSms(notifyMsg,data.Phone_Number)
                    updateFormDetails(unansweredQuestions,data.username)

                    
                }else if(data.Recent_Channel==='ivr'){
                    console.log('in instagram')
                    let notifyInstaMsg=msgTemplate(unansweredQuestions,data.username)
                    send_insta_msg(notifyInstaMsg,data.Instagram_Contact_Id)
                    updateFormDetails(unansweredQuestions,data.username)
                }
            }
            else{
                console.log('no unanswered questions')
            }
        

        
        
    }
  
  });
app.listen(process.env.PORT ||3232, () => {
    console.log("Listening at http://localhost:3232");
});