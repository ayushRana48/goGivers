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

router.post('/users/newUser', userController.newUser);
router.put('/users/addStravaRefresh', userController.addStravaRefresh);
router.post('/users/reauthorizeStrava', userController.reauthorizeStrava);
router.get('/users/getUser', userController.getUser);



module.exports = router;