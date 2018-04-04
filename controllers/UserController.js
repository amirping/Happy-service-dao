const cryptage_engine = require('../js/cryptage');
const User = require('../models/user').User;
const Connection = require('../models/connection').Connection;
const crypto = require('crypto');
module.exports = {
  getUser: function(req, res) {
    // used to return user data
    let token = req.query.token;
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
    // one get 
    let name = req.body.name;
    let last_name = req.body.last_name;
    let resto_name = req.body.resto_name;
    if (!((name == null || name.length == 0) || (resto_name == null || resto_name.length == 0) || (last_name == null || last_name.length == 0))) {
      // keep going 
      let token = req.body.token;
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
              // update the user
              user.name = name;
              user.last_name = last_name;
              user.resto_name = resto_name; 
              user.save(function (err, user) {
                if (err) throw err;
                res.status(200).json({ 'ok': true, 'msg': 'done' });
              });
            }
          });
        }
        else {
          res.status(200).json({'ok':false,'msg': 'cant find user'});
        }
      });
    } else {
      res.status(200).json({'ok':false,'msg':'invalide or empty argument, all argument required'});
    }
  },
  updateUser_security : function(req,res){
    // used to update user security data 
    // on post
    console.log(req);
    let token = req.body.token; 
    let old_pass = req.body.old_password;
    let new_pass = req.body.new_password;
    if (!((old_pass == null || old_pass.length == 0)||(new_pass == null || new_pass.length == 0))) {
      // keep going
      let old_pass_crypted = cryptage_engine.encrypt(old_pass); 
      let token = req.body.token;
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
              // check if old_pass == current pass 
              if(user.password == old_pass_crypted){
                // update the user security
                let new_pass_crypted = cryptage_engine.encrypt(new_pass); 
                user.password = new_pass_crypted;
                user.save(function (err, user) {
                  if (err) throw err;
                  res.status(200).json({ 'ok': true, 'msg': 'done' });
                });
              }
              else{
                res.status(200).json({ 'ok': false, 'msg': 'wrong old password' });
              }              
            }
          });
        }
        else {
          res.status(200).json({ 'ok': false, 'msg': 'cant find user' });
        }
      });
    } else {
      res.status(200).json({ 'ok': false, 'msg': 'invalide or empty argument, all argument required' });
    } 
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
