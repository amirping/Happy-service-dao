const cryptage_engine = require('../js/cryptage');
const User = require('../models/user').User;
const Connection = require('../models/connection').Connection;
const crypto = require('crypto');
module.exports = {
  getUser: function(req, res) {
    // used to return user data
    let token = req.query.token;
    console.log("token is => "+token);
    Connection.findOne({ 'session_token': token }, function (err, cnx_one) {
      if (err) {
        console.log(err)
        throw err
      }
      if (cnx_one != null) {
        let user_id = cnx_one.id_user;
        User.findById(user_id, function (err, user) {
          if (err) {
            console.log(err);
            throw err
          } else {
            ret_user = user ; 
            ret_user.password = null;
            res.status(200).json({ 'user': ret_user });
          }
         });
      }
      else{
           res.status(200).json({'user':false});       
      }
    });
  },
  updateUser: function(req, res) {
    // userd to update user data
  },
  postUser: function(req, res) {
    // used to login -> gonna create a token and send him back with msg OK
    // otherwise will return error about user that he is not here ppparrraammmmmm
    let b = req.body;
    let pseudo = req.body.pseudo;
    let pass = req.body.pass;
    pass = cryptage_engine.encrypt(pass);
    // find it in db
    User.findOne({
      'pseudo': pseudo,
      'password': pass
    }, 'name last_name', function(err, user) {
      if (err) {
        console.log(err);
        throw err
      } else {
        if (user == null) {
          console.log("Login attempt for user name => " + pseudo + " but not existe ");
          // return
          res.status(200).json({
            "ok": false,
            "msg": "wrong pseudo or password"
          });
        } else {

          console.log('%s %s is here .', user.name, user.last_name);
          // push token to user & store in DB
          let token = crypto.randomBytes(64).toString('hex'); // token
          let con = new Connection({
            id_user: user._id,
            session_token: token
          });
          con.save(function(err,con) {
            if (err) {
              console.log('Error on save!')
              throw err
            }
            res.status(200).json({
              "ok": true,
              "token": token,
              "created_at":con.create_date
            });
          });
        }
      }
    });
  }
}
