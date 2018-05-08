var express = require('express')
var userCtrl = require('../controllers/UserController')
var serverCtrl = require('../controllers/ServerController')
var tokenCtrl = require('../controllers/TokenController')

var router = express.Router();
// get user data { no password returned }
router.route('/user').get(userCtrl.getUser);
// update user personel data
router.route('/user').patch(userCtrl.updateUser);
// update user security data 
router.route('/user').put(userCtrl.updateUser_security);
// login user
router.route('/user').post(userCtrl.postUser);
// serve api stat
router.route('/').get(serverCtrl.getApi);
// Token check for the current user 
router.route('/token').post(tokenCtrl.isTokenUp);

module.exports = router;
