const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.post('/newUser', userController.newUser);
router.put('/addStravaRefresh', userController.addStravaRefresh);
router.post('/reauthorizeStrava', userController.reauthorizeStrava);


module.exports = router;