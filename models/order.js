var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
    sessionId: String,
    order_stat: Number,
    order_timestamp: Number,
    order_items: Array,
    user:String
});

var Order = mongoose.model('order', OrderSchema);

module.exports = {
    Order: Order
}
