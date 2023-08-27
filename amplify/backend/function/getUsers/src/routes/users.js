const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

const groupController = require('../controllers/groupsController');

router.put('/groups/test', groupController.test);
router.post('/groups/newGroup', groupController.newGroup);
router.delete('/groups/deleteGroup', groupController.deleteGroup);
router.put('/groups/sendInvite', groupController.sendInvite);
router.put('/groups/toggleInvite', groupController.toggleInvite);
router.put('/groups/leaveGroup', groupController.leaveGroup);
router.put('/groups/changeHost', groupController.changeHost);

router.post('/newUser', userController.newUser);
router.put('/addStravaRefresh', userController.addStravaRefresh);
router.post('/reauthorizeStrava', userController.reauthorizeStrava);
router.put('/test', userController.test2);


module.exports = router;