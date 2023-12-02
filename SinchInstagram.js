// Find your App ID at dashboard.sinch.com/convapi/apps
// Find your Project ID at dashboard.sinch.com/settings/project-management
// Get your Access Key and Access Secret at dashboard.sinch.com/settings/access-keys

require('dotenv').config();
const fetch =require("cross-fetch")

const send_insta_msg=async(msg,contactId)=> {
  const reqBody={
    app_id: process.env.SINCH_APP_ID,
    recipient: {
      contact_id:contactId
  },
    message: {
      text_message: {
        text: msg
      }
    },channel_priority_order: ['INSTAGRAM']
  }
  console.log(reqBody)
  const resp = await fetch(
    'https://us.conversation.api.sinch.com/v1/projects/' + process.env.SINCH_PROJECT_ID + '/messages:send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(process.env.SINCH_ACCESS_KEY + ':' + process.env.SINCH_ACCESS_SECRET).toString('base64')
      },
      body: JSON.stringify(reqBody)
    }
  );

  const data = await resp.json();
  console.log(data);
}

// send_insta_msg('hi this is test msg','01HDR7FENHWNZAZ0ZMJKR295N0');
module.exports={send_insta_msg}