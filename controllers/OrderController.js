const cryptage_engine = require('../js/cryptage');
const Order = require('../models/order').Order;

module.exports = {
    getOrder: function (req, res) {
        // used to return user data
        let id = req.params.oid;
        Order.findById(id, function (err, order_one) {
            if (err) {
                console.log(err)
                throw err
            }
            if (order_one) {
                res.status(200).json({
                    'ok': true,
                    'order': order_one
                });
            } else {
                res.status(200).json({
                    'ok': false,
                    'msg': 'not found'
                })
            }
        });
    },
    getAllOrder: function (req, res) {
        
        Order.find({}, function (err, ordres) {
            if(err){
                console.log(err);
                throw err;
            }
            var orderMap = [];
            ordres.forEach(order => {
                orderMap.push(order);
            });

            res.status(200).json({ 'ok': true, 'data': orderMap});
        });
    },
    updateOrder: function (req, res) {
        // change stat only 
        let stat = req.body.orderStat;
        let order_db_id = req.params.oid;
        Order.findById(order_db_id, function (err, order) {
            if (err) {
                console.log(err);
                throw err
            } else {
                // update the order
                order.order_stat = stat;
                order.save(function (err, order) {
                    if (err) throw err;
                    res.status(200).json({
                        'ok': true,
                        'msg': 'done'
                    });
                });
            }
        });
    },
    addOrder: function (req, res) {
        let order_tmp = req.body.order;
        let order = new Order(order_tmp);
        order.save(function (err, con) {
            if (err) {
                console.log('Error on save!')
                throw err
            }
            res.status(200).json({
                "ok": true,
                "msg": "saved",
                "id": order._id
            });
        });
    }
}