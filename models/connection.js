var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ConnectionSchema = new mongoose.Schema({
  id_user: { type: Schema.Types.ObjectId, ref: 'user' },
  session_token: String,
  create_date: { type: Date, default: Date.now }
});

var Connection = mongoose.model('connection', ConnectionSchema);

module.exports = {
  Connection: Connection
}
