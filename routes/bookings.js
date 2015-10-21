var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');

router.get('/:toolId?', function(req, res){
    console.log('getting booked timeslots', req.params);
    var today = new Date();
    today.setDate(today.getDate()-1);

    //retrieve all date objects for given toolId and exclude objects that are in the past
    Booking.find({toolId: req.params.toolId},function(err, result){
        var tempArray = [];

        if(err){console.log(err);}
        result.forEach(function(element, index, array){
            if(new Date(element.date) > today){
                tempArray.push(element);
            }
        })
        res.send(tempArray);
    })
})


router.post('/', function(req, res){

    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
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
            req.body.reservations = spliceArray(result.reservations, req.body.reservations);
            req.body.reservations.forEach(function(element, index, array){
                result.reservations.push(element);
            });
            console.log('all bookings.. ', result.reservations);
            result.save(function(err, result){
                if(err){console.log(err);}
                else{
                    res.send(result);
                }
            })
        }

    });//end findOne
});//end post


router.delete('/', function(req, res){

    //Remove requsested timeslots from date object's array of reservations

    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        if(result){
            result.reservations = spliceArray(req.body.reservations, result.reservations);
            console.log('printing reservations length: ', result.reservations.length);
            if(result.reservations.length == 0){
                result.remove(function(err, result){
                    if(err){console.log(err);}
                    res.send(result);
                })
            }
            else {
                result.save(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    res.send(result);
                })
            }
        }

    })
});

function spliceArray(a, b){
    for(i=0; i< a.length; i++){
        b.forEach(function(element,index,array){
            if(element.hr == a[i].hr){
                b.splice(index, 1);
            }
        })
    }
    return b;
}


module.exports = router;

