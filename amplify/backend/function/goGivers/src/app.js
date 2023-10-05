/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const moment = require('moment');

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const AWS= require('aws-sdk')
AWS.config.update({ region: 'us-west-1' }); // Replace 'your-aws-region' with the desired AWS region, e.g., 'us-east-1'.


app.use('/goGivers', require('./routes/goGivers'));

exports.handler = async (event) => {
  const currentTime = new Date().toISOString();
  
  // Scan the DynamoDB table for groups that need an update
  // const params = {
  //     TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
  //     FilterExpression: 'nextScheduledUpdate <= :currentTime',
  //     ExpressionAttributeValues: {
  //         ':currentTime': currentTime
  //     }
  // };

  try {
      const data = await docClient.scan(params).promise();
      const groupsToUpdate = data.Items;

      // Invoke updateStrikes function for each group that needs an update
      for (const group of groupsToUpdate) {
          // Call updateStrikes function with group details
          // group.id, group.startDate, group.usersList, etc.
          await updateStrikes(group);
          
          // Calculate and set the next scheduled update time for the group
          // For example, add 7 days to the current time
          const nextScheduledUpdate = new Date();
          nextScheduledUpdate.setDate(nextScheduledUpdate.getDate() + 7);
          
          // Update the nextScheduledUpdate attribute in DynamoDB for the group
          await updateNextScheduledUpdateInDynamoDB(group.id, nextScheduledUpdate.toISOString());
      }

      return {
          statusCode: 200,
          body: JSON.stringify('Groups updated successfully.'),
      };
  } catch (error) {
      console.error('Error updating groups: ', error);
      return {
          statusCode: 500,
          body: JSON.stringify('Internal Server Error.'),
      };
  }
};


app.listen(3000, function() {
    console.log("App started listening on 3000")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app