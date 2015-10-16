var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');

router.get('/:tool?', function(req, res){
    console.log('listing tools/timeslots already booked', req.query.tool);
    Booking.find({tool: req.query.tool}, function(err, result){
        res.send(result);
    })

});


router.post('/', function(req, res){
    console.log('booking tool ',req.body.tool);
    var booking = new Booking(req.body);
    booking.save(function(err){
        if(err){
            console.log('error thrown ', err.message);
        }
        else{
            console.log('booking saved');
            res.sendStatus(200);
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