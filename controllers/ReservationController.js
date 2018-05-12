const cryptage_engine = require('../js/cryptage');
const Reservation = require('../models/reservation').Reservation;

module.exports = {
    getReservation: function (req, res) {
        // used to return user data
        let id = req.params.rid;
        Reservation.findById(id, function (err, reservation_one) {
            if (err) {
                console.log(err)
                throw err
            }
            if (reservation_one) {
                res.status(200).json({
                    'ok': true,
                    'reservation': reservation_one
                });
            } else {
                res.status(200).json({
                    'ok': false,
                    'msg': 'not found'
                })
            }
        });
    },
    getAllReservation: function (req, res) {
        Reservation.find({}, function (err, reservations) {
            if (err) {
                console.log(err);
                throw err;
            }
            var reservationMap = [];
            reservations.forEach(reservation => {
                reservationMap.push(reservation);
            });

            res.status(200).json({ 'ok': true, 'data': reservationMap });
        });
    },
    updateReservation: function (req, res) {
        // change stat only 
        let stat = req.body.reservationStat;
        let reservation_db_id = req.params.rid;
        Reservation.findById(reservation_db_id, function (err, reservation) {
            if (err) {
                console.log(err);
                throw err
            } else {
                // update the reservation
                reservation.reservation_stat = stat;
                reservation.save(function (err, reservation) {
                    if (err) throw err;
                    res.status(200).json({
                        'ok': true,
                        'msg': 'done'
                    });
                });
            }
        });
    },
    addReservation: function (req, res) {
        let reservation_tmp = req.body.reservation;
        let reservation = new Reservation(reservation_tmp);
        reservation.save(function (err, reservation) {
            if (err) {
                console.log('Error on save!')
                throw err
            }
            res.status(200).json({
                "ok": true,
                "msg": "saved",
                "id": reservation._id
            });
        });
    }
}