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
        var resArray;
        var reqArray;
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
            resArray = result.reservations;
            reqArray = req.body.reservations;

            reqArray = spliceArray(resArray, reqArray);
            
            console.log('booking...', reqArray);
            reqArray.forEach(function(element, index, array){
                resArray.push(element);
            })
            console.log('all bookings.. ', resArray);
            result.resevations = resArray;
            result.save(function(err, result){
                if(err){console.log(err);}
                else{
                    res.send(result);
                }
            })
        }

    })//end findOne
})//end post


router.delete('/', function(req, res){
    console.log('deleting....', req.body.reservations);
    var reqArray = req.body.reservations;
    var resArray;

    //var reqArray = [{hr: 12}, {hr: 10}, {hr: 13}, {hr: 14}];
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        if(result){
            resArray = result.reservations;

            result.reservations = spliceArray(reqArray, resArray);
/*

            for(i=0; i<reqArray.length; i++) {
                resArray.forEach(function (element, index, array) {
                    console.log('booked time slot: ', element.hr, reqArray[i].hr);
                    if(element.hr == reqArray[i].hr) {
                        resArray.splice(index, 1);
                    }
                })
            }
*/

            console.log('resArray :', resArray);
            //result.reservations = resArray;
            result.save(function(err, result){
                if(err){console.log(err);}
                res.send(result);
            })
        }

    })
});

function spliceArray(a, b){
    for(i=0; i< a.lenght; i++){
        b.forEach(function(element,index,array){
            if(element.hr == a[i].hr){
                b.splice(index, 1);
            }
        })
    }
    return b;
}

module.exports = router;
