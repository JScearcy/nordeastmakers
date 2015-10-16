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
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        console.log(req.body);
        var check = undefined;
        var tempArray;
        if(err){console.log(err);}

        //if search result empty, create new date object containing reservations of the requested time slots
        if(!result){
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

        //if date objects exists, reserve those timeslots that are avaliable and discard the rest
        if(result){
            console.log('printing previous bookings ', result.reservations);
            tempArray = result.reservations;
            var reqArray = req.body.reservations;

            for(i = 0; i < tempArray.length; i++){
                reqArray.forEach(function(element, index, array){
                    console.log(element.hr);
                    if(element.hr == tempArray[i].hr){
                        console.log('timeslot already booked', element.hr, tempArray[i].hr );
                        reqArray.splice(index, 1);
                        check = true;
                    }
                })
            }
            if(check == true){
                console.log('booking...', reqArray);
                reqArray.forEach(function(element, index, array){
                    tempArray.push(element);
                })
                console.log('all bookings.. ', tempArray);
                result.resevations = tempArray;
                result.save(function(err, result){
                    if(err){console.log(err);}
                    else{
                        res.send(result);
                    }
                })
            }
        }

        //reserve all requested timeslots
        if(result && check==undefined){
            console.log('adding new booking');
            var book = req.body.reservations;
            book.forEach(function(element, index, array){
                tempArray.push(element);
            })
            result.reservations = tempArray;
            result.save(function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result);
                }
            })
        }
        console.log(check);
    })//end findOne
})//end post


router.delete('/', function(req, res){
    console.log('deleting....');
    var reqArray = req.body.reservations;
    //var reqArray = [{hr: 12}, {hr: 10}, {hr: 13}, {hr: 14}];
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        var tempArray;
        if(result){
            tempArray = result.reservations;

            for(i=0; i<reqArray.length; i++) {
                tempArray.forEach(function (element, index, array) {
                    console.log('booked time slot: ', element.hr, reqArray[i].hr);
                    if(element.hr == reqArray[i].hr) {
                        tempArray.splice(index, 1);
                    }
                })
            }

            console.log('temparray :', tempArray);
            result.reservations = tempArray;
            result.save(function(err, result){
                if(err){console.log(err);}
                res.send(result);
            })
        }

    })
});


module.exports = router;
