const AWS = require('aws-sdk');
const moment = require('moment');
const crypto = require('crypto');
const { group } = require('console');

AWS.config.update({ region: 'us-west-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

function generateRandomSequence(length) {
  const randomData = crypto.randomBytes(length);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomData[i] % characters.length;
    result += characters.charAt(randomIndex);
  }

  return result;
}


const newGroup = async (req, res) => {
  const { username, groupName,moneyMile,minMile,minDays } = req.body;
  const randomSequence = generateRandomSequence(6);

  const userParams = {
    TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': username },
  };

  try {
    const data = await docClient.get(userParams).promise();
    if(data.Item==null){
      res.status(400).json({ errorMessage: 'User not found' });
      return;
    }
    else{

    }

    const groupId = groupName + ' #' + randomSequence

    const hostUser = {
      username: data.Item.username.toLowerCase(),
      Id: data.Item.id,
      mileage: 0,
      moneyRaised: 0,
      strikes: 0,
      stravaRefresh: data.Item.stravaRefresh,
    };

    const params = {
      TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Item: {
        host: hostUser,
        groupName: groupName,
        moneyMile:moneyMile,
        minMile:minMile,
        minDays:minDays,
        id: groupId,
        usersList: [hostUser],
        __typename: "GroupsModel",
        createdAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        _version: 1,
        _lastChangedAt: 234234122,
      },
    };

    const updatedGroups = data.Item.groups ? [...data.Item.groups, groupId] : [groupId];

    const updateUserParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username.toLowerCase() },
      UpdateExpression: 'SET #groups = :groups',
      ExpressionAttributeNames: { '#groups': 'groups' },
      ExpressionAttributeValues: { ':groups': updatedGroups },
    };

    try {
      await docClient.update(updateUserParams).promise();

      const putResult = await docClient.put(params).promise();
      res.json({ data: putResult, newGroup: params.Item, success: 'Group created successfully', newGroup2: data.Item });
    } catch (putErr) {
      res.status(400).json({ errorMessage: 'Error Creating Item' });
      res.json({ error: putErr });
    }

  } catch (err) {
    console.error('Error adding refresh:', err);
    res.status(400).json({ errorMessage: 'ErrorAdding Refresh' });
  }
};









const deleteGroup = async (req, res) => {
  const { username, groupId } = req.body;

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const groupData = await docClient.get(groupParams).promise();
    if (groupData.Item == null) {
      res.status(400).json({ errorMessage: 'Group Not found' });
      return;
    } else {

      if (groupData.Item.host.username.toLowerCase() !== username.toLowerCase()) {
        res.status(400).json({ errorMessage: 'Not the host' });
        return;
      }
    }

    const userParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username.toLowerCase() },
    };

    try {
      const userData = await docClient.get(userParams).promise();

      if (userData.Item == null) {
        res.status(400).json({ errorMessage: 'User not found' });
        return;
      } else {
        // Remove groupId from user's groups attribute
        const updatedGroups = userData.Item.groups.filter(id => id !== groupId);

        const updateUserParams = {
          TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': username.toLowerCase() },
          UpdateExpression: 'SET #groups = :groups',
          ExpressionAttributeNames: { '#groups': 'groups' },
          ExpressionAttributeValues: { ':groups': updatedGroups },
        };

        // Delete the group
        const deleteGroupParams = {
          TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': groupId },
        };

        try {
          await docClient.update(updateUserParams).promise();
          await docClient.delete(deleteGroupParams).promise();

          res.json({ success: 'Group deleted successfully' });
        } catch (deleteErr) {
          console.error('Error deleting group:', deleteErr);
          res.status(400).json({ errorMessage: 'Error deleting group' });
        }
      }
    } catch (getUserErr) {
      console.error('Error getting user data:', getUserErr);
      res.status(400).json({ errorMessage: 'Cant get user data' });
    }

  } catch (err) {
    res.status(400).json({ errorMessage: 'Cant get group data' });
  }
};












const sendInvite = async (req, res) => {
  const { sender,username, groupId } = req.body;

  let responseObj = {userRes:"",groupRes:""}
  let updateGroupParams


  const userParams = {
    TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': username },
  };

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  //check if group includes sender and user then update group invites
  try {

    const groupData = await docClient.get(groupParams).promise();

    if (groupData.Item == null) {
      console.log("DSd")
      res.status(400).json({ errorMessage: 'Group not found' });
      return;
    } else {

      const userInGroup = groupData.Item.usersList.some(user => user.username == username);
      const senderInGroup = groupData.Item.usersList.some(user => user.username == sender);
      console.log("DSdds")

      if (userInGroup) {
        res.status(400).json({ errorMessage: 'User already in group' });
        return;
      }
      console.log(groupData.Item.usersList[0].username===sender)
      console.log(groupData.Item.usersList[0].username)
      console.log(groupData.Item.usersList[0].username)

      if (!senderInGroup) {
        res.status(400).json({ errorMessage: 'Sender not in group' });
        return;
      }
    }

    const updatedGroups = groupData.Item.invites ? [...groupData.Item.invites, username] : [username];

    console.log(updatedGroups)
    updateGroupParams = {
      TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': groupId },
      UpdateExpression: 'SET #invites = :invites',
      ExpressionAttributeNames: { '#invites': 'invites' },
      ExpressionAttributeValues: { ':invites': updatedGroups },
    };
    
    console.log("here10")

    
  }catch(error){
    res.status(400).json({ errorMessage: 'Unkown error' });
    return;
  }



  //now check user and update it
  try {
    console.log("here11")
    const data = await docClient.get(userParams).promise();
    if(data.Item==null){
      res.status(400).json({ errorMessage: 'User not found' });
      return;
    }
    else{
      if(data.Item.invites){
        console.log("in invites")
        const isAlreadyInvited = data.Item.invites?.some(invite => invite.groupId === groupId);
        console.log(isAlreadyInvited)

        if(isAlreadyInvited){
          res.status(400).json({ errorMessage: 'User already invited' });
          return;
        }
      }

    }
    console.log("here12")



    const updateUsers = data.Item.invites ? 
      [...data.Item.invites, {"sender":sender,"groupId":groupId}] : [{"sender":sender,"groupId":groupId}];

    const updateUserParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username },
      UpdateExpression: 'SET #invites = :invites',
      ExpressionAttributeNames: { '#invites': 'invites' },
      ExpressionAttributeValues: { ':invites': updateUsers },
    };

    try {
      const updateResult= await docClient.update(updateUserParams).promise();
      responseObj={...responseObj,userRes:updateResult.Item};
      console.log("succesfullky updated user")
     }
     catch (putErr) {
      res.status(400).json({ errorMessage: 'Error creating user item' });
     }
     console.log("here13")


    try {
      console.log(updateGroupParams);

      const groupRespone =await docClient.update(updateGroupParams).promise();
      console.log("here13.5")
      responseObj={...responseObj,groupRes:groupRespone}
      res.json({success: 'everything good', data : responseObj});
    } catch (putErr) {
      res.status(400).json({ errorMessage: 'Error creating group item' });
    }
    console.log("here14")


  } catch (err) {
    res.status(400).json({ errorMessage: 'User not found' });
  }
};








const toggleInvite = async (req, res) => {
  const { username, groupId,accept } = req.body;

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const groupData = await docClient.get(groupParams).promise();
    if (groupData.Item == null) {
      res.status(400).json({ errorMessage: 'Group not found' });
      return;
    } 

    const userParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username },
    };

    try {
      const userData = await docClient.get(userParams).promise();
      if (userData.Item == null) {
        res.status(400).json({ errorMessage: 'User not found' });
        return;
      } else {
        // Remove groupId from user's groups attribute
        const userHasInvite = userData.Item.invites.some(invite => invite.groupId === groupId);
        if (!userHasInvite) {
          res.status(400).json({ errorMessage: 'User does not have invite' });
          return;
        } 
        const updatedGroups = userData.Item.invites.filter(invite => invite.groupId !== groupId);

        const updateUserParams = {
          TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': username },
          UpdateExpression: 'SET #invites = :invites',
          ExpressionAttributeNames: { '#invites': 'invites' },
          ExpressionAttributeValues: { ':invites': updatedGroups },
        };

        // update the group invites
        const updateInvite = groupData.Item.invites.filter(invite => invite !== username);

        const updateGroupParams = {
          TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': groupId },
          UpdateExpression: 'SET #invites = :invites',
          ExpressionAttributeNames: { '#invites': 'invites' },
          ExpressionAttributeValues: { ':invites': updateInvite },
        };

        try {
          await docClient.update(updateUserParams).promise();
          console.log("worke1")
          await docClient.update(updateGroupParams).promise();
          if(!accept){
            res.json({ success: 'invite removed successfully' });
          }
          
        } catch (deleteErr) {
          res.status(400).json({ errorMessage: 'Error removing invite' });
          res.json({ error: deleteErr });
          return;
        }

        //if accept is true add the user to userslist
        if(accept){
          ///sf

          const newUser = {
            username: userData.Item.username,
            Id: userData.Item.id,
            mileage: 0,
            moneyRaised: 0,
            strikes: 0,
            stravaRefresh: userData.Item.stravaRefresh,
          };
          const updateUsersList = groupData.Item.usersList ? [...groupData.Item.usersList, newUser] : [newUser];
          const updateGroupsList = userData.Item.groups ? [...userData.Item.groups, groupId] : [groupId];


          const updateUserParams2 = {
            TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
            Key: { 'id': username },
            UpdateExpression: 'SET #groups = :groups',
            ExpressionAttributeNames: { '#groups': 'groups' },
            ExpressionAttributeValues: { ':groups': updateGroupsList },
          };

          const updateGroupParams2 = {
            TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
            Key: { 'id': groupId },
            UpdateExpression: 'SET #usersList = :usersList',
            ExpressionAttributeNames: { '#usersList': 'usersList' },
            ExpressionAttributeValues: { ':usersList': updateUsersList },
          };

          try {
            await docClient.update(updateUserParams2).promise();
            await docClient.update(updateGroupParams2).promise();
            res.json({ success: 'invite accepted successfully' });

          } catch (deleteErr) {
            res.status(400).json({ errorMessage: 'Error accepting invite' });
            res.json({ error: deleteErr });

          }
        }
        
      }
    } catch (getUserErr) {
      res.status(400).json({ errorMessage: 'Cant get user data' });
      res.json({ error: getUserErr });
    }

  } catch (err) {
    res.status(400).json({ errorMessage: 'Cant get group data' });
    res.json({ error: err });
  }
};









const leaveGroup = async (req, res) => {
  const { username, groupId } = req.body;
  console.log("hrere1")

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const groupData = await docClient.get(groupParams).promise();
    console.log("hrerw21")
    if (groupData.Item == null) {
      console.log("hrere2")

      res.status(400).json({ errorMessage: 'Group not found' });
      return;
    } 
    else{
      if(groupData.Item.usersList.length<=1){
        res.status(400).json({ errorMessage: 'Last Member left. Delete group instead' });
        return;

      }
     
    }

    const userParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username },
    };

    try {
      const userData = await docClient.get(userParams).promise();
      if (userData.Item == null) {
        console.log("hrere")
        res.status(400).json({ errorMessage: 'User not found' });
        return;
      } else {
        console.log(groupData.Item.usersList)
        console.log("fsf")
        const userInGroup = groupData.Item.usersList.some(user => (user.username === username || (user.Item &&  user?.Item.username===username)));
        console.log(userInGroup)
        console.log(":")
        if(!userInGroup){
          res.status(400).json({ errorMessage: 'User not in group' });
          return;
  
        }
        // Remove groupId from user's groups attribute
        const updatedGroups = userData.Item.groups.filter(id => id !== groupId);
        console.log("here33")

        const updateUserParams = {
          TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': username },
          UpdateExpression: 'SET #groups = :groups',
          ExpressionAttributeNames: { '#groups': 'groups' },
          ExpressionAttributeValues: { ':groups': updatedGroups },
        };

        // Delete the group
        const updatedUsersList = groupData.Item.usersList.filter(user => user.username !== username);
        console.log("here33")
        console.log(updatedUsersList)

        const updateGroupParams = {
          TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': groupId },
          UpdateExpression: 'SET #usersList = :usersList',
          ExpressionAttributeNames: { '#usersList': 'usersList' },
          ExpressionAttributeValues: { ':usersList': updatedUsersList },
        };

        


        try {
          await docClient.update(updateUserParams).promise();
          await docClient.update(updateGroupParams).promise();
          console.log("here33d")

          if(groupData.Item.host.username ===username){
            let newHost;
            if(groupData.Item.usersList[0].username !== username){
              newHost=groupData.Item.usersList[0];
            }
            else{
              newHost=groupData.Item.usersList[1];
            }

            const updateGroupParams2 = {
              TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
              Key: { 'id': groupId },
              UpdateExpression: 'SET #host = :host',
              ExpressionAttributeNames: { '#host': 'host' },
              ExpressionAttributeValues: { ':host': newHost },
            };
            console.log("change host")
            await docClient.update(updateGroupParams2).promise();
            res.json({ success: 'user succesfully left successfully and host changed' });
            return;

          }

          res.json({ success: 'user succesfully left successfully' });
        } catch (deleteErr) {
          res.status(400).json({ errorMessage: "deleteErr" });
        }
      }
    } catch (getUserErr) {
      res.status(400).json({ errorMessage:"getUserErr" });
    }

  } catch (err) {
    res.status(400).json({ errorMessage:"err" });

  }
};




const changeHost = async (req, res) => {
  const { username,currHost,groupId } = req.body;

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const groupData = await docClient.get(groupParams).promise();
    if (groupData.Item == null) {
      res.status(400).json({ errorMessage:'Group not found' });
      return;
    } else {
      console.log(groupData.Item.host)
      if (groupData.Item.host.username !== currHost) {
        res.status(400).json({ errorMessage:'not the host' });
        return;
      }
      if(!groupData.Item.usersList.some(user => user.username == username)){
        res.status(400).json({ errorMessage:'user not in group' });
        return;

      }
      
    }

    const userParams = {
      TableName: 'UsersModel-ssprzv2hibheheyjmea3pzhvle-staging',
      Key: { 'id': username },
    };

    try {
      const userData = await docClient.get(userParams).promise();
      ////
      const hostUser = {
        username: userData.Item.username.toLowerCase(),
        Id: userData.Item.id,
        mileage: 0,
        moneyRaised: 0,
        strikes: 0,
        stravaRefresh: userData.Item.stravaRefresh,
      };
      if (userData.Item == null) {
        res.status(400).json({ errorMessage:'User not found' });
        return;
      } else {
        // Remove groupId from user's groups attribute

        const updateGroupParams = {
          TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
          Key: { 'id': groupId },
          UpdateExpression: 'SET #host = :host',
          ExpressionAttributeNames: { '#host': 'host' },
          ExpressionAttributeValues: { ':host': hostUser },
        };


        try {
          await docClient.update(updateGroupParams).promise();

          res.json({ success: 'host changed successfully' });
        } catch (deleteErr) {
          console.error('Error changing host:', deleteErr);
          res.status(400).json({ errorMessage:deleteErr});
        }
      }
    } catch (getUserErr) {
      res.status(400).json({ errorMessage:getUserErr });
    }

  } catch (err) {
    res.status(400).json({ errorMessage:err });
  }
};

const getGroup=async(req,res)=>{
  const  groupId  = req.query.groupId;

  const userParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const data = await docClient.get(userParams).promise();
    if(data.Item==null){
      res.status(400).json({ errorMessage:'Group not found' });
      return;
    }
    else{
      res.json({group:data.Item})
    }
  }
    catch(error){
      console.log("error",error);
    }
}

const editGroup = async (req, res) => {
  const { username, groupId, startDate, minMile, minDays, groupName, moneyMile } = req.body;

  const groupParams = {
    TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
    Key: { 'id': groupId },
  };

  try {
    const groupData = await docClient.get(groupParams).promise();

    if (groupData.Item == null) {
      res.status(400).json({ errorMessage: 'Group not found' });
      return;
    }

    // Check if the provided username is the host of the group
    if (groupData.Item.host.username !== username) {
      res.status(400).json({ errorMessage: 'You are not the host of this group' });
      return;
    }

    // Prepare an update expression based on the provided attributes
    let updateExpression = 'SET ';
    const expressionAttributeValues = {};

    if (startDate !== undefined) {
      // const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2} \d{4}$/; // Regular expression to match "Mon DD YYYY" format

      updateExpression += 'startDate = :startDate, ';
      expressionAttributeValues[':startDate'] = startDate;
    }

    if (minMile !== undefined) {
      updateExpression += 'minMile = :minMile, ';
      expressionAttributeValues[':minMile'] = minMile;
    }

    if (moneyMile !== undefined) {
      updateExpression += 'moneyMile = :moneyMile, ';
      expressionAttributeValues[':moneyMile'] = moneyMile;
    }

    if (minDays !== undefined) {
      updateExpression += 'minDays = :minDays, ';
      expressionAttributeValues[':minDays'] = minDays;
    }

    if (groupName !== undefined) {
      updateExpression += 'groupName = :groupName, ';
      expressionAttributeValues[':groupName'] = groupName;
    }

    // Remove the trailing comma and space
    updateExpression = updateExpression.slice(0, -2);

    // Update the group attributes if any were provided
    if (updateExpression !== 'SET ') {
      const updateGroupParams = {
        TableName: 'GroupsModel-ssprzv2hibheheyjmea3pzhvle-staging',
        Key: { 'id': groupId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      };

      try {
        await docClient.update(updateGroupParams).promise();
        res.json({ success: 'Group updated successfully' });
      } catch (updateErr) {
        console.error('Error updating group:', updateErr);
        res.status(400).json({ errorMessage: updateErr });
      }
    } else {
      res.json({ success: 'No changes made to the group' });
    }
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(400).json({ errorMessage: error });
  }
};


module.exports = { newGroup, deleteGroup, sendInvite, toggleInvite, leaveGroup, changeHost, getGroup, editGroup };


