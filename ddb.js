var AWS = require('aws-sdk');
require('dotenv').config();

var ddb_user_data = [];
var ddb_users = [];
var region = process.env.REGION;
var tableName = process.env.TABLE_NAME;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: region,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getUserData=async()=> {
  var params = {
    TableName: tableName,
  };
  try {
    ddb_user_data = [];
    ddb_users = [];
    var result = await dynamoDB.scan(params).promise();
    result.Items.forEach(function (item) {
      var uname = item.username;
      var data = { [uname]: item };
      ddb_user_data.push(data);
    });
    
    var users = []
    ddb_user_data.forEach((item) => {
      users.push(Object.keys(item));
    });
    
    ddb_users = users.flat();

    console.log(ddb_users,ddb_user_data);
    return [ddb_user_data,ddb_users,null]
  } catch (error) {
    console.error("Error fetching data:", error);
    return [null,null,error]
  }
}

const updateFormDetails = async (questionData,username) => {
  const unAnsquestionArr=Object.keys(questionData)
  unAnsquestionArr.forEach((formName) => {
    const updateParams = {
      TableName: tableName,
      Key: {
        username: username,
      },
      ExpressionAttributeValues: {
        ':isNotifyValue': true, // Set isNotify to true
      },
      UpdateExpression: `SET Forms.${formName}.isNotify = :isNotifyValue`,
    };
  
    dynamoDB.update(updateParams, (error, data) => {
      if (error) {
        console.error(`Error updating item for ${username}:`, error);
      } else {
        console.log(`Item updated successfully for ${username}:`, data);
      }
    });

  });
};

const questionPreprocessor=(data)=> {
  const resultObject = {};

  for (const formKey in data.Forms) {
    if (data.Forms.hasOwnProperty(formKey)) {
      const form = data.Forms[formKey];
      const nullOrSixQuestions = [];

       // Convert the timestamp to a Date object
       const givenTime = new Date(form.Updated_On_TimeStamp);
       // Get the current time
       const currentTime = new Date();
       // Add  minutes to the given time
       const givenTimePlusMinutes = new Date(givenTime.getTime() + 2 * 60 * 1000);
       console.log(givenTimePlusMinutes,currentTime,form.isNotify)
   
    if(givenTimePlusMinutes<=currentTime && form.isNotify===false)
    { 
      for (const questionKey in form) {

        if (form.hasOwnProperty(questionKey) && questionKey.startsWith('q')) {
          const questionValue = form[questionKey];

          if (questionValue === null || questionValue === 6) {
            const questionNumber = parseInt(questionKey.slice(1)); // Extract number from question key
            nullOrSixQuestions.push(questionNumber);
          }
        }
      }
    }
    else{
      console.log('in not satisfied cron job condition ')
    }   

      if (nullOrSixQuestions.length > 0) {
        resultObject[formKey] = nullOrSixQuestions;
      }
    }
  }

  return resultObject;
}


module.exports = {getUserData,questionPreprocessor,updateFormDetails};