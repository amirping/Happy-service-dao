const User = require('../models/user').User;
const Connection = require('../models/connection').Connection;
module.exports = {
    isTokenUp : function(req, res){
       // return True if token still up else return false
       let token = req.body.token
       let id = req.body.id
       Connection.find({id_user:id}).sort({create_date: -1}).exec(function(err,conx){
         if (err) throw err
         console.log(conx);
         res.status(200).json({
           all: conx
         })
       });
    }
}
