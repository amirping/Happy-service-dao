/*
File created by amir
This file engine is for database basic needs (connection , error handler etc...)
created : 28 wed , feb , 2018 / 17:24
*/
const mongoose = require('mongoose');
//const db_url =  "mongodb://localhost/mongoose_basics";
const db_url = process.env.MONGODB_URI;
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0
};
let stats = {
  DB_linked: false
};
module.exports = {

  connector: function() {
    mongoose.connect(db_url,options, function(error) {
      if (error) console.error(error);
      else console.log('mongo connected');
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console,'connection error:'));
    db.once('open', function() {
      // we're connected!
      stats.DB_linked = true;
      console.log("DATABASE [OK]");
    });
    return db;
  },
  stats
};
