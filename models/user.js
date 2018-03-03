var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    index: true
  },
  password: String,
  name: String,
  last_name :String,
  resto_name: String
});

var User = mongoose.model('user', UserSchema);

module.exports = {
  User: User
}
