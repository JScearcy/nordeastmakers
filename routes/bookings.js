var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');

router.get('/:tool?', function(req, res){
    console.log('listing tools/timeslots already booked', req.params);
    Booking.find({toolId: req.params.tool}, function(err, result){
        console.log('bookings get route listing booked timeslots for ' + req.params + ': ' + result);
        res.send(result);
    })

});



router.post('/', function(req, res){
    console.log('booking tool '+ req.body.toolId + ' on date ' + req.body.date);

    Booking.findOne({toolId: req.body.toolId, date: req.body.date}, function(err, booking){
        if(err){
            console.log(err);
        }
        else if(booking){
            console.log('total bookings for ' + req.body.date + ' and tool ' + req.body.toolId +': ' + booking.reservations);
            booking.reservations = req.body.reservations;
            booking.save(function(err, result){
                if(err){console.log(err)}
                res.send(result);
            })
        }else{
            var booking = new Booking(req.body);
            booking.save(function(err, result){
                if(err){
                    console.log('error thrown ', err.message);
                }
                else{
                    console.log('booking saved');
                    res.sendStatus(200);
                }
            })
        }
    })
});

router.delete('/', function(req, res){
    console.log('removing booking ', req.body.bookingID);
    Booking.findOneAndRemove({_id: req.body.bookingID}, function(err, doc, result){
        if(err){
            console.log('error thrown ', err.message);
        }
        else{
            console.log('booking ' + req.body.bookingID + ' deleted');
            res.sendStatus(200);
        }
    })
});

module.exports = router;
