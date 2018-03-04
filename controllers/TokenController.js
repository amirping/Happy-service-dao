const User = require('../models/user').User;
const Connection = require('../models/connection').Connection;
module.exports = {
    isTokenUp : function(req, res){
       // return True if token still up else return false
       let token = req.body.token
       let date = req.body.date
       //let pseudo = req.body.pseudo // use it to get user _id
       Connection.findOne({'session_token':token}, function (err, cnx_one) {
         if(err){
           console.log(err)
           throw err
         }
         if(cnx_one != null){
           let user_id = cnx_one.id_user;
           // get all cnx for that user -> sort theme -> find out if the token he have is equal to the last date
           Connection.find({id_user:user_id}).sort({create_date: -1}).exec(function(err,conx){
             if (err) {
               console.log(err);
               throw err
             }
             //console.log(conx);
             let given_date = new Date(date);
             let latest_date = new Date(conx[0].create_date.toString())
             given_date.setSeconds(0);
             given_date.setMilliseconds(0);
             latest_date.setSeconds(0)
             latest_date.setMilliseconds(0)
             if (conx[0] != null && given_date.getTime() === latest_date.getTime() && token === conx[0].session_token) {
               res.status(200).json({'isToeknUp':true})
             } else {
               res.status(200).json({'isToeknUp':false})
             }
           });
         }
         else{
           res.status(200).json({'isToeknUp':false});
         }
       });
    }
}
