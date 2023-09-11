const AWS = require('aws-sdk');
const moment = require('moment'); // Don't forget to import 'moment' if you haven't already
const crypto = require('crypto');

AWS.config.update({ region: 'us-west-1' });
const docClient = new AWS.DynamoDB.DocumentClient();


const test2 = async(req,res)=>{
  res.json("success2")
}
//register unser
const newUser = async (req, res) => {
  const { username, email } = req.body;
  const id = crypto.randomBytes(10).toString('hex');

  const params = {
    TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Item: {
      username: username,
      email: email,
      id: username,
      totalMileage: 0,
      totalMoneyRaised: 0,
      totalMoneyDonated: 0,
      __typename: "UsersModel",
      createdAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      _version: 1,
      _lastChangedAt: 234234122,
    },
  };

  try {
    const data = await docClient.put(params).promise(); 
    res.json({ data: data, newUser:params.Item, success: 'very successful' });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(400).json({ errorMessage:err});

  }

  console.log("jkhliokhkjg");
};


const addStravaRefresh = async(req,res)=>{
  console.log('addStravaaa')

  const { refresh, username } = req.body;


  const params = {
    TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': username },
    UpdateExpression: 'set stravaRefresh = :refreshValue', // Update the 'stravaRefresh' attribute
    ExpressionAttributeValues: { // Define the ExpressionAttributeValues
      ':refreshValue': refresh // Set the value of the 'stravaRefresh' attribute to the 'refresh' variable
    }
  };


  try {
    const data = await docClient.update(params).promise(); 
    res.json({ data: data, newUser:params.Item, success: 'very successful', refresh_token:refresh });
  } catch (err) {
    console.error('Error addinf refresh:', err);
    res.status(400).json({ errorMessage:err });
  }
}

const reauthorizeStrava = async (req, res) => {
  console.log('reauttthstravaa')
  const { refresh } = req.body;
  const auth_link="https://www.strava.com/oauth/token"
  async function reAuthorize() {
    try {
      const response = await fetch(auth_link, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: '111319',
          client_secret: 'b03bfa9b476ff3e1536d632e33224d6b23f0f506',
          refresh_token: refresh,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reauthorize Strava.'); // Handle non-2xx responses
      }

      const data = await response.json();
      console.log(data)
      console.log("dfdfs")
      res.json({ newAccess: data.access_token });
    } catch (error) {
      console.error('Error reauthorizing Strava:', error);
      res.status(500).json({ error: 'Failed to reauthorize Strava.' });
    }
  }
  reAuthorize()
}


const getUser=async(req,res)=>{
  const  username  = req.query.username;

  const userParams = {
    TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': username },
  };

  try {
    const data = await docClient.get(userParams).promise();
    if(data.Item==null){
      res.status(400).json({ errorMessage:'User not found' });
      return;
    }
    else{
      res.json({user:data.Item})
    }
  }
    catch(error){
      console.log("error",error);
    }
}



module.exports={test2,newUser,addStravaRefresh,reauthorizeStrava,getUser};