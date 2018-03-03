var express = require('express')
var userCtrl = require('../controllers/UserController')
var serverCtrl = require('../controllers/ServerController')
var tokenCtrl = require('../controllers/TokenController')

var router = express.Router();

router.route('/user').get(userCtrl.getUser);
router.route('/user').post(userCtrl.postUser);
router.route('/').get(serverCtrl.getApi);
router.route('/token').post(tokenCtrl.isTokenUp);
module.exports = router;
