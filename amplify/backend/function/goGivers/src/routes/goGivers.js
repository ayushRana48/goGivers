const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

const groupController = require('../controllers/groupsController');

router.post('/groups/newGroup', groupController.newGroup);
router.delete('/groups/deleteGroup', groupController.deleteGroup);
router.put('/groups/sendInvite', groupController.sendInvite);
router.put('/groups/toggleInvite', groupController.toggleInvite);
router.put('/groups/leaveGroup', groupController.leaveGroup);
router.put('/groups/changeHost', groupController.changeHost);
router.get('/groups/getGroup', groupController.getGroup);
router.put('/groups/editGroup', groupController.editGroup);
router.put('/groups/updateUserMiles', groupController.updateUserMiles);
router.put('/groups/updateStrikes', groupController.updateStrikes);
router.put('/groups/findLoser', groupController.findLoser);
router.put('/groups/restartGroup', groupController.restartGroup);


router.post('/users/newUser', userController.newUser);
router.put('/users/addStravaRefresh', userController.addStravaRefresh);
router.put('/users/updateTotalMile', userController.updateTotalMile);
router.post('/users/reauthorizeStrava', userController.reauthorizeStrava);
router.get('/users/getUser', userController.getUser);
router.get('/users/getAllUsers', userController.getAllUsers);



module.exports = router;


