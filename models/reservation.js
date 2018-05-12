var mongoose = require("mongoose");

var ReservationSchema = new mongoose.Schema({
    sessionId: String,
    reservation_stat: Number,
    reservation_timestamp: Number,
    reservation_time: String, // it's time but i'm wonder if mongoose handel the date type as 2 part so we can use it as time part with current day
    reservation_date: Date,
    user: String
});

var Reservation = mongoose.model('reservation', ReservationSchema);

module.exports = {
    Reservation: Reservation
}
